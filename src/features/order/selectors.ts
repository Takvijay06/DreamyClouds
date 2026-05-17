import {
  CANDLE_DAISY_NOTE_CHARGE,
  GIFT_WRAP_CHARGE_PER_ITEM,
  PERSONALIZED_NAME_CHARGE_PER_LETTER
} from '../../data/products';
import { RootState } from '../../app/store';
import { selectDesigns, selectStickerProducts } from '../designs/designsSlice';
import { selectProducts } from '../products/productsSlice';
import { Pricing, ProductCategory, StickerSubCategory } from './orderTypes';
import { evaluateCoupon } from './couponRules';
import { bookmarkMerchandiseSubtotal } from '../../utils/bookmarkPricing';
import { toCartLineQuantity } from '../../utils/cartQuantity';
import { computeCartDeliveryCharge } from '../../utils/shipping';

const resolveStickerSubCategory = (value: unknown): StickerSubCategory => {
  if (typeof value !== 'string') {
    return 'single_sticker';
  }
  const normalized = value.trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (normalized === 'full-wrap' || normalized === 'fullwrap' || (normalized.includes('full') && normalized.includes('wrap'))) {
    return 'full_wrap';
  }
  return 'single_sticker';
};
const NO_DESIGN_NEEDED_ID = 'no-design-needed';
const SINGLE_STICKER_WITH_DRINKWARE_CHARGE = 49;
const FULL_WRAP_STICKER_WITH_DRINKWARE_CHARGE = 199;
const DAISY_BOUQUET_CANDLE_ID = 'candle-daisy-flower-bouquet';

const candleScentedRatePerItem = (product: { category: ProductCategory; scentedAddonPrice?: number }): number => {
  if (product.category !== 'candles') {
    return 0;
  }
  const rate = product.scentedAddonPrice;
  return typeof rate === 'number' && Number.isFinite(rate) ? Math.max(0, rate) : 0;
};

const getStickerAddonCharge = (
  productCategory: ProductCategory | undefined,
  stickerSubCategory: StickerSubCategory | undefined
): number => {
  const isDrinkware = productCategory === 'tumblers' || productCategory === 'mugs';
  if (!isDrinkware || !stickerSubCategory) {
    return 0;
  }
  return stickerSubCategory === 'full_wrap' ? FULL_WRAP_STICKER_WITH_DRINKWARE_CHARGE : SINGLE_STICKER_WITH_DRINKWARE_CHARGE;
};

const allocateIntegerByWeights = (weights: number[], total: number): number[] => {
  const sumW = weights.reduce((a, b) => a + b, 0);
  if (sumW <= 0) {
    return weights.map(() => 0);
  }
  const floors = weights.map((w) => Math.floor((w / sumW) * total));
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = weights
    .map((w, i) => ({ i, frac: (w / sumW) * total - Math.floor((w / sumW) * total) }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floors];
  let k = 0;
  while (remainder > 0 && order.length > 0) {
    result[order[k % order.length].i] += 1;
    remainder -= 1;
    k += 1;
  }
  return result;
};

const applyBookmarkBundleLineTotals = <
  T extends {
    quantity: number;
    product: { category: ProductCategory };
    lineTotal: number;
    stickerLineTotal: number;
    personalizedNameCharge: number;
    candleScentedCharge: number;
    candleNoteCharge: number;
    lineTotalWithSticker: number;
    lineTotalWithExtras: number;
  }
>(
  items: T[]
): T[] => {
  const bookmarkIndexes = items
    .map((item, index) => (item.product.category === 'bookmarks' ? index : -1))
    .filter((index) => index >= 0);
  if (bookmarkIndexes.length === 0) {
    return items;
  }
  const totalQty = bookmarkIndexes.reduce((sum, i) => sum + items[i].quantity, 0);
  const bundleTotal = bookmarkMerchandiseSubtotal(totalQty);
  const weights = bookmarkIndexes.map((i) => items[i].quantity);
  const allocated = allocateIntegerByWeights(weights, bundleTotal);
  return items.map((item, i) => {
    const pos = bookmarkIndexes.indexOf(i);
    if (pos < 0) {
      return item;
    }
    const lineTotal = allocated[pos];
    return {
      ...item,
      lineTotal,
      lineTotalWithSticker: lineTotal + item.stickerLineTotal,
      lineTotalWithExtras:
        lineTotal + item.stickerLineTotal + item.personalizedNameCharge + item.candleScentedCharge + item.candleNoteCharge
    };
  });
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

export const selectResolvedCartItems = (state: RootState) => {
  const mapped = state.order.cartItems
    .map((item) => {
      const product =
        selectProducts(state).find((entry) => entry.id === item.productId) ??
        selectStickerProducts(state).find((entry) => entry.id === item.productId);
      if (!product) {
        return null;
      }
      const qty = toCartLineQuantity(item.quantity);
      const sticker =
        item.selectedStickerId
          ? selectDesigns(state).find((entry) => entry.id === item.selectedStickerId && entry.productCategory === 'stickers') ?? null
          : null;
      const stickerSubCategory = sticker?.stickerSubCategory
        ? resolveStickerSubCategory(sticker.stickerSubCategory)
        : undefined;
      const stickerLineTotal = getStickerAddonCharge(product.category, stickerSubCategory) * qty;
      const personalizedNameLetterCount = (item.personalizedNote ?? '').replace(/\s+/g, '').length;
      const personalizedNameCharge = personalizedNameLetterCount * PERSONALIZED_NAME_CHARGE_PER_LETTER * qty;
      const candleScentedCharge =
        product.category === 'candles' && item.candleScented ? candleScentedRatePerItem(product) * qty : 0;
      const candleNoteCharge =
        product.id === DAISY_BOUQUET_CANDLE_ID && (item.candleNote ?? '').trim() ? CANDLE_DAISY_NOTE_CHARGE * qty : 0;
      return {
        ...item,
        quantity: qty,
        product,
        sticker,
        stickerSubCategory,
        personalizedNameLetterCount,
        personalizedNameCharge,
        candleScentedCharge,
        candleNoteCharge,
        lineTotal: product.basePrice * qty,
        stickerLineTotal,
        lineTotalWithSticker: product.basePrice * qty + stickerLineTotal,
        lineTotalWithExtras:
          product.basePrice * qty + stickerLineTotal + personalizedNameCharge + candleScentedCharge + candleNoteCharge
      };
    })
    .filter((item): item is NonNullable<typeof item> => !!item);

  return applyBookmarkBundleLineTotals(mapped);
};

export const selectCartItemCount = (state: RootState) =>
  state.order.cartItems.reduce((sum, item) => sum + toCartLineQuantity(item.quantity), 0);
export const selectCartTotalQuantity = (state: RootState) =>
  state.order.cartItems.reduce((sum, item) => sum + toCartLineQuantity(item.quantity), 0);

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
            ? design.stickerSubCategory === 'single_sticker'
            : design.stickerSubCategory === 'full_wrap' || design.stickerSubCategory === 'single_sticker')
      )
      .map((design) => ({
        id: design.id,
        productCategory: 'stickers' as const,
        stickerSubCategory: resolveStickerSubCategory(design.stickerSubCategory),
        name: design.name,
        image: design.image,
        availableQuantity: design.availableQuantity ?? null
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
  const hasItemsInCart = state.order.cartItems.length > 0;
  const fallbackCandleScentedCharge =
    product?.category === 'candles' && state.order.candleScented && product
      ? candleScentedRatePerItem(product) * billableQuantity
      : 0;
  const fallbackCandleNoteCharge =
    product?.id === DAISY_BOUQUET_CANDLE_ID && state.order.candleNote.trim()
      ? CANDLE_DAISY_NOTE_CHARGE * billableQuantity
      : 0;
  const candleScentedCharge = hasItemsInCart ? cartCandleScentedChargeTotal : fallbackCandleScentedCharge;
  const candleNoteCharge = hasItemsInCart ? cartCandleNoteChargeTotal : fallbackCandleNoteCharge;
  const subtotalExcludingDelivery =
    quantityTotal + designCharge + giftWrapCharge + personalizedNameCharge + candleScentedCharge + candleNoteCharge;

  return evaluateCoupon(state.order.couponCode, { subtotalExcludingDelivery });
};

export const selectPricing = (state: RootState): Pricing => {
  const cartItems = selectResolvedCartItems(state);
  const cartQuantityTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartDesignChargeTotal = cartItems.reduce((sum, item) => sum + item.stickerLineTotal, 0);
  const cartTotalQuantity = cartItems.reduce((sum, item) => sum + toCartLineQuantity(item.quantity), 0);
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
    (sum, item) => sum + item.personalizedNameLetterCount * toCartLineQuantity(item.quantity),
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
  const hasItemsInCart = state.order.cartItems.length > 0;
  const fallbackCandleScentedCharge =
    product?.category === 'candles' && state.order.candleScented && product
      ? candleScentedRatePerItem(product) * billableQuantity
      : 0;
  const fallbackCandleNoteCharge =
    product?.id === DAISY_BOUQUET_CANDLE_ID && state.order.candleNote.trim()
      ? CANDLE_DAISY_NOTE_CHARGE * billableQuantity
      : 0;
  const candleScentedCharge = hasItemsInCart ? cartCandleScentedChargeTotal : fallbackCandleScentedCharge;
  const candleNoteCharge = hasItemsInCart ? cartCandleNoteChargeTotal : fallbackCandleNoteCharge;
  const subtotalBeforeDiscount =
    quantityTotal + designCharge + giftWrapCharge + personalizedNameCharge + candleScentedCharge + candleNoteCharge;
  const couponEvaluation = selectCouponEvaluation(state);
  const discountAmount = couponEvaluation.status === 'applied' ? couponEvaluation.discountAmount : 0;
  const totalBeforeDelivery = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const candleMerchandiseSubtotal =
    cartItems.length > 0
      ? cartItems
          .filter((item) => item.product.category === 'candles')
          .reduce((sum, item) => sum + item.lineTotal + item.candleScentedCharge + item.candleNoteCharge, 0)
      : product?.category === 'candles'
        ? fallbackUnitPrice * billableQuantity + fallbackCandleScentedCharge + fallbackCandleNoteCharge
        : 0;
  const shippingLines =
    cartItems.length > 0
      ? cartItems.map((item) => ({ product: item.product, quantity: toCartLineQuantity(item.quantity) }))
      : product && billableQuantity > 0
        ? [{ product, quantity: billableQuantity }]
        : [];
  const deliveryCharge =
    quantityTotal <= 0
      ? 0
      : shippingLines.length > 0
        ? computeCartDeliveryCharge(shippingLines, {
            candleMerchandiseSubtotal,
            orderTotalBeforeDelivery: totalBeforeDelivery
          })
        : 0;
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