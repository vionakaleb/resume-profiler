import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export async function extractPdfItems(file) {
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items = content.items
      .filter((item) => (item.str || "").trim().length > 0)
      .map((item) => ({
        x: item.transform[4],
        y: viewport.height - item.transform[5],
        width: item.width || 0,
        text: item.str,
      }));
    pages.push({ width: viewport.width, items });
  }
  await doc.destroy();
  return pages;
}
