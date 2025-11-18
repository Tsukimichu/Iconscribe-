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
  // Convert inputs to numbers
  const pagesNum = Number(pages);
  const copiesNum = Number(copies);
  if (!pagesNum || !copiesNum) return null;

  // --- A. Paper cost ---
  const signatures = Math.ceil(pagesNum / signaturePages);
  const sheets = Math.ceil((signatures * copiesNum) / 2);
  const reams = Math.ceil(sheets / 500);
  const paperCost = reams * paperPricePerReam;

  // --- B. Plates cost ---
  const totalPlates = Math.ceil(signatures * platesPerSignature);
  const plateCost = totalPlates * platePrice;

  // --- C. Run/printing cost ---
  let runCost = totalPlates * runPrice;
  if (colored) runCost *= 4; // full color multiplies

  // --- D. Total cost ---
  const baseCost = paperCost + plateCost + runCost;
  const total = baseCost * multiplier;
  const perCopy = total / copiesNum;

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
