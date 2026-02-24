import { DELIVERY_CHARGE, GIFT_WRAP_CHARGE_PER_ITEM, PERSONALIZED_NAME_CHARGE_PER_LETTER } from '../../data/products';
import { DESIGNS } from '../../data/designs';
import { PRODUCTS } from '../../data/products';
import { RootState } from '../../app/store';
import { Pricing } from './orderTypes';
import { evaluateCoupon } from './couponRules';

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

export const selectCouponEvaluation = (state: RootState) => {
  const product = selectSelectedProduct(state);
  const unitPrice = product?.basePrice ?? 0;
  const quantityTotal = unitPrice * state.order.quantity;
  const giftWrapCharge = state.order.giftWrap ? GIFT_WRAP_CHARGE_PER_ITEM * state.order.quantity : 0;
  const personalizedNameLetterCount = state.order.personalizedNote.replace(/\s+/g, '').length;
  const personalizedNameCharge = personalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER;
  const subtotalExcludingDelivery = quantityTotal + giftWrapCharge + personalizedNameCharge;

  return evaluateCoupon(state.order.couponCode, { subtotalExcludingDelivery });
};

export const selectPricing = (state: RootState): Pricing => {
  const product = selectSelectedProduct(state);
  const unitPrice = product?.basePrice ?? 0;
  const quantityTotal = unitPrice * state.order.quantity;
  const giftWrapCharge = state.order.giftWrap ? GIFT_WRAP_CHARGE_PER_ITEM * state.order.quantity : 0;
  const personalizedNameLetterCount = state.order.personalizedNote.replace(/\s+/g, '').length;
  const personalizedNameCharge = personalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER;
  const subtotalBeforeDiscount = quantityTotal + giftWrapCharge + personalizedNameCharge;
  const couponEvaluation = selectCouponEvaluation(state);
  const discountAmount = couponEvaluation.status === 'applied' ? couponEvaluation.discountAmount : 0;
  const totalBeforeDelivery = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const deliveryCharge = quantityTotal > 0 ? DELIVERY_CHARGE : 0;
  const grandTotal = totalBeforeDelivery + deliveryCharge;

  return {
    unitPrice,
    quantityTotal,
    giftWrapCharge,
    personalizedNameLetterCount,
    personalizedNameCharge,
    subtotalBeforeDiscount,
    discountAmount,
    totalBeforeDelivery,
    appliedCouponCode: couponEvaluation.status === 'applied' ? couponEvaluation.code : null,
    deliveryCharge,
    grandTotal
  };
};
