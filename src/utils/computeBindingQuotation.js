/**
 * Binding Quotation Calculator
 *
 * @param {Object} params
 * @param {number} params.copies              - Number of books
 * @param {number} [params.basePrice=250]     - Base price per copy
 * @returns {Object|null}
 */

export function computeBindingQuotation({ copies, basePrice = 250 }) {
  const copiesNum = Number(copies);

  if (!copiesNum || copiesNum <= 0) return null;

  const total = copiesNum * basePrice;
  const perCopy = basePrice;

  return {
    copies: copiesNum,
    basePrice,
    total,
    perCopy,
  };
}
