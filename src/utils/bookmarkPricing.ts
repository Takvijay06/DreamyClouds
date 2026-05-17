/** Single bookmark list price (pairs bill at {@link BOOKMARK_PAIR_TOTAL} for two). */
export const BOOKMARK_UNIT_PRICE = 99;
/** Cart total for every two bookmarks in the same order. */
export const BOOKMARK_PAIR_TOTAL = 149;

export const bookmarkMerchandiseSubtotal = (totalQuantity: number): number => {
  if (totalQuantity <= 0) {
    return 0;
  }
  const pairs = Math.floor(totalQuantity / 2);
  const singles = totalQuantity % 2;
  return pairs * BOOKMARK_PAIR_TOTAL + singles * BOOKMARK_UNIT_PRICE;
};
