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
  const pagesNum = Number(pages);
  const copiesNum = Number(copies);
  if (!pagesNum || !copiesNum) return null;

  // A. Number of signatures
  const signatures = pagesNum / signaturePages;

  // B. Sheets needed
  const sheets = (signatures * copiesNum) / 2;

  // C. Reams (round to nearest .50 like handwritten notes)
  const rawReams = sheets / 500;
  const reams = Math.ceil(rawReams * 2) / 2;

  // D. Paper Cost
  const paperCost = reams * paperPricePerReam;

  // E. Plates
  const totalPlates = signatures * platesPerSignature;
  const plateCost = totalPlates * platePrice;

  // F. Running/Printing
  let runCost = totalPlates * runPrice;
  if (colored) runCost *= 4;

  // G. Total
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
