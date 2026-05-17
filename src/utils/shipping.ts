import { Product, ProductCategory } from '../features/order/orderTypes';

/** Flat delivery for orders that are not fully free-shipping. */
const FLAT_SHIPPING = 70;
/** Free delivery when order total before shipping (after discount) is at least this. */
export const FREE_SHIPPING_ORDER_MIN = 2000;
/** Free delivery when candle merchandise (base + candle extras on candle lines) is at least this. */
export const FREE_SHIPPING_CANDLE_MERCH_MIN = 1000;

export type CartShippingLine = { product: Product; quantity: number };

export type CartDeliveryContext = {
  /** Sum over candle lines: line base total + scented + daisy note (before delivery / discount split). */
  candleMerchandiseSubtotal: number;
  /** Subtotal after discount, before delivery (matches checkout order total used for payment). */
  orderTotalBeforeDelivery: number;
};

const isSticker = (category: ProductCategory): boolean => category === 'stickers';
const isAccessory = (category: ProductCategory): boolean => category === 'accessories';
const isLightCategory = (category: ProductCategory): boolean => isSticker(category) || isAccessory(category);

/**
 * Flat ₹70 per order (not per line or per unit). Waived when:
 * - Order total before delivery is ≥ ₹2000, or
 * - Candle merchandise subtotal (including candle add-ons) is ≥ ₹1000 (any cart mix).
 * Stickers/accessories-only carts pay flat ₹70 unless one of the rules above applies.
 */
export const computeCartDeliveryCharge = (lines: CartShippingLine[], context?: CartDeliveryContext): number => {
  if (lines.length === 0) {
    return 0;
  }

  if (context && context.orderTotalBeforeDelivery >= FREE_SHIPPING_ORDER_MIN) {
    return 0;
  }

  const candleMerch = context?.candleMerchandiseSubtotal ?? 0;
  if (context && candleMerch >= FREE_SHIPPING_CANDLE_MERCH_MIN) {
    return 0;
  }

  const onlyLight = lines.every(({ product }) => isLightCategory(product.category));
  if (onlyLight) {
    return FLAT_SHIPPING;
  }

  return FLAT_SHIPPING;
};
