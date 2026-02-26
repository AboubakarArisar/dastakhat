import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generatePdfFromText } from "../../../lib/pdfGenerator";
import { saveDocument } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { templateId, fields } = body;
    const templatesDir = path.join(process.cwd(), "templates");
    const templatePath = path.join(templatesDir, `${templateId}.md`);
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    let templateText = fs.readFileSync(templatePath, "utf8");

    // robust placeholder replacement: support {{key}} and {key}
    function escapeRegex(s: string) {
      return s.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
    }
    for (const key of Object.keys(fields || {})) {
      const k = escapeRegex(key);
      const re = new RegExp(`{{\\s*${k}\\s*}}|{\\s*${k}\\s*}`, "g");
      templateText = templateText.replace(re, String(fields[key] ?? ""));
    }

    const pdfBytes = await generatePdfFromText(templateText);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    let id = null;
    try {
      id = await saveDocument({ template: templateId, clientName: fields.client_name || "", metadata: fields, pdfBase64 });
    } catch (dbErr: any) {
      // don't fail the whole request if DB is down; return PDF to user
      console.warn("Failed to save document to DB:", dbErr?.message || dbErr);
    }

    return NextResponse.json({ id, pdfBase64 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
