// ----------------------------
// src/utils/exportUtils.js
// ----------------------------
import { toPng, toJpeg, toSvg } from "html-to-image";
import jsPDF from "jspdf";

/**
 * Export as PNG
 */
export async function exportCanvasAsPng(container) {
  if (!container) return;
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
 */
export async function exportCanvasAsJpg(container) {
  if (!container) return;
  try {
    const dataUrl = await toJpeg(container, {
      cacheBust: true,
      pixelRatio: 2,
      quality: 0.95, // higher quality JPG
    });
    return dataUrl;
  } catch (error) {
    console.error("JPG export failed:", error);
    throw error;
  }
}

/**
 * Export as SVG
 */
export async function exportCanvasAsSvg(container) {
  if (!container) return;
  try {
    const dataUrl = await toSvg(container, {
      cacheBust: true,
    });
    return dataUrl;
  } catch (error) {
    console.error("SVG export failed:", error);
    throw error;
  }
}

/**
 * Export as PDF
 */
export async function exportCanvasAsPdf(container) {
  if (!container) return;
  try {
    // convert container to PNG first
    const dataUrl = await toPng(container, {
      cacheBust: true,
      pixelRatio: 2,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    return pdf.output("dataurlstring");
  } catch (error) {
    console.error("PDF export failed:", error);
    throw error;
  }
}
