/**
 * @param {Object} params
 * @param {number} params.pages 
 * @param {number} params.copies 
 * @param {boolean} params.colored 
 * @param {number} [params.paperPricePerReam=3000] 
 * @param {number} [params.platePrice=500] 
 * @param {number} [params.runPrice=400] 
 * @param {number} [params.signaturePages=8]
 * @param {number} [params.platesPerSignature=2] 
 * @param {number} [params.multiplier=1] 
 * @returns {Object}
 */
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
  // 1. Number of signatures
  const signatures = pages / signaturePages;

  // 2. Number of sheets
  const sheets = signatures * copies;

  // 3. Number of reams (500 sheets per ream)
  const reams = sheets / 500;

  // 4. Total paper cost
  const paperCost = reams * paperPricePerReam;

  // --- B. FIND PRICE OF PLATES ---
  const totalPlates = signatures * platesPerSignature;
  const plateCost = totalPlates * platePrice;

  // --- C. FIND PRICE OF RUNNING / PRINTING ---
  let runCost = totalPlates * runPrice;
  if (colored) {
    runCost *= 9;
  }

  // --- D. FIND TOTAL COST ---
  const baseCost = paperCost + plateCost + runCost;
  const total = baseCost * multiplier;
  const perCopy = total / copies;

  // --- RETURN BREAKDOWN ---
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
