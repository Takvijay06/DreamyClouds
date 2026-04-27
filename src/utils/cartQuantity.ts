/**
 * Coerces cart line or order quantity to a positive integer.
 * (Persisted / legacy state may store quantity as a string, which would break `+=` in reducers.)
 */
export const toCartLineQuantity = (value: unknown): number => {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return n;
};

/**
 * Coerces stock limits to a positive integer cap.
 * Returns null when stock should be treated as "not capped / unknown".
 */
export const toAvailableQuantityCap = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) {
    return null;
  }
  return n;
};
