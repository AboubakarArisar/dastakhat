import { NextResponse } from "next/server";
import { listDocuments, getDocumentPdfBase64, deleteDocument } from "../../../lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const pdfBase64 = await getDocumentPdfBase64(id);
    if (!pdfBase64) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const buffer = Buffer.from(pdfBase64, "base64");
    // inline=1 lets the dashboard open a preview in a new tab instead of forcing a download.
    const inline = url.searchParams.get("inline") === "1";
    const disposition = inline ? "inline" : "attachment";
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="document-${id}.pdf"`,
      },
    });
  }

  try {
    const ownerKey = url.searchParams.get("ownerKey") || "";
    const rows = await listDocuments(ownerKey);
    return NextResponse.json({ documents: rows });
  } catch (err: any) {
    // DB unavailable (e.g. MongoDB not configured) — degrade gracefully so the
    // dashboard still renders instead of erroring.
    console.warn("Failed to list documents:", err?.message || err);
    return NextResponse.json({ documents: [] });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    const ok = await deleteDocument(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
