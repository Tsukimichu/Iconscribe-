export function computeORQuotation({
  quantity,
  paperCost = 20,        // cost per sheet
  platePrice = 500,      // 2 plates (front/back)
  runPrice = 400,        // per plate
  parts = 2,             // 2-part NCR by default
  multiplier = 1.5,
}) {
  const qty = Number(quantity);
  if (!qty || qty <= 0) return null;

  // 1 booklet = 50 sets × number of parts
  const totalPages = qty * 50 * parts;

  // Standard: 4 pages per sheet
  const requiredSheets = Math.ceil(totalPages / 4);

  // Paper cost
  const paperTotal = requiredSheets * paperCost;

  // Plates (always 2 plates for OR: front & back)
  const totalPlates = 2;
  const plateTotal = totalPlates * platePrice;

  // Running cost
  const runTotal = totalPlates * runPrice;

  // Total cost
  const baseCost = paperTotal + plateTotal + runTotal;
  const total = baseCost * multiplier;

  return {
    quantity: qty,
    parts,
    totalPages,
    requiredSheets,
    paperCost,
    paperTotal,
    totalPlates,
    plateTotal,
    runTotal,
    baseCost,
    total,
    perBooklet: total / qty,
  };
}
