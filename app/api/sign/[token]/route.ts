import { NextResponse } from "next/server";
import {
  getDocumentByToken,
  saveSignerSignature,
  getDocumentById,
  updateDocument,
} from "../../../../lib/db";
import { fillPlaceholder } from "../../../../lib/signers";
import { generatePdfFromText } from "../../../../lib/pdfGenerator";
import { sendCompletedDocument } from "../../../../lib/mailer";

type Ctx = { params: Promise<{ token: string }> };

// Build a human-readable preview where each signature placeholder is shown as a
// labelled marker instead of raw {{...}}.
function buildPreview(content: string, signers: { signatureField: string; label: string; name: string; status: string }[]) {
  let text = content;
  for (const s of signers) {
    const marker = s.status === "signed" ? `[ Signed — ${s.label}: ${s.name || ""} ]` : `[ Awaiting signature — ${s.label} ]`;
    text = fillPlaceholder(text, s.signatureField, marker);
  }
  return text;
}

export async function GET(_req: Request, { params }: Ctx) {
  const { token } = await params;
  const found = await getDocumentByToken(token);
  if (!found) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });

  const { doc, signer } = found;
  return NextResponse.json({
    documentName: doc.title,
    status: doc.status,
    signerLabel: signer.label,
    signerName: signer.name,
    alreadySigned: signer.status === "signed",
    preview: buildPreview(doc.content, doc.signers),
    parties: doc.signers.map((s) => ({ label: s.label, name: s.name, status: s.status })),
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const { token } = await params;
  try {
    const body = await req.json();
    const { signatureDataUrl } = body;
    if (!signatureDataUrl || !/^data:image\//i.test(signatureDataUrl)) {
      return NextResponse.json({ error: "A signature is required" }, { status: 400 });
    }

    const updated = await saveSignerSignature(token, signatureDataUrl);
    if (!updated) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });

    let completed = updated.status === "completed";

    if (completed) {
      // Merge every signer's signature into the final PDF and store it.
      const signatureFields: Record<string, string> = {};
      for (const s of updated.signers) {
        if (s.signatureField && s.signatureDataUrl) signatureFields[s.signatureField] = s.signatureDataUrl;
      }
      try {
        const pdfBytes = await generatePdfFromText(updated.content, { signatureFields });
        const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
        await updateDocument(updated.id, { pdf_base64: pdfBase64, signed: true });

        // Best-effort: email the completed PDF to both parties.
        const recipients = updated.signers.map((s) => s.email).filter(Boolean);
        try {
          await sendCompletedDocument({ to: recipients, documentName: updated.title, pdfBase64 });
        } catch (mailErr: any) {
          console.warn("Completed-document email failed:", mailErr?.message || mailErr);
        }
      } catch (pdfErr: any) {
        console.error("Failed to finalize PDF:", pdfErr?.message || pdfErr);
        // Keep the signature saved; mark as not completed so it can be retried.
        completed = false;
      }
    }

    return NextResponse.json({ ok: true, completed, status: updated.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

// Allow the completed PDF to be downloaded via the signing link too.
export async function PUT(_req: Request, { params }: Ctx) {
  const { token } = await params;
  const found = await getDocumentByToken(token);
  if (!found) return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  const full = await getDocumentById(found.doc.id);
  if (!full?.pdf_base64) return NextResponse.json({ error: "Not ready" }, { status: 404 });
  return NextResponse.json({ pdfBase64: full.pdf_base64, documentName: full.title });
}
