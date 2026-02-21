import { DELIVERY_CHARGE, GIFT_WRAP_CHARGE_PER_ITEM } from '../../data/products';
import { DESIGNS } from '../../data/designs';
import { PRODUCTS } from '../../data/products';
import { RootState } from '../../app/store';
import { Pricing } from './orderTypes';

export const selectOrder = (state: RootState) => state.order;

export const selectSelectedProduct = (state: RootState) =>
  PRODUCTS.find((product) => product.id === state.order.productId) ?? null;

export const selectSelectedDesign = (state: RootState) =>
  DESIGNS.find((design) => design.id === state.order.designId) ?? null;

export const selectFilteredDesigns = (state: RootState) => {
  const selectedProduct = selectSelectedProduct(state);
  if (!selectedProduct) {
    return [];
  }

  return DESIGNS.filter((design) => design.productCategory === selectedProduct.category);
};

export const selectPricing = (state: RootState): Pricing => {
  const product = selectSelectedProduct(state);
  const unitPrice = product?.basePrice ?? 0;
  const quantityTotal = unitPrice * state.order.quantity;
  const giftWrapCharge = state.order.giftWrap ? GIFT_WRAP_CHARGE_PER_ITEM * state.order.quantity : 0;
  const deliveryCharge = quantityTotal > 0 ? DELIVERY_CHARGE : 0;
  const grandTotal = quantityTotal + giftWrapCharge + deliveryCharge;

  return {
    unitPrice,
    quantityTotal,
    giftWrapCharge,
    deliveryCharge,
    grandTotal
  };
};
