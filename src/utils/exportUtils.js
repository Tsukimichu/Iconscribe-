// ----------------------------
// src/utils/exportUtils.js
// ----------------------------
import { toPng } from 'html-to-image'

export async function exportCanvasAsPng(container){
  if(!container) return
  // remove selection outlines by cloning and resetting selectable decorations if needed
  return toPng(container, {cacheBust: true})
}
