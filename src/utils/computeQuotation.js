export function computeQuotation({
  width,
  height,
  copies,
  colored,
  backToBack = false,
  paperCost = 20,    // cost per 25x38 sheet
  platePrice = 500, 
  runPrice = 400,
  multiplier = 2,
}) {
  if (!width || !height || !copies) return null;

  // --- SHEET SIZE ---
  const sheetWidth = 25;
  const sheetHeight = 38;

  // How many fit on a 25x38 sheet
  const perRow = Math.floor(sheetWidth / width);
  const perCol = Math.floor(sheetHeight / height);
  const outs = Math.max(perRow * perCol, 1);

  // Sheets needed
  const sheetsNeeded = Math.ceil(copies / outs);

  // Spoilage (3% waste standard)
  const waste = Math.ceil(sheetsNeeded * 0.03);
  const totalSheets = sheetsNeeded + waste;

  // Paper cost
  const paperTotal = totalSheets * paperCost;

  // Plates per side
  const platesPerSide = colored ? 4 : 1;

  // TOTAL plates
  const plateCount = backToBack
    ? platesPerSide * 2       // front + back
    : platesPerSide;          // only front

  const plateTotal = plateCount * platePrice;

  // RUN cost
  const runTotal = plateCount * runPrice;

  // Base cost
  const baseCost = paperTotal + plateTotal + runTotal;

  // Final cost
  const total = baseCost * multiplier;

  return {
    outs,
    sheetsNeeded,
    waste,
    totalSheets,
    paperTotal,
    plateCount,
    plateTotal,
    runTotal,
    baseCost,
    total,
    perCopy: Math.ceil(total / copies),
  };
}
