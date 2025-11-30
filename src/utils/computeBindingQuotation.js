export function computeBindingQuotation({ copies, bindingPrice }) {
  const copiesNum = Number(copies);
  const priceNum = Number(bindingPrice);

  if (!copiesNum || copiesNum <= 0 || !priceNum) return null;

  const total = copiesNum * priceNum;

  return {
    copies: copiesNum,
    bindingPrice: priceNum,
    total,
    perCopy: priceNum,
  };
}
