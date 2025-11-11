
/**
 * @param {Object} params
 * @param {number} params.width 
 * @param {number} params.height
 * @param {number} params.copies
 * @param {boolean} params.colored
 * @param {number} [params.paperCost=20] 
 * @param {number} [params.plateCost=500]
 * @param {number} [params.runCost=400]
 * @param {number} [params.multiplier=2]
 * @returns {Object}
 */

export function computeQuotation({
  width,
  height,
  copies,
  colored,
  paperCost = 20,
  plateCost = 500,
  runCost = 400,
  multiplier = 2,
}) {
  // If any required input is missing, return nothing
  if (!width || !height || !copies) {
    return null;
  }

  // Compute how many "outs" (fit per 25x38 sheet)
  const sheetWidth = 25;
  const sheetHeight = 38;
  const perRow = Math.floor(sheetWidth / width);
  const perCol = Math.floor(sheetHeight / height);
  const outs = perRow * perCol || 1;

  // Compute number of sheets needed
  const sheetsNeeded = Math.ceil(copies / outs);

  // Paper cost
  const totalPaperCost = sheetsNeeded * paperCost;

  // Plate cost
  const plateCount = colored ? 4 : 1;
  const totalPlateCost = plateCount * plateCost;

  // Run cost
  const totalRunCost = plateCount * runCost;

  // Compute total base cost
  const baseCost = totalPaperCost + totalPlateCost + totalRunCost;

  // Apply markup or profit multiplier
  const total = baseCost * multiplier;

  // Compute price per copy
  const perCopy = Math.ceil(total / copies);

  // Return detailed breakdown
  return {
    outs,
    sheetsNeeded,
    totalPaperCost,
    totalPlateCost,
    totalRunCost,
    baseCost,
    total,
    perCopy,
  };
}
