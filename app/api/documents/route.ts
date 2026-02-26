import { NextResponse } from "next/server";
import { listDocuments, getDocumentPdfBase64 } from "../../../lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const pdfBase64 = getDocumentPdfBase64(Number(id));
    if (!pdfBase64) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const buffer = Buffer.from(pdfBase64, "base64");
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="document-${id}.pdf"`,
      },
    });
  }

  const rows = listDocuments();
  return NextResponse.json({ documents: rows });
}
