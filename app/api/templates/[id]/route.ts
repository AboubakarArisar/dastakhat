import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const templatesDir = path.join(process.cwd(), "templates");
  const templatePath = path.join(templatesDir, `${id}.md`);
  if (!fs.existsSync(templatePath)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const text = fs.readFileSync(templatePath, "utf8");
  return NextResponse.json({ id, text });
}
