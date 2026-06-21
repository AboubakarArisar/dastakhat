import { NextResponse } from "next/server";
import { generatePdfFromText } from "../../../lib/pdfGenerator";
import { createDocument } from "../../../lib/db";

// Custom (DIY) documents: the author writes Markdown and generates a finished
// PDF themselves. This is the single-party path — no counterparty signing.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, title, ownerKey = "" } = body;
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    const pdfBytes = await generatePdfFromText(text);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    let id: string | null = null;
    try {
      const doc = await createDocument({
        title: title || "Custom document",
        template: title || "custom",
        ownerKey,
        ownerName: "",
        ownerEmail: "",
        clientName: "",
        content: text,
        signers: [],
        status: "completed",
        metadata: { custom: true },
        pdfBase64,
        signed: false,
      });
      id = doc.id;
    } catch (dbErr: any) {
      console.warn("Failed to save custom document:", dbErr?.message || dbErr);
    }

    return NextResponse.json({ id, pdfBase64 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
