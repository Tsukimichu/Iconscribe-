export function computeCalendarQuotation({
  quantity,
  calendarType,
  priceBelow600 = 30,
  price600Plus = 28,
}) {
  const qty = Number(quantity);
  if (!qty || qty <= 0 || !calendarType) return null;

  // Determine price per calendar based on quantity
  const pricePerCalendar = qty < 600 ? priceBelow600 : price600Plus;

  // Determine pages/multiplier
  const type = calendarType.toLowerCase();

  let pages = 12; // Single-month default

  if (type.includes("double") || type.includes("6") || type.includes("two")) {
    pages = 6;
  }

  // Total cost
  const total = qty * pricePerCalendar * pages;

  return {
    quantity: qty,
    pricePerCalendar,
    pages,
    total,
    perSet: total / qty,
  };
}
