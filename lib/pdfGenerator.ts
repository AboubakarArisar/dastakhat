import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePdfFromText(text: string) {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const marginX = 48;
  const marginTop = 56;
  const marginBottom = 52;
  const bodySize = 11;
  const headingSize = 18;
  const sectionSize = 13;
  const bodyLineHeight = 17;

  const addPage = () => pdfDoc.addPage();
  let page = addPage();
  let { width, height } = page.getSize();
  let y = height - marginTop;

  const maxTextWidth = width - marginX * 2;

  function ensureSpace(requiredHeight: number) {
    if (y - requiredHeight < marginBottom) {
      page = addPage();
      ({ width, height } = page.getSize());
      y = height - marginTop;
    }
  }

  function wrapLine(raw: string, fontSize: number, font = fontRegular): string[] {
    const words = raw.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];

    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);
      if (candidateWidth <= maxTextWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  const rawLines = text.replace(/\r\n/g, "\n").split("\n");
  for (const rawLine of rawLines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      ensureSpace(bodyLineHeight * 0.7);
      y -= bodyLineHeight * 0.7;
      continue;
    }

    if (line.startsWith("# ")) {
      const heading = line.replace(/^#\s+/, "");
      ensureSpace(headingSize + 10);
      page.drawText(heading, {
        x: marginX,
        y,
        size: headingSize,
        font: fontBold,
        color: rgb(0.08, 0.12, 0.2),
      });
      y -= headingSize + 12;
      continue;
    }

    const isSection = /^\d+\.\s+/.test(line) || /^Signature:?$/i.test(line);
    const textFont = isSection ? fontBold : fontRegular;
    const textSize = isSection ? sectionSize : bodySize;
    const lineHeight = isSection ? bodyLineHeight + 2 : bodyLineHeight;
    const wrapped = wrapLine(line, textSize, textFont);

    for (const part of wrapped) {
      ensureSpace(lineHeight);
      page.drawText(part, {
        x: marginX,
        y,
        size: textSize,
        font: textFont,
        color: rgb(0.1, 0.1, 0.12),
      });
      y -= lineHeight;
    }

    if (isSection) {
      y -= 2;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
