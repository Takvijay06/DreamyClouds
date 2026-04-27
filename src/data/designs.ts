import { Design, Product, ProductCategory, StickerSubCategory } from '../features/order/orderTypes';
import { DELIVERY_CHARGE } from './products';
import { toAvailableQuantityCap } from '../utils/cartQuantity';

export type ApiDesign = {
  id: string;
  product_category: ProductCategory;
  sticker_sub_category?: StickerSubCategory | null;
  design_type?: string | null;
  name: string;
  image: string;
  base_price?: number | null;
  available_quantity?: number | null;
  created_at?: string;
};

const DEFAULT_STICKER_SUBCATEGORY: StickerSubCategory = 'single_sticker';
const SINGLE_STICKER_BASE_PRICE = 49;
const FULL_WRAP_STICKER_BASE_PRICE = 299;
const STICKER_OVERLAY_CLASS = 'left-[20%] top-[20%] h-[60%] w-[60%]';
const normalizeBasePrice = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const normalizeCategory = (value: unknown): ProductCategory => {
  if (typeof value !== 'string') {
    return 'stickers';
  }
  const normalized = value.trim().toLowerCase().replace(/_/g, '-');
  switch (normalized) {
    case 'tumblers':
    case 'mugs':
    case 'bookmarks':
    case 'candles':
    case 'gift-hampers':
    case 'accessories':
    case 'stickers':
      return normalized;
    case 'sticker':
      return 'stickers';
    default:
      return 'stickers';
  }
};

const normalizeStickerSubCategory = (value: unknown): StickerSubCategory => {
  if (typeof value !== 'string') {
    return DEFAULT_STICKER_SUBCATEGORY;
  }
  const normalized = value.trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (normalized === 'full-wrap' || normalized === 'fullwrap' || (normalized.includes('full') && normalized.includes('wrap'))) {
    return 'full_wrap';
  }
  return 'single_sticker';
};

export const buildDesignsFromApi = (apiDesigns: ApiDesign[]): Design[] =>
  apiDesigns.map((design) => {
    const productCategory = normalizeCategory(design.product_category);
    const resolvedStickerSubCategory = normalizeStickerSubCategory(
      design.sticker_sub_category ?? design.design_type ?? DEFAULT_STICKER_SUBCATEGORY
    );
    return {
      id: design.id,
      productCategory,
      stickerSubCategory:
        productCategory === 'stickers' ? resolvedStickerSubCategory : undefined,
      name: design.name,
      image: design.image,
      basePrice: normalizeBasePrice(design.base_price),
      availableQuantity: toAvailableQuantityCap(design.available_quantity)
    };
  });

export const buildStickerProductsFromDesigns = (designs: Design[]): Product[] =>
  designs
    .filter((design) => design.productCategory === 'stickers')
    .map((design) => {
      const resolvedSubCategory = normalizeStickerSubCategory(design.stickerSubCategory ?? DEFAULT_STICKER_SUBCATEGORY);
      return {
        id: design.id,
        category: 'stickers',
        subCategory: resolvedSubCategory,
        name: design.name,
        description: 'Sticker design',
        basePrice: resolvedSubCategory === 'full_wrap' ? FULL_WRAP_STICKER_BASE_PRICE : SINGLE_STICKER_BASE_PRICE,
        availableQuantity: toAvailableQuantityCap(design.availableQuantity),
        image: design.image,
        images: design.image ? [design.image] : [],
        imageAvailable: !!design.image,
        shippingCharge: DELIVERY_CHARGE,
        overlayClassName: STICKER_OVERLAY_CLASS
      };
    });