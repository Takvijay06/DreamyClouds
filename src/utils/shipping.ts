import { DELIVERY_CHARGE } from '../data/products';
import { Product, ProductCategory } from '../features/order/orderTypes';

const LIGHT_ORDER_FLAT = 70;
const NON_JAR_CANDLE_BLOCK_SIZE = 3;
const NON_JAR_CANDLE_BLOCK_CHARGE = 70;
/** Free delivery when order total before shipping (after discount) exceeds this. */
export const FREE_SHIPPING_ORDER_MIN = 2000;
/** Waive only candle-related shipping when sum of candle line prices exceeds this. */
export const FREE_SHIPPING_CANDLE_MERCH_MIN = 1000;

export type CartShippingLine = { product: Product; quantity: number };

export type CartDeliveryContext = {
  /** Sum of (base price × quantity) for all candle lines. */
  candleMerchandiseSubtotal: number;
  /** Subtotal after discount, before delivery (matches checkout order total used for payment). */
  orderTotalBeforeDelivery: number;
};

const isSticker = (category: ProductCategory): boolean => category === 'stickers';
const isAccessory = (category: ProductCategory): boolean => category === 'accessories';
const isLightCategory = (category: ProductCategory): boolean => isSticker(category) || isAccessory(category);

const isNonJarCandle = (p: Product): boolean => p.category === 'candles' && p.candleJarPackaged === false;

const normalizedUnitShipping = (p: Product): number => {
  const s = p.shippingCharge ?? DELIVERY_CHARGE;
  return typeof s === 'number' && Number.isFinite(s) && s >= 0 ? s : 0;
};

const defaultShippingQuantityMode = (p: Product): 'per_item' | 'per_line' => {
  if (p.shippingQuantityMode === 'per_line' || p.shippingQuantityMode === 'per_item') {
    return p.shippingQuantityMode;
  }
  if (p.category === 'tumblers' || p.category === 'mugs' || p.category === 'candles') {
    return 'per_item';
  }
  return 'per_line';
};

const lineShippingFromConfig = (p: Product, qty: number): number => {
  const unit = normalizedUnitShipping(p);
  return defaultShippingQuantityMode(p) === 'per_line' ? unit : unit * qty;
};

const nonJarCandleShipping = (totalQty: number): number => {
  if (totalQty <= 0) {
    return 0;
  }
  return Math.ceil(totalQty / NON_JAR_CANDLE_BLOCK_SIZE) * NON_JAR_CANDLE_BLOCK_CHARGE;
};

/**
 * Cart-level delivery charge from business rules (stickers, accessories, drinkware, candles).
 * Optional context applies free-shipping thresholds for orders and candle merchandise.
 */
export const computeCartDeliveryCharge = (lines: CartShippingLine[], context?: CartDeliveryContext): number => {
  if (lines.length === 0) {
    return 0;
  }

  const onlyLight = lines.every(({ product }) => isLightCategory(product.category));

  if (onlyLight) {
    if (context && context.orderTotalBeforeDelivery > FREE_SHIPPING_ORDER_MIN) {
      return 0;
    }
    return LIGHT_ORDER_FLAT;
  }

  let nonHeavyShipping = 0;
  let nonJarCandleQty = 0;
  let jarCandleShipping = 0;

  for (const { product, quantity } of lines) {
    if (product.category === 'stickers' || product.category === 'accessories') {
      continue;
    }
    if (product.category === 'candles') {
      if (isNonJarCandle(product)) {
        nonJarCandleQty += quantity;
      } else {
        jarCandleShipping += lineShippingFromConfig(product, quantity);
      }
      continue;
    }
    nonHeavyShipping += lineShippingFromConfig(product, quantity);
  }

  const nonJarCandleShip = nonJarCandleShipping(nonJarCandleQty);
  const candleShipping = jarCandleShipping + nonJarCandleShip;
  let total = nonHeavyShipping + candleShipping;

  if (context && context.orderTotalBeforeDelivery > FREE_SHIPPING_ORDER_MIN) {
    return 0;
  }

  if (context && context.candleMerchandiseSubtotal > FREE_SHIPPING_CANDLE_MERCH_MIN) {
    total -= candleShipping;
  }

  return total;
};
