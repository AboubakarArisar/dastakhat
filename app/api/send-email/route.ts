import 'dotenv/config';
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getDocumentPdfBase64 } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, to, subject, text } = body;
    if (!id || !to) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    const pdfBase64 = await getDocumentPdfBase64(id);
    if (!pdfBase64) return NextResponse.json({ error: "Document not found" }, { status: 404 });

    const smtpUrl = process.env.SMTP_URL || process.env.SMTP_TRANSPORT || process.env.SMTP;
    if (!smtpUrl) return NextResponse.json({ error: "SMTP not configured" }, { status: 500 });

    const transporter = nodemailer.createTransport(smtpUrl as any);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || (session.user?.email as string) || "no-reply@example.com",
      to,
      subject: subject || "Document from Signeasy",
      text: text || "Please find the attached document.",
      attachments: [
        {
          filename: `document-${id}.pdf`,
          content: Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ ok: true, info });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
