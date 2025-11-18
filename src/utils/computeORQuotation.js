/**
 * Official Receipt (OR) Quotation Calculator
 *
 * @param {Object} params
 * @param {number} params.quantity                 - Number of OR booklets
 * @param {number} [params.paperCost=20]           - Cost per sheet
 * @param {number} [params.multiplier=1.5]         - Optional markup
 * @returns {Object|null}
 */

export function computeORQuotation({
  quantity,
  paperCost = 20,
  multiplier = 1.5,
}) {
  const qty = Number(quantity);

  if (!qty || qty <= 0) return null;

  // 1 booklet = 50 pages
  const totalPages = qty * 50;

  // Divide by 4 (standard 4-page per printed sheet)
  const requiredSheets = Math.ceil(totalPages / 4);

  // Cost
  const baseCost = requiredSheets * paperCost;
  const total = baseCost * multiplier;

  return {
    quantity: qty,
    totalPages,
    requiredSheets,
    paperCost,
    baseCost,
    multiplier,
    total,
    perBooklet: total / qty,
  };
}
