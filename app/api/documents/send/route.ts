import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createDocument, generateToken, SignerRecord } from "../../../../lib/db";
import { getTemplateConfig, isSignatureField, fillPlaceholder } from "../../../../lib/signers";
import { sendSigningInvite } from "../../../../lib/mailer";

// Owner prepares a document and sends it to a counterparty for signature.
// Body: { templateId, fields, ownerName, ownerEmail, ownerSignature,
//         counterpartyName, counterpartyEmail }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      templateId,
      fields = {},
      ownerKey = "",
      ownerName = "",
      ownerEmail = "",
      ownerSignature = "",
      counterpartyName = "",
      counterpartyEmail = "",
    } = body;

    const config = getTemplateConfig(templateId);
    if (!config) return NextResponse.json({ error: "Unknown template" }, { status: 400 });

    const ownerSlot = config.signers.find((s) => s.role === "owner");
    const counterSlot = config.signers.find((s) => s.role === "counterparty");
    if (!ownerSlot || !counterSlot) {
      return NextResponse.json({ error: "Template is not configured for two-party signing" }, { status: 400 });
    }

    const templatePath = path.join(process.cwd(), "templates", `${templateId}.md`);
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    let content = fs.readFileSync(templatePath, "utf8");

    // Merge text fields (NOT signatures — those stay as placeholders for the
    // PDF generator to draw the images into later).
    for (const key of Object.keys(fields)) {
      if (isSignatureField(key)) continue;
      content = fillPlaceholder(content, key, String(fields[key] ?? ""));
    }

    if (!ownerSignature) {
      return NextResponse.json({ error: "Owner signature is required" }, { status: 400 });
    }
    if (!counterpartyEmail.trim()) {
      return NextResponse.json({ error: "Counterparty email is required" }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const counterToken = generateToken();

    const signers: SignerRecord[] = [
      {
        role: "owner",
        label: ownerSlot.label,
        name: ownerName || "Owner",
        email: ownerEmail,
        signatureField: ownerSlot.signatureField,
        signatureDataUrl: ownerSignature,
        token: generateToken(),
        status: "signed",
        signedAt: nowIso,
      },
      {
        role: "counterparty",
        label: counterSlot.label,
        name: counterpartyName || "Counterparty",
        email: counterpartyEmail,
        signatureField: counterSlot.signatureField,
        signatureDataUrl: "",
        token: counterToken,
        status: "pending",
        signedAt: null,
      },
    ];

    const doc = await createDocument({
      title: config.name,
      template: templateId,
      ownerKey,
      ownerName,
      ownerEmail,
      clientName: counterpartyName,
      content,
      signers,
      status: "awaiting_signature",
      metadata: { fields },
      pdfBase64: null,
      signed: false,
    });

    const origin = new URL(req.url).origin;
    const signLink = `${origin}/sign/${counterToken}`;

    // Best-effort email; the link is the primary delivery method.
    let emailed = false;
    try {
      emailed = await sendSigningInvite({
        to: counterpartyEmail,
        counterpartyName,
        ownerName,
        documentName: config.name,
        link: signLink,
      });
    } catch (mailErr: any) {
      console.warn("Signing invite email failed:", mailErr?.message || mailErr);
    }

    return NextResponse.json({ id: doc.id, link: signLink, emailed });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
