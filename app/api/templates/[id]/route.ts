import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: RouteContext) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  if (!id) return NextResponse.json({ error: "Missing template id" }, { status: 400 });
  const templatesDir = path.join(process.cwd(), "templates");
  const templatePath = path.join(templatesDir, `${id}.md`);
  if (!fs.existsSync(templatePath)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const text = fs.readFileSync(templatePath, "utf8");
  return NextResponse.json({ id, text });
}
