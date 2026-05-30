import { Product } from '../features/order/orderTypes';
import { DELIVERY_CHARGE } from '../data/products';

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

const resolveProductShippingRate = (product: Product): number => {
  if (typeof product.shippingCharge === 'number' && Number.isFinite(product.shippingCharge) && product.shippingCharge >= 0) {
    return product.shippingCharge;
  }
  return DELIVERY_CHARGE;
};

const getLineShippingCharge = (product: Product, quantity: number): number => {
  const safeQuantity = Math.max(0, Math.floor(quantity));
  if (safeQuantity === 0) {
    return 0;
  }
  return resolveProductShippingRate(product) * safeQuantity;
};

/**
 * Per-product shipping (rate × quantity on each cart line) when the order is below free-shipping thresholds.
 * Waived when:
 * - Order total before delivery is ≥ ₹2000, or
 * - Candle merchandise subtotal is ≥ ₹1000 (any cart mix).
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

  return lines.reduce((total, { product, quantity }) => total + getLineShippingCharge(product, quantity), 0);
};
