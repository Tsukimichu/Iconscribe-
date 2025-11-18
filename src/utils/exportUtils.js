// ----------------------------
// src/utils/exportUtils.js
// ----------------------------
import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";

/**
 * Export as PNG
 * Returns a data URL that you can download.
 */
export async function exportCanvasAsPng(container) {
  if (!container) throw new Error("No canvas container provided");

  try {
    const dataUrl = await toPng(container, {
      cacheBust: true,
      pixelRatio: 2, // higher quality
    });
    return dataUrl;
  } catch (error) {
    console.error("PNG export failed:", error);
    throw error;
  }
}

/**
 * Export as JPG
 * Returns a data URL that you can download.
 */
export async function exportCanvasAsJpg(container) {
  if (!container) throw new Error("No canvas container provided");

  try {
    const dataUrl = await toJpeg(container, {
      cacheBust: true,
      pixelRatio: 2,
      quality: 0.95,
    });
    return dataUrl;
  } catch (error) {
    console.error("JPG export failed:", error);
    throw error;
  }
}

/**
 * Export as PDF
 * This will:
 *  1. Render the canvas as a high-res PNG
 *  2. Create a PDF sized to the image
 *  3. Trigger a download of "canvas.pdf"
 */
export async function exportCanvasAsPdf(container, fileName = "canvas.pdf") {
  if (!container) throw new Error("No canvas container provided");

  try {
    // First, render DOM → PNG
    const dataUrl = await toPng(container, {
      cacheBust: true,
      pixelRatio: 2,
    });

    // Load image to get width/height in pixels
    const img = new Image();
    img.src = dataUrl;

    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const imgWidth = img.width;
    const imgHeight = img.height;

    // Create PDF with same pixel dimensions (pt ~ px for our purpose)
    const orientation = imgWidth >= imgHeight ? "landscape" : "portrait";

    const pdf = new jsPDF({
      orientation,
      unit: "pt",
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error("PDF export failed:", error);
    throw error;
  }
}
