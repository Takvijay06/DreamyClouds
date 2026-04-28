import { ApiDesign, buildDesignsFromApi } from '../../data/designs';
import { Design, ProductCategory, StickerSubCategory } from '../order/orderTypes';

export const DESIGNS_API_URL = 'https://ftyqsddrhhqodlytyyca.supabase.co/rest/v1/designs';
export const DESIGNS_API_KEY = 'sb_publishable_11G_1zZ-Uv55Jdw15gdaSQ_8yHltBRH';

export type DesignMutationInput = {
  id: string;
  productCategory: ProductCategory;
  stickerSubCategory: StickerSubCategory | '';
  name: string;
  image: string;
  basePrice: number | null;
  availableQuantity: number | null;
};

const buildHeaders = (includeWriteHeaders = false): HeadersInit => ({
  apikey: DESIGNS_API_KEY,
  Authorization: `Bearer ${DESIGNS_API_KEY}`,
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

const buildMutationPayload = (input: DesignMutationInput) => ({
  id: input.id.trim(),
  product_category: input.productCategory,
  sticker_sub_category: input.productCategory === 'stickers' ? input.stickerSubCategory || null : null,
  name: input.name.trim(),
  image: input.image.trim(),
  base_price: input.basePrice,
  available_quantity: input.availableQuantity
});

const parseDesignsResponse = async (response: Response): Promise<Design[]> => {
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const data = (await response.json()) as ApiDesign[];
  return buildDesignsFromApi(Array.isArray(data) ? data : []);
};

export const fetchDesignsFromApi = async (): Promise<Design[]> => {
  const response = await fetch(DESIGNS_API_URL, {
    headers: buildHeaders()
  });

  return parseDesignsResponse(response);
};

export const createDesignInApi = async (input: DesignMutationInput): Promise<Design> => {
  const response = await fetch(DESIGNS_API_URL, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(buildMutationPayload(input))
  });

  const designs = await parseDesignsResponse(response);
  const created = designs[0];
  if (!created) {
    throw new Error('Design was created but no design data was returned.');
  }

  return created;
};

export const updateDesignInApi = async (id: string, input: DesignMutationInput): Promise<Design> => {
  const url = new URL(DESIGNS_API_URL);
  url.searchParams.set('id', `eq.${id}`);

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: buildHeaders(true),
    body: JSON.stringify(buildMutationPayload(input))
  });

  const designs = await parseDesignsResponse(response);
  const updated = designs[0];
  if (!updated) {
    throw new Error('Design was updated but no design data was returned.');
  }

  return updated;
};
