import { ApiProduct, buildProductsFromApi } from '../../data/products';
import { Product, ProductCategory, StickerSubCategory, TumblerSubCategory } from '../order/orderTypes';

export const PRODUCTS_API_URL = 'https://ftyqsddrhhqodlytyyca.supabase.co/rest/v1/products';
export const PRODUCTS_API_KEY = 'sb_publishable_11G_1zZ-Uv55Jdw15gdaSQ_8yHltBRH';

export type ProductSubCategory = TumblerSubCategory | StickerSubCategory | '';

export type ProductMutationInput = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  basePrice: number;
  availableQuantity: number | null;
  image: string | null;
  images: string[];
  isTrending: boolean;
  scentedAddonPrice: number | null;
  colors: string[];
  shippingCharge: number | null;
};

const buildHeaders = (includeWriteHeaders = false): HeadersInit => ({
  apikey: PRODUCTS_API_KEY,
  Authorization: `Bearer ${PRODUCTS_API_KEY}`,
  ...(includeWriteHeaders
    ? {
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      }
    : {})
});

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string; error?: string; hint?: string };
    return data.message ?? data.error ?? data.hint ?? `Request failed with ${response.status}`;
  } catch {
    return `Request failed with ${response.status}`;
  }
};

const sanitizeStringList = (values: string[]): string[] =>
  values.map((value) => value.trim()).filter((value) => value.length > 0);

const buildMutationPayload = (input: ProductMutationInput) => {
  const primaryImage = input.image?.trim() ?? '';
  const galleryImages = sanitizeStringList(input.images).filter((value) => value !== primaryImage);
  const images = primaryImage ? [primaryImage, ...galleryImages] : galleryImages;
  const colorAvailable = sanitizeStringList(input.colors);

  return {
    id: input.id.trim(),
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category,
    sub_category: input.subCategory || null,
    base_price: input.basePrice,
    available_quantity: input.availableQuantity,
    images,
    isTrending: input.isTrending,
    scented_price: input.scentedAddonPrice,
    color_available: colorAvailable,
    shipping: input.shippingCharge
  };
};

const parseProductsResponse = async (response: Response): Promise<Product[]> => {
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const data = (await response.json()) as ApiProduct[];
  return buildProductsFromApi(Array.isArray(data) ? data : []);
};

export const fetchProductsFromApi = async (): Promise<Product[]> => {
  const response = await fetch(PRODUCTS_API_URL, {
    headers: buildHeaders()
  });
  return parseProductsResponse(response);
};

export const createProductInApi = async (input: ProductMutationInput): Promise<Product> => {
  const response = await fetch(PRODUCTS_API_URL, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(buildMutationPayload(input))
  });

  const products = await parseProductsResponse(response);
  const created = products[0];
  if (!created) {
    throw new Error('Product was created but no product data was returned.');
  }

  return created;
};

export const updateProductInApi = async (id: string, input: ProductMutationInput): Promise<Product> => {
  const url = new URL(PRODUCTS_API_URL);
  url.searchParams.set('id', `eq.${id}`);

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: buildHeaders(true),
    body: JSON.stringify(buildMutationPayload(input))
  });

  const products = await parseProductsResponse(response);
  const updated = products[0];
  if (!updated) {
    throw new Error('Product was updated but no product data was returned.');
  }

  return updated;
};
