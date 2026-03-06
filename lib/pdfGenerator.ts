import { PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";

type PdfGenerationOptions = {
  signatureFields?: Record<string, string>;
};

function isDataImage(value: string) {
  return /^data:image\/(png|jpe?g);base64,/i.test(value);
}

export async function generatePdfFromText(text: string, options: PdfGenerationOptions = {}) {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesItalic);
  const signatureFields = options.signatureFields || {};

  const marginX = 62;
  const marginTop = 92;
  const marginBottom = 70;
  const bodySize = 12;
  const titleSize = 18;
  const sectionSize = 13;
  const bodyLineHeight = 18;

  function addPage() {
    const nextPage = pdfDoc.addPage(PageSizes.A4);
    const { width: pageWidth, height: pageHeight } = nextPage.getSize();
    nextPage.drawRectangle({
      x: 42,
      y: 42,
      width: pageWidth - 84,
      height: pageHeight - 84,
      borderColor: rgb(0.78, 0.78, 0.8),
      borderWidth: 0.8,
    });
    return nextPage;
  }

  let page = addPage();
  let { width, height } = page.getSize();
  let y = height - marginTop;

  const maxTextWidth = width - marginX * 2;
  const placeholderRegex = /{{\s*([a-zA-Z0-9_\-]+)\s*}}|{\s*([a-zA-Z0-9_\-]+)\s*}/g;
  const normalized = text.replace(/\r\n/g, "\n");
  const allLines = normalized.split("\n");

  let documentTitle = "OFFICIAL DOCUMENT";
  const contentLines: string[] = [];
  let consumedHeading = false;
  for (const rawLine of allLines) {
    const trimmed = rawLine.trim();
    if (!consumedHeading && /^#\s+/.test(trimmed)) {
      documentTitle = trimmed.replace(/^#\s+/, "").trim() || documentTitle;
      consumedHeading = true;
      continue;
    }
    contentLines.push(rawLine);
  }

  function drawPageHeader(isFirstPage: boolean) {
    if (isFirstPage) {
      const titleWidth = fontBold.widthOfTextAtSize(documentTitle.toUpperCase(), titleSize);
      page.drawText(documentTitle.toUpperCase(), {
        x: (width - titleWidth) / 2,
        y: height - 66,
        size: titleSize,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.14),
      });
      page.drawLine({
        start: { x: marginX, y: height - 78 },
        end: { x: width - marginX, y: height - 78 },
        thickness: 0.8,
        color: rgb(0.55, 0.55, 0.58),
      });
    } else {
      page.drawText(documentTitle, {
        x: marginX,
        y: height - 54,
        size: 10.5,
        font: fontItalic,
        color: rgb(0.35, 0.35, 0.4),
      });
      page.drawLine({
        start: { x: marginX, y: height - 61 },
        end: { x: width - marginX, y: height - 61 },
        thickness: 0.6,
        color: rgb(0.78, 0.78, 0.8),
      });
    }
  }

  drawPageHeader(true);

  function ensureSpace(requiredHeight: number) {
    if (y - requiredHeight < marginBottom) {
      page = addPage();
      ({ width, height } = page.getSize());
      y = height - marginTop;
      drawPageHeader(false);
    }
  }

  function wrapLine(raw: string, fontSize: number, font = fontRegular, lineWidth = maxTextWidth): string[] {
    const words = raw.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];

    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);
      if (candidateWidth <= lineWidth) {
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
    const cleanText = line.replace(placeholderRegex, "").trim();
    const label = cleanText.replace(/:\s*$/, "").trim();
    const textHeight = bodyLineHeight;
    const targetHeight = 40;
    const targetWidth = 165;

    ensureSpace(textHeight + targetHeight + 16);

    if (label) {
      page.drawText(`${label}:`, {
        x: marginX,
        y,
        size: textSize,
        font: fontBold,
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

    const signatureX = marginX + 4;
    const signatureY = y - drawHeight + 8;

    page.drawImage(image, {
      x: signatureX,
      y: signatureY,
      width: drawWidth,
      height: drawHeight,
    });

    const lineY = signatureY - 6;
    page.drawLine({
      start: { x: marginX, y: lineY },
      end: { x: marginX + 240, y: lineY },
      thickness: 0.7,
      color: rgb(0.25, 0.25, 0.28),
    });
    y = lineY - 18;
  }

  for (const rawLine of contentLines) {
    const line = rawLine.trimEnd();

    const signature = extractSignatureFromLine(line);
    if (signature) {
      await drawSignatureLine(line, signature.value);
      continue;
    }

    if (!line.trim()) {
      ensureSpace(bodyLineHeight * 0.55);
      y -= bodyLineHeight * 0.55;
      continue;
    }

    const sectionMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (sectionMatch) {
      const sectionNumber = sectionMatch[1];
      const sectionTitle = sectionMatch[2].trim();
      ensureSpace(bodyLineHeight + 8);
      page.drawText(`${sectionNumber}. ${sectionTitle}`, {
        x: marginX,
        y,
        size: sectionSize,
        font: fontBold,
        color: rgb(0.12, 0.12, 0.16),
      });
      y -= bodyLineHeight;
      page.drawLine({
        start: { x: marginX, y: y + 4 },
        end: { x: width - marginX, y: y + 4 },
        thickness: 0.45,
        color: rgb(0.8, 0.8, 0.83),
      });
      y -= 8;
      continue;
    }

    const isStandaloneLabel = /^Signature:?$/i.test(line);
    if (isStandaloneLabel) {
      ensureSpace(bodyLineHeight + 6);
      page.drawText("Signature", {
        x: marginX,
        y,
        size: sectionSize,
        font: fontBold,
        color: rgb(0.12, 0.12, 0.16),
      });
      y -= bodyLineHeight;
      continue;
    }

    const isBullet = /^[-*]\s+/.test(line.trim());
    const bulletText = isBullet ? line.trim().replace(/^[-*]\s+/, "") : line.trim();
    const lineX = isBullet ? marginX + 14 : marginX;
    const lineWidth = isBullet ? maxTextWidth - 14 : maxTextWidth;
    const wrapped = wrapLine(bulletText, bodySize, fontRegular, lineWidth);

    if (isBullet) {
      ensureSpace(bodyLineHeight);
      page.drawText("•", {
        x: marginX,
        y,
        size: bodySize,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.12),
      });
    }

    for (const part of wrapped) {
      ensureSpace(bodyLineHeight);
      page.drawText(part, {
        x: lineX,
        y,
        size: bodySize,
        font: fontRegular,
        color: rgb(0.1, 0.1, 0.12),
      });
      y -= bodyLineHeight;
    }
  }

  const pages = pdfDoc.getPages();
  const generatedAt = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  pages.forEach((pdfPage, index) => {
    const pageNumber = index + 1;
    const totalPages = pages.length;
    const { width: pageWidth } = pdfPage.getSize();

    pdfPage.drawLine({
      start: { x: marginX, y: 58 },
      end: { x: pageWidth - marginX, y: 58 },
      thickness: 0.6,
      color: rgb(0.8, 0.8, 0.83),
    });

    pdfPage.drawText(`Generated: ${generatedAt}`, {
      x: marginX,
      y: 44,
      size: 9,
      font: fontItalic,
      color: rgb(0.42, 0.42, 0.46),
    });

    const pageText = `Page ${pageNumber} of ${totalPages}`;
    const pageTextWidth = fontItalic.widthOfTextAtSize(pageText, 9);
    pdfPage.drawText(pageText, {
      x: pageWidth - marginX - pageTextWidth,
      y: 44,
      size: 9,
      font: fontItalic,
      color: rgb(0.42, 0.42, 0.46),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
