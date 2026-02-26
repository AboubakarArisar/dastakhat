import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePdfFromText(text: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lines = text.split("\n");

  let y = height - 64;
  for (const line of lines) {
    page.drawText(line, {
      x: 48,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= fontSize + 6;
    if (y < 48) {
      y = height - 64;
      // simple pagination
      // (for MVP we don't add a new page for remaining text - keep simple)
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
