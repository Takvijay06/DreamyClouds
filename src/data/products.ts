import { Product, ProductCategory, StickerSubCategory, TumblerSubCategory } from '../features/order/orderTypes';
import { toAvailableQuantityCap } from '../utils/cartQuantity';

const DEFAULT_OVERLAY_BY_CATEGORY: Record<ProductCategory, string> = {
  tumblers: 'left-[28%] top-[27%] h-[38%] w-[44%]',
  mugs: 'left-[22%] top-[34%] h-[30%] w-[48%]',
  bookmarks: 'left-[38%] top-[18%] h-[62%] w-[24%]',
  candles: 'left-[24%] top-[34%] h-[30%] w-[45%]',
  'gift-hampers': 'left-[24%] top-[34%] h-[30%] w-[45%]',
  accessories: 'left-[26%] top-[30%] h-[36%] w-[46%]',
  stickers: 'left-[20%] top-[20%] h-[60%] w-[60%]'
};

export type ApiProduct = {
  id: string;
  category: ProductCategory | null;
  sub_category: TumblerSubCategory | StickerSubCategory | null;
  isTrending?: unknown;
  name: string | null;
  description: string | null;
  base_price: number | null;
  available_quantity: number | null;
  images?: string[] | null;
  created_at?: string;
  scented_price?: number | null;
  color_available?: unknown;
  shipping?: number | null;
};

export const DELIVERY_CHARGE = 70;

const parseColorAvailableList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : String(entry).trim()))
    .filter((s) => s.length > 0);
};

const normalizeScentedAddonPrice = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }
  return 0;
};

const normalizeShippingCharge = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }
  return fallback;
};

const normalizeIsTrending = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return false;
};

export const buildProductsFromApi = (apiProducts: ApiProduct[]): Product[] => {
  const mapped = apiProducts.map((apiProduct) => {
    const category = (apiProduct.category ?? 'tumblers') as ProductCategory;
    const apiImages =
      Array.isArray(apiProduct.images) && apiProduct.images.length > 0
        ? apiProduct.images.filter((img) => typeof img === 'string' && img.trim().length > 0)
        : [];
    const images = apiImages;
    const image = images[0] ?? '';
    const imageAvailable = images.length > 0;
    const colorList = parseColorAvailableList(apiProduct.color_available);
    const colors =
      category === 'candles' ? colorList : colorList.length > 0 ? colorList : undefined;
    const scentedAddonPrice = normalizeScentedAddonPrice(apiProduct.scented_price);
    const shippingCharge = normalizeShippingCharge(apiProduct.shipping, DELIVERY_CHARGE);
    const isTrending = normalizeIsTrending(apiProduct.isTrending);

    return {
      id: apiProduct.id,
      category,
      subCategory: (apiProduct.sub_category ?? undefined) as TumblerSubCategory | StickerSubCategory | undefined,
      isTrending,
      name: apiProduct.name ?? '',
      description: apiProduct.description ?? '',
      basePrice: typeof apiProduct.base_price === 'number' ? apiProduct.base_price : 0,
      availableQuantity: toAvailableQuantityCap(apiProduct.available_quantity),
      imageAvailable,
      image,
      images,
      colors,
      scentedAddonPrice,
      shippingCharge,
      overlayClassName: DEFAULT_OVERLAY_BY_CATEGORY[category] ?? DEFAULT_OVERLAY_BY_CATEGORY.tumblers
    };
  });

  return mapped;
};

export const GIFT_WRAP_CHARGE_PER_ITEM = 25;
export const PERSONALIZED_NAME_CHARGE_PER_LETTER = 10;
export const CANDLE_DAISY_NOTE_CHARGE = 10;
