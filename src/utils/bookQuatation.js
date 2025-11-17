export function computeBookQuotation({
  pages,
  copies,
  colored,
  paperPricePerReam = 3000,
  platePrice = 500,
  runPrice = 400,
  signaturePages = 8,
  platesPerSignature = 2,
  multiplier = 1,
}) {
  if (!pages || !copies) return null;

  // --- A. FIND PRICE OF PAPER ---
  const signatures = Math.ceil(pages / signaturePages); // always round up
  const sheets = Math.ceil((signatures * copies) / 2); // 2 pages per sheet
  const reams = Math.ceil(sheets / 500); // round up reams
  const paperCost = reams * paperPricePerReam;

  // --- B. FIND PRICE OF PLATES ---
  const totalPlates = Math.ceil(signatures * platesPerSignature); 
  const plateCost = totalPlates * platePrice;

  // --- C. FIND PRICE OF RUNNING / PRINTING ---
  let runCost = totalPlates * runPrice;

  // Colored printing multiplies the run cost by 4
  if (colored) {
    runCost *= 4;
  }

  // --- D. FIND TOTAL COST ---
  const baseCost = paperCost + plateCost + runCost;
  const total = baseCost * multiplier;
  const perCopy = total / copies;

  return {
    signatures,
    sheets,
    reams,
    paperCost,
    totalPlates,
    plateCost,
    runCost,
    baseCost,
    total,
    perCopy,
  };
}
