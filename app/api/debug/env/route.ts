import 'dotenv/config';
import { NextResponse } from "next/server";

function mask(s: string | undefined) {
  if (!s) return null;
  if (s.length <= 8) return s[0] + "***" + s.slice(-1);
  return s.slice(0, 4) + "..." + s.slice(-4);
}

export async function GET() {
  // Dev-only: return presence and masked values for troubleshooting
  const vars = {
    GITHUB_ID: mask(process.env.GITHUB_ID),
    GITHUB_SECRET: mask(process.env.GITHUB_SECRET),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "(present)" : null,
    MONGODB_URI: process.env.MONGODB_URI ? (process.env.MONGODB_URI.includes("+srv") ? "(present, uses +srv)" : "(present, non-srv)") : null,
    SMTP_URL: mask(process.env.SMTP_URL || process.env.SMTP_TRANSPORT),
    EMAIL_FROM: process.env.EMAIL_FROM || null,
  };

  return NextResponse.json({ ok: true, vars });
}
