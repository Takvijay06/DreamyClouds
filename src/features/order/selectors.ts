import {
  CANDLE_DAISY_NOTE_CHARGE,
  DAISY_BOUQUET_CANDLE_ID,
  DELIVERY_CHARGE,
  GIFT_WRAP_CHARGE_PER_ITEM,
  PERSONALIZED_NAME_CHARGE_PER_LETTER,
  resolveCandleScentedCharge
} from '../../data/products';
import { RootState } from '../../app/store';
import { selectDesigns, selectStickerProducts } from '../designs/designsSlice';
import { selectProducts } from '../products/productsSlice';
import { Pricing, ProductCategory, StickerSubCategory } from './orderTypes';
import { evaluateCoupon } from './couponRules';

const resolveStickerSubCategory = (value: unknown): StickerSubCategory => {
  if (typeof value !== 'string') {
    return 'single';
  }
  const normalized = value.trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (normalized === 'full-wrap' || normalized === 'fullwrap' || (normalized.includes('full') && normalized.includes('wrap'))) {
    return 'full-wrap';
  }
  return 'single';
};
const NO_DESIGN_NEEDED_ID = 'no-design-needed';
const SINGLE_STICKER_WITH_DRINKWARE_CHARGE = 49;
const FULL_WRAP_STICKER_WITH_DRINKWARE_CHARGE = 199;

const getStickerAddonCharge = (
  productCategory: ProductCategory | undefined,
  stickerSubCategory: StickerSubCategory | undefined
): number => {
  const isDrinkware = productCategory === 'tumblers' || productCategory === 'mugs';
  if (!isDrinkware || !stickerSubCategory) {
    return 0;
  }
  return stickerSubCategory === 'full-wrap' ? FULL_WRAP_STICKER_WITH_DRINKWARE_CHARGE : SINGLE_STICKER_WITH_DRINKWARE_CHARGE;
};

export const selectOrder = (state: RootState) => state.order;

export const selectSelectedProduct = (state: RootState) =>
  selectProducts(state).find((product) => product.id === state.order.productId) ??
  selectStickerProducts(state).find((product) => product.id === state.order.productId) ??
  null;

export const selectSelectedDesign = (state: RootState) =>
  state.order.designId === NO_DESIGN_NEEDED_ID
    ? {
        id: NO_DESIGN_NEEDED_ID,
        productCategory: (selectSelectedProduct(state)?.category ?? 'tumblers') as ProductCategory,
        name: 'No design needed',
        image: ''
      }
    : selectDesigns(state).find((design) => design.id === state.order.designId) ?? null;

export const selectResolvedCartItems = (state: RootState) =>
  state.order.cartItems
    .map((item) => {
      const product =
        selectProducts(state).find((entry) => entry.id === item.productId) ??
        selectStickerProducts(state).find((entry) => entry.id === item.productId);
      if (!product) {
        return null;
      }
      const sticker =
        item.selectedStickerId
          ? selectDesigns(state).find((entry) => entry.id === item.selectedStickerId && entry.productCategory === 'stickers') ?? null
          : null;
      const stickerSubCategory = sticker?.stickerSubCategory
        ? resolveStickerSubCategory(sticker.stickerSubCategory)
        : undefined;
      const stickerLineTotal = getStickerAddonCharge(product.category, stickerSubCategory) * item.quantity;
      const personalizedNameLetterCount = (item.personalizedNote ?? '').replace(/\s+/g, '').length;
      const personalizedNameCharge = personalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER * item.quantity;
      const candleScentedCharge =
        product.category === 'candles' && item.candleScented
          ? resolveCandleScentedCharge(product.id) * item.quantity
          : 0;
      const candleNoteCharge =
        product.id === DAISY_BOUQUET_CANDLE_ID && (item.candleNote ?? '').trim()
          ? CANDLE_DAISY_NOTE_CHARGE * item.quantity
          : 0;
      return {
        ...item,
        product,
        sticker,
        stickerSubCategory,
        personalizedNameLetterCount,
        personalizedNameCharge,
        candleScentedCharge,
        candleNoteCharge,
        lineTotal: product.basePrice * item.quantity,
        stickerLineTotal,
        lineTotalWithSticker: product.basePrice * item.quantity + stickerLineTotal,
        lineTotalWithExtras:
          product.basePrice * item.quantity + stickerLineTotal + personalizedNameCharge + candleScentedCharge + candleNoteCharge
      };
    })
    .filter((item): item is NonNullable<typeof item> => !!item);

export const selectCartItemCount = (state: RootState) => state.order.cartItems.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalQuantity = (state: RootState) =>
  state.order.cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const selectFilteredDesigns = (state: RootState) => {
  const selectedProduct = selectSelectedProduct(state);
  if (!selectedProduct) {
    return [];
  }

  if (selectedProduct.category === 'tumblers' || selectedProduct.category === 'mugs') {
    const singleStickerOnly = selectedProduct.category === 'mugs' || selectedProduct.basePrice === 499;
    return selectDesigns(state)
      .filter(
        (design) =>
          design.productCategory === 'stickers' &&
          (singleStickerOnly
            ? design.stickerSubCategory === 'single'
            : design.stickerSubCategory === 'full-wrap' || design.stickerSubCategory === 'single')
      )
      .map((design) => ({
        id: design.id,
        productCategory: 'stickers' as const,
        stickerSubCategory: resolveStickerSubCategory(design.stickerSubCategory),
        name: design.name,
        image: design.image
      }));
  }

  return selectDesigns(state).filter((design) => design.productCategory === selectedProduct.category);
};

export const selectCouponEvaluation = (state: RootState) => {
  const cartTotalQuantity = selectCartTotalQuantity(state);
  const resolvedItems = selectResolvedCartItems(state);
  const cartQuantityTotal = resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartDesignChargeTotal = resolvedItems.reduce((sum, item) => sum + item.stickerLineTotal, 0);
  const product = selectSelectedProduct(state);
  const fallbackUnitPrice = product?.basePrice ?? 0;
  const fallbackQuantityTotal = fallbackUnitPrice * state.order.quantity;
  const quantityTotal = cartQuantityTotal > 0 ? cartQuantityTotal : fallbackQuantityTotal;
  const billableQuantity = cartTotalQuantity > 0 ? cartTotalQuantity : state.order.quantity;
  const selectedProduct = selectSelectedProduct(state);
  const selectedDesign = selectSelectedDesign(state);
  const fallbackDesignCharge =
    selectedDesign?.productCategory === 'stickers'
      ? getStickerAddonCharge(selectedProduct?.category, selectedDesign.stickerSubCategory) * billableQuantity
      : 0;
  const designCharge = cartDesignChargeTotal > 0 ? cartDesignChargeTotal : fallbackDesignCharge;
  const giftWrapCharge = state.order.giftWrap ? GIFT_WRAP_CHARGE_PER_ITEM * billableQuantity : 0;
  const cartPersonalizedNameChargeTotal = resolvedItems.reduce((sum, item) => sum + item.personalizedNameCharge, 0);
  const fallbackPersonalizedNameLetterCount = state.order.personalizedNote.replace(/\s+/g, '').length;
  const fallbackPersonalizedNameCharge = fallbackPersonalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER;
  const personalizedNameCharge = cartPersonalizedNameChargeTotal > 0 ? cartPersonalizedNameChargeTotal : fallbackPersonalizedNameCharge;
  const cartCandleScentedChargeTotal = resolvedItems.reduce((sum, item) => sum + item.candleScentedCharge, 0);
  const cartCandleNoteChargeTotal = resolvedItems.reduce((sum, item) => sum + item.candleNoteCharge, 0);
  const fallbackCandleScentedCharge =
    product && product.category === 'candles' && state.order.candleScented
      ? resolveCandleScentedCharge(product.id) * billableQuantity
      : 0;
  const fallbackCandleNoteCharge =
    product?.id === DAISY_BOUQUET_CANDLE_ID && state.order.candleNote.trim()
      ? CANDLE_DAISY_NOTE_CHARGE * billableQuantity
      : 0;
  const candleScentedCharge = cartCandleScentedChargeTotal > 0 ? cartCandleScentedChargeTotal : fallbackCandleScentedCharge;
  const candleNoteCharge = cartCandleNoteChargeTotal > 0 ? cartCandleNoteChargeTotal : fallbackCandleNoteCharge;
  const subtotalExcludingDelivery =
    quantityTotal + designCharge + giftWrapCharge + personalizedNameCharge + candleScentedCharge + candleNoteCharge;

  return evaluateCoupon(state.order.couponCode, { subtotalExcludingDelivery });
};

export const selectPricing = (state: RootState): Pricing => {
  const cartItems = selectResolvedCartItems(state);
  const cartQuantityTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartDesignChargeTotal = cartItems.reduce((sum, item) => sum + item.stickerLineTotal, 0);
  const cartTotalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const product = selectSelectedProduct(state);
  const fallbackUnitPrice = product?.basePrice ?? 0;
  const unitPrice = cartItems.length > 0 ? Math.round(cartQuantityTotal / cartTotalQuantity) : fallbackUnitPrice;
  const quantityTotal = cartQuantityTotal > 0 ? cartQuantityTotal : fallbackUnitPrice * state.order.quantity;
  const billableQuantity = cartTotalQuantity > 0 ? cartTotalQuantity : state.order.quantity;
  const selectedDesign = selectSelectedDesign(state);
  const fallbackDesignCharge =
    selectedDesign?.productCategory === 'stickers'
      ? getStickerAddonCharge(product?.category, selectedDesign.stickerSubCategory) * billableQuantity
      : 0;
  const designCharge = cartDesignChargeTotal > 0 ? cartDesignChargeTotal : fallbackDesignCharge;
  const giftWrapCharge = state.order.giftWrap ? GIFT_WRAP_CHARGE_PER_ITEM * billableQuantity : 0;
  const cartPersonalizedNameLetterCount = cartItems.reduce(
    (sum, item) => sum + item.personalizedNameLetterCount * item.quantity,
    0
  );
  const cartPersonalizedNameChargeTotal = cartItems.reduce((sum, item) => sum + item.personalizedNameCharge, 0);
  const fallbackPersonalizedNameLetterCount = state.order.personalizedNote.replace(/\s+/g, '').length;
  const fallbackPersonalizedNameCharge = fallbackPersonalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER;
  const personalizedNameLetterCount =
    cartPersonalizedNameLetterCount > 0 ? cartPersonalizedNameLetterCount : fallbackPersonalizedNameLetterCount;
  const personalizedNameCharge = cartPersonalizedNameChargeTotal > 0 ? cartPersonalizedNameChargeTotal : fallbackPersonalizedNameCharge;
  const cartCandleScentedChargeTotal = cartItems.reduce((sum, item) => sum + item.candleScentedCharge, 0);
  const cartCandleNoteChargeTotal = cartItems.reduce((sum, item) => sum + item.candleNoteCharge, 0);
  const fallbackCandleScentedCharge =
    product && product.category === 'candles' && state.order.candleScented
      ? resolveCandleScentedCharge(product.id) * billableQuantity
      : 0;
  const fallbackCandleNoteCharge =
    product?.id === DAISY_BOUQUET_CANDLE_ID && state.order.candleNote.trim()
      ? CANDLE_DAISY_NOTE_CHARGE * billableQuantity
      : 0;
  const candleScentedCharge = cartCandleScentedChargeTotal > 0 ? cartCandleScentedChargeTotal : fallbackCandleScentedCharge;
  const candleNoteCharge = cartCandleNoteChargeTotal > 0 ? cartCandleNoteChargeTotal : fallbackCandleNoteCharge;
  const subtotalBeforeDiscount =
    quantityTotal + designCharge + giftWrapCharge + personalizedNameCharge + candleScentedCharge + candleNoteCharge;
  const couponEvaluation = selectCouponEvaluation(state);
  const discountAmount = couponEvaluation.status === 'applied' ? couponEvaluation.discountAmount : 0;
  const totalBeforeDelivery = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const hasCartItems = cartItems.length > 0;
  const tumblerQuantity = hasCartItems
    ? cartItems.reduce((sum, item) => (item.product.category === 'tumblers' ? sum + item.quantity : sum), 0)
    : product?.category === 'tumblers'
      ? state.order.quantity
      : 0;
  const deliveryCharge = (() => {
    if (quantityTotal <= 0) {
      return 0;
    }
    if (tumblerQuantity >= 2) {
      return 100;
    }
    return DELIVERY_CHARGE;
  })();
  const grandTotal = totalBeforeDelivery + deliveryCharge;

  return {
    unitPrice,
    quantityTotal,
    designCharge,
    giftWrapCharge,
    personalizedNameLetterCount,
    personalizedNameCharge,
    candleScentedCharge,
    candleNoteCharge,
    subtotalBeforeDiscount,
    discountAmount,
    totalBeforeDelivery,
    appliedCouponCode: couponEvaluation.status === 'applied' ? couponEvaluation.code : null,
    deliveryCharge,
    grandTotal
  };
};
