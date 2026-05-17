import { Product, ProductCategory } from '../features/order/orderTypes';

/** Flat delivery for orders that are not fully free-shipping. */
const FLAT_SHIPPING = 70;
/** Free delivery when order total before shipping (after discount) exceeds this. */
export const FREE_SHIPPING_ORDER_MIN = 2000;
/** Free delivery for candle-only carts when sum of candle line prices exceeds this. */
export const FREE_SHIPPING_CANDLE_MERCH_MIN = 1000;

export type CartShippingLine = { product: Product; quantity: number };

export type CartDeliveryContext = {
  /** Sum of (base price × quantity) for all candle lines (before bundle/discount adjustments elsewhere). */
  candleMerchandiseSubtotal: number;
  /** Subtotal after discount, before delivery (matches checkout order total used for payment). */
  orderTotalBeforeDelivery: number;
};

const isSticker = (category: ProductCategory): boolean => category === 'stickers';
const isAccessory = (category: ProductCategory): boolean => category === 'accessories';
const isLightCategory = (category: ProductCategory): boolean => isSticker(category) || isAccessory(category);

/**
 * Flat ₹70 per order (not per line or per unit). Waived when order total before delivery
 * is over ₹2000, or when the cart is candle-only and candle merchandise exceeds ₹1000.
 * Stickers/accessories-only carts use the same flat rate unless the order qualifies for
 * full free shipping.
 */
export const computeCartDeliveryCharge = (lines: CartShippingLine[], context?: CartDeliveryContext): number => {
  if (lines.length === 0) {
    return 0;
  }

  if (context && context.orderTotalBeforeDelivery > FREE_SHIPPING_ORDER_MIN) {
    return 0;
  }

  const onlyLight = lines.every(({ product }) => isLightCategory(product.category));
  if (onlyLight) {
    return FLAT_SHIPPING;
  }

  const candleMerch = context?.candleMerchandiseSubtotal ?? 0;
  const allCandles = lines.every(({ product }) => product.category === 'candles');
  if (context && candleMerch > FREE_SHIPPING_CANDLE_MERCH_MIN && allCandles) {
    return 0;
  }

  return FLAT_SHIPPING;
};
