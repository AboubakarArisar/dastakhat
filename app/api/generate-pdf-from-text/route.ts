import { NextResponse } from "next/server";
import { generatePdfFromText } from "../../../lib/pdfGenerator";
import { saveDocument } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, title } = body;
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    const pdfBytes = await generatePdfFromText(text);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    const id = await saveDocument({ template: title || "custom", clientName: "", metadata: { custom: true }, pdfBase64 });

    return NextResponse.json({ id, pdfBase64 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
