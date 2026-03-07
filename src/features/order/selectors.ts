import { DELIVERY_CHARGE, GIFT_WRAP_CHARGE_PER_ITEM, PERSONALIZED_NAME_CHARGE_PER_LETTER } from '../../data/products';
import { DESIGNS } from '../../data/designs';
import { PRODUCTS } from '../../data/products';
import { RootState } from '../../app/store';
import { Pricing, ProductCategory, StickerSubCategory } from './orderTypes';
import { evaluateCoupon } from './couponRules';

const resolveStickerSubCategory = (value: unknown): StickerSubCategory =>
  value === 'full-wrap' ? 'full-wrap' : 'single';
const NO_DESIGN_NEEDED_ID = 'no-design-needed';

export const selectOrder = (state: RootState) => state.order;

export const selectSelectedProduct = (state: RootState) =>
  PRODUCTS.find((product) => product.id === state.order.productId) ?? null;

export const selectSelectedDesign = (state: RootState) =>
  (state.order.designId === NO_DESIGN_NEEDED_ID
    ? {
        id: NO_DESIGN_NEEDED_ID,
        productCategory: (selectSelectedProduct(state)?.category ?? 'tumblers') as ProductCategory,
        name: 'No design needed',
        image: ''
      }
    :
  DESIGNS.find((design) => design.id === state.order.designId) ??
  (() => {
    const stickerProduct =
      PRODUCTS.find(
        (product) => product.id === state.order.designId && product.category === 'stickers' && product.subCategory
      ) ?? null;
    if (!stickerProduct) {
      return null;
    }
    return {
      id: stickerProduct.id,
      productCategory: 'stickers' as const,
      stickerSubCategory: resolveStickerSubCategory(stickerProduct.subCategory),
      name: stickerProduct.name,
      image: stickerProduct.image
    };
  })());

export const selectResolvedCartItems = (state: RootState) =>
  state.order.cartItems
    .map((item) => {
      const product = PRODUCTS.find((entry) => entry.id === item.productId);
      if (!product) {
        return null;
      }
      return {
        ...item,
        product,
        lineTotal: product.basePrice * item.quantity
      };
    })
    .filter((item): item is NonNullable<typeof item> => !!item);

export const selectCartItemCount = (state: RootState) => state.order.cartItems.length;
export const selectCartTotalQuantity = (state: RootState) =>
  state.order.cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const selectFilteredDesigns = (state: RootState) => {
  const selectedProduct = selectSelectedProduct(state);
  if (!selectedProduct) {
    return [];
  }

  if (selectedProduct.category === 'tumblers' || selectedProduct.category === 'mugs') {
    return PRODUCTS.filter(
      (product) =>
        product.category === 'stickers' && (product.subCategory === 'full-wrap' || product.subCategory === 'single')
    ).map((product) => ({
      id: product.id,
      productCategory: 'stickers' as const,
      stickerSubCategory: resolveStickerSubCategory(product.subCategory),
      name: product.name,
      image: product.image
    }));
  }

  return DESIGNS.filter((design) => design.productCategory === selectedProduct.category);
};

export const selectCouponEvaluation = (state: RootState) => {
  const cartTotalQuantity = selectCartTotalQuantity(state);
  const cartQuantityTotal = selectResolvedCartItems(state).reduce((sum, item) => sum + item.lineTotal, 0);
  const product = selectSelectedProduct(state);
  const fallbackUnitPrice = product?.basePrice ?? 0;
  const fallbackQuantityTotal = fallbackUnitPrice * state.order.quantity;
  const quantityTotal = cartQuantityTotal > 0 ? cartQuantityTotal : fallbackQuantityTotal;
  const billableQuantity = cartTotalQuantity > 0 ? cartTotalQuantity : state.order.quantity;
  const selectedProduct = selectSelectedProduct(state);
  const selectedDesign = selectSelectedDesign(state);
  const isStickerAppliedOnDrinkware =
    (selectedProduct?.category === 'tumblers' || selectedProduct?.category === 'mugs') &&
    selectedDesign?.productCategory === 'stickers';
  const designCharge = isStickerAppliedOnDrinkware ? 199 * billableQuantity : 0;
  const giftWrapCharge = state.order.giftWrap ? GIFT_WRAP_CHARGE_PER_ITEM * billableQuantity : 0;
  const personalizedNameLetterCount = state.order.personalizedNote.replace(/\s+/g, '').length;
  const personalizedNameCharge = personalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER;
  const subtotalExcludingDelivery = quantityTotal + designCharge + giftWrapCharge + personalizedNameCharge;

  return evaluateCoupon(state.order.couponCode, { subtotalExcludingDelivery });
};

export const selectPricing = (state: RootState): Pricing => {
  const cartItems = selectResolvedCartItems(state);
  const cartQuantityTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartTotalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const product = selectSelectedProduct(state);
  const fallbackUnitPrice = product?.basePrice ?? 0;
  const unitPrice = cartItems.length > 0 ? Math.round(cartQuantityTotal / cartTotalQuantity) : fallbackUnitPrice;
  const quantityTotal = cartQuantityTotal > 0 ? cartQuantityTotal : fallbackUnitPrice * state.order.quantity;
  const billableQuantity = cartTotalQuantity > 0 ? cartTotalQuantity : state.order.quantity;
  const selectedDesign = selectSelectedDesign(state);
  const isStickerAppliedOnDrinkware =
    (product?.category === 'tumblers' || product?.category === 'mugs') && selectedDesign?.productCategory === 'stickers';
  const designCharge = isStickerAppliedOnDrinkware ? 199 * billableQuantity : 0;
  const giftWrapCharge = state.order.giftWrap ? GIFT_WRAP_CHARGE_PER_ITEM * billableQuantity : 0;
  const personalizedNameLetterCount = state.order.personalizedNote.replace(/\s+/g, '').length;
  const personalizedNameCharge = personalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER;
  const subtotalBeforeDiscount = quantityTotal + designCharge + giftWrapCharge + personalizedNameCharge;
  const couponEvaluation = selectCouponEvaluation(state);
  const discountAmount = couponEvaluation.status === 'applied' ? couponEvaluation.discountAmount : 0;
  const totalBeforeDelivery = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const deliveryCharge = quantityTotal > 0 ? DELIVERY_CHARGE : 0;
  const grandTotal = totalBeforeDelivery + deliveryCharge;

  return {
    unitPrice,
    quantityTotal,
    designCharge,
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
