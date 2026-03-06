import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type PdfGenerationOptions = {
  signatureFields?: Record<string, string>;
};

function isDataImage(value: string) {
  return /^data:image\/(png|jpe?g);base64,/i.test(value);
}

export async function generatePdfFromText(text: string, options: PdfGenerationOptions = {}) {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const signatureFields = options.signatureFields || {};

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
  const placeholderRegex = /{{\s*([a-zA-Z0-9_\-]+)\s*}}|{\s*([a-zA-Z0-9_\-]+)\s*}/g;

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

  function extractSignatureFromLine(line: string) {
    placeholderRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = placeholderRegex.exec(line))) {
      const key = match[1] || match[2];
      const value = String(signatureFields[key] ?? "");
      if (isDataImage(value)) {
        return { key, value };
      }
    }
    return null;
  }

  async function drawSignatureLine(line: string, signatureDataUrl: string) {
    const cleanText = line.replace(placeholderRegex, "").trimEnd();
    const textSize = bodySize;
    const textHeight = bodyLineHeight;
    const targetHeight = 42;
    const targetWidth = 150;
    const verticalGap = 8;

    ensureSpace(textHeight + targetHeight + verticalGap);

    if (cleanText) {
      page.drawText(cleanText, {
        x: marginX,
        y,
        size: textSize,
        font: fontRegular,
        color: rgb(0.1, 0.1, 0.12),
      });
      y -= textHeight;
    }

    let image;
    if (/^data:image\/png;base64,/i.test(signatureDataUrl)) {
      const base64 = signatureDataUrl.replace(/^data:image\/png;base64,/i, "");
      image = await pdfDoc.embedPng(base64);
    } else {
      const base64 = signatureDataUrl.replace(/^data:image\/jpe?g;base64,/i, "");
      image = await pdfDoc.embedJpg(base64);
    }

    const scale = Math.min(targetWidth / image.width, targetHeight / image.height);
    const drawWidth = Math.max(80, image.width * scale);
    const drawHeight = Math.max(24, image.height * scale);

    page.drawImage(image, {
      x: marginX,
      y: y - drawHeight + 8,
      width: drawWidth,
      height: drawHeight,
    });
    y -= drawHeight + verticalGap;
  }

  const rawLines = text.replace(/\r\n/g, "\n").split("\n");
  for (const rawLine of rawLines) {
    const line = rawLine.trimEnd();

    const signature = extractSignatureFromLine(line);
    if (signature) {
      await drawSignatureLine(line, signature.value);
      continue;
    }

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
