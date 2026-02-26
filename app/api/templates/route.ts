import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const templatesDir = path.join(process.cwd(), "templates");
  const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith(".md"));
  const list = files.map((f) => ({ id: f.replace(/\.md$/, ""), name: f.replace(/\.md$/, "") }));
  return NextResponse.json({ templates: list });
}
