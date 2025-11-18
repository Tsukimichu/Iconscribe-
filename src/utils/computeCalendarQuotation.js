/**
 * Calendar Quotation Calculator
 *
 * @param {Object} params
 * @param {number} params.quantity          - Number of calendar sets
 * @param {string} params.calendarType      - "Single Month (12 pages)" or "Double Month (6 pages)"
 * @returns {Object|null}
 */

export function computeCalendarQuotation({
  quantity,
  calendarType,
}) {
  const qty = Number(quantity);

  if (!qty || qty <= 0 || !calendarType) return null;

  // Base price condition
  const pricePerCalendar = qty < 600 ? 30 : 28;

  // Determine multiplier
  let multiplier = 12; // default: single month

  if (calendarType.toLowerCase().includes("double")) {
    multiplier = 6;
  }

  // Total cost
  const total = qty * pricePerCalendar * multiplier;

  return {
    quantity: qty,
    pricePerCalendar,
    multiplier,
    total,
    perSet: total / qty,
  };
}
