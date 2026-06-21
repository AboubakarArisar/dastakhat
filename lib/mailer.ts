import "dotenv/config";
import nodemailer from "nodemailer";

// Thin wrapper around nodemailer. If SMTP isn't configured these helpers simply
// return false (no throw), so the shareable-link flow keeps working without email.

function getTransport() {
  const smtpUrl = process.env.SMTP_URL || process.env.SMTP_TRANSPORT || process.env.SMTP;
  if (!smtpUrl) return null;
  return nodemailer.createTransport(smtpUrl as any);
}

const FROM = process.env.EMAIL_FROM || "no-reply@dastakhat.app";

export async function sendSigningInvite(opts: {
  to: string;
  counterpartyName?: string;
  ownerName?: string;
  documentName: string;
  link: string;
}): Promise<boolean> {
  const transporter = getTransport();
  if (!transporter) return false;

  const greeting = opts.counterpartyName ? `Hi ${opts.counterpartyName},` : "Hi,";
  const from = opts.ownerName ? `${opts.ownerName} via Dastakhat` : "Dastakhat";

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `${opts.ownerName || "Someone"} sent you "${opts.documentName}" to sign`,
    text: `${greeting}\n\nYou've been asked to review and sign "${opts.documentName}".\n\nOpen this link to sign:\n${opts.link}\n\n— ${from}`,
    html: `<p>${greeting}</p><p>You've been asked to review and sign <strong>${opts.documentName}</strong>.</p><p><a href="${opts.link}">Review &amp; sign the document</a></p><p>— ${from}</p>`,
  });
  return true;
}

export async function sendCompletedDocument(opts: {
  to: string[];
  documentName: string;
  pdfBase64: string;
}): Promise<boolean> {
  const transporter = getTransport();
  if (!transporter) return false;

  const recipients = opts.to.filter(Boolean);
  if (recipients.length === 0) return false;

  await transporter.sendMail({
    from: FROM,
    to: recipients.join(", "),
    subject: `Completed: "${opts.documentName}" is fully signed`,
    text: `All parties have signed "${opts.documentName}". The completed document is attached.`,
    html: `<p>All parties have signed <strong>${opts.documentName}</strong>.</p><p>The completed document is attached.</p>`,
    attachments: [
      {
        filename: `${opts.documentName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`,
        content: Buffer.from(opts.pdfBase64, "base64"),
        contentType: "application/pdf",
      },
    ],
  });
  return true;
}
