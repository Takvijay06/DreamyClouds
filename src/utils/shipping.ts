import { DELIVERY_CHARGE } from '../data/products';
import { Product, ProductCategory } from '../features/order/orderTypes';

/** Free delivery when tumbler / mug merchandise exceeds this (strictly above). */
export const FREE_SHIPPING_TUMBLER_MERCH_MIN = 2000;
/** Free delivery when candle merchandise exceeds this (strictly above). */
export const FREE_SHIPPING_CANDLE_MERCH_MIN = 1000;
/** @deprecated Use FREE_SHIPPING_TUMBLER_MERCH_MIN — kept for existing imports. */
export const FREE_SHIPPING_ORDER_MIN = FREE_SHIPPING_TUMBLER_MERCH_MIN;

const NON_JAR_CANDLE_BLOCK_SIZE = 3;

export type CartShippingLine = { product: Product; quantity: number };

export type CartDeliveryContext = {
  /** Sum over tumbler + mug lines: base + sticker add-ons. */
  tumblerMerchandiseSubtotal: number;
  /** Sum over candle lines: base + scented + daisy note. */
  candleMerchandiseSubtotal: number;
};

const isSticker = (category: ProductCategory): boolean => category === 'stickers';
const isAccessory = (category: ProductCategory): boolean => category === 'accessories';
const isLightCategory = (category: ProductCategory): boolean => isSticker(category) || isAccessory(category);
const isDrinkware = (category: ProductCategory): boolean => category === 'tumblers' || category === 'mugs';
const isNonJarCandle = (product: Product): boolean => product.category === 'candles' && product.candleJarPackaged === false;

const usesPerItemShipping = (product: Product): boolean =>
  isDrinkware(product.category) || (product.category === 'candles' && !isNonJarCandle(product));

export const resolveProductShippingRate = (product: Product): number => {
  if (typeof product.shippingCharge === 'number' && Number.isFinite(product.shippingCharge) && product.shippingCharge >= 0) {
    return product.shippingCharge;
  }
  return DELIVERY_CHARGE;
};

/** Shipping for one cart line: API rate × quantity for drinkware / jar candles; tiered blocks for pillar candles. */
export const getProductLineShippingCharge = (product: Product, quantity: number): number => {
  const safeQuantity = Math.max(0, Math.floor(quantity));
  if (safeQuantity === 0) {
    return 0;
  }

  const rate = resolveProductShippingRate(product);

  if (isNonJarCandle(product)) {
    return Math.ceil(safeQuantity / NON_JAR_CANDLE_BLOCK_SIZE) * rate;
  }

  if (usesPerItemShipping(product)) {
    return rate * safeQuantity;
  }

  return rate;
};

const isTumblerShippingFree = (context?: CartDeliveryContext): boolean =>
  (context?.tumblerMerchandiseSubtotal ?? 0) > FREE_SHIPPING_TUMBLER_MERCH_MIN;

const isCandleShippingFree = (context?: CartDeliveryContext): boolean =>
  (context?.candleMerchandiseSubtotal ?? 0) > FREE_SHIPPING_CANDLE_MERCH_MIN;

const shouldChargeLineShipping = (product: Product, context?: CartDeliveryContext): boolean => {
  if (isDrinkware(product.category)) {
    return !isTumblerShippingFree(context);
  }
  if (product.category === 'candles') {
    return !isCandleShippingFree(context);
  }
  return true;
};

/**
 * Cart delivery from API shipping rates.
 * - Tumblers & mugs: rate × quantity (each + click adds one unit of shipping).
 * - Jar candles: rate × quantity; pillar / non-jar: rate per block of 3.
 * - Other categories: one rate per cart line.
 * - Stickers / accessories only: flat API default rate.
 * Free when merchandise subtotal is above ₹2000 (tumblers/mugs) or ₹1000 (candles).
 */
export const computeCartDeliveryCharge = (lines: CartShippingLine[], context?: CartDeliveryContext): number => {
  if (lines.length === 0) {
    return 0;
  }

  const onlyLight = lines.every(({ product }) => isLightCategory(product.category));
  if (onlyLight) {
    return resolveProductShippingRate(lines[0].product);
  }

  let total = 0;

  for (const { product, quantity } of lines) {
    if (isLightCategory(product.category)) {
      continue;
    }
    if (!shouldChargeLineShipping(product, context)) {
      continue;
    }
    total += getProductLineShippingCharge(product, quantity);
  }

  return total;
};
