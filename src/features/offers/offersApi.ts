import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../config/supabase';
import { PRODUCTS_API_KEY } from '../products/productsApi';

export const OFFERS_API_URL = `${SUPABASE_URL}/rest/v1/offers`;
/** Primary offer name; DB may also use legacy typo "Sreaming". */
export const SCREAM_OFFER_NAME = 'Screaming';
const SCREAM_OFFER_NAME_ALIASES = [SCREAM_OFFER_NAME, 'Sreaming'];

export type Offer = {
  id: number;
  offer_name: string;
  isOfferVisible: boolean;
  created_at?: string;
};

type ApiOfferRow = {
  id?: number;
  offer_name?: string;
  isOfferVisible?: boolean;
  created_at?: string;
};

const buildReadHeaders = (): HeadersInit => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`
});

const buildWriteHeaders = (): HeadersInit => ({
  apikey: PRODUCTS_API_KEY,
  Authorization: `Bearer ${PRODUCTS_API_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation'
});

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string; error?: string; hint?: string };
    return data.message ?? data.error ?? data.hint ?? `Request failed with ${response.status}`;
  } catch {
    return `Request failed with ${response.status}`;
  }
};

const normalizeOffer = (row: ApiOfferRow): Offer | null => {
  if (typeof row.id !== 'number' || typeof row.offer_name !== 'string') {
    return null;
  }
  return {
    id: row.id,
    offer_name: row.offer_name,
    isOfferVisible: row.isOfferVisible === true,
    created_at: row.created_at
  };
};

const isScreamOfferRow = (row: ApiOfferRow): boolean => {
  const name = row.offer_name?.trim().toLowerCase();
  return name === 'screaming' || name === 'sreaming';
};

const readOfferVisibility = (row: ApiOfferRow | undefined): boolean => row?.isOfferVisible === true;

export const fetchAllOffersFromApi = async (): Promise<Offer[]> => {
  const url = `${OFFERS_API_URL}?select=id,offer_name,isOfferVisible,created_at&order=offer_name.asc`;
  const response = await fetch(url, { headers: buildWriteHeaders() });

  if (!response.ok) {
    const fallback = await fetch(url, { headers: buildReadHeaders() });
    if (!fallback.ok) {
      throw new Error(await parseErrorMessage(response));
    }
    const rows = (await fallback.json()) as ApiOfferRow[];
    return rows.map(normalizeOffer).filter((offer): offer is Offer => offer !== null);
  }

  const rows = (await response.json()) as ApiOfferRow[];
  return rows.map(normalizeOffer).filter((offer): offer is Offer => offer !== null);
};

export const updateOfferVisibilityInApi = async (id: number, isOfferVisible: boolean): Promise<Offer> => {
  const url = `${OFFERS_API_URL}?id=eq.${id}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: buildWriteHeaders(),
    body: JSON.stringify({ isOfferVisible })
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const rows = (await response.json()) as ApiOfferRow[];
  const offer = normalizeOffer(rows[0]);
  if (!offer) {
    throw new Error('Offer update succeeded but no row was returned.');
  }
  return offer;
};

export const fetchScreamOfferVisibility = async (): Promise<boolean> => {
  const filter = SCREAM_OFFER_NAME_ALIASES.map((name) => encodeURIComponent(name)).join(',');
  const url = `${OFFERS_API_URL}?offer_name=in.(${filter})&select=offer_name,isOfferVisible`;

  try {
    const response = await fetch(url, { headers: buildReadHeaders() });
    if (!response.ok) {
      return false;
    }

    const rows = (await response.json()) as ApiOfferRow[];
    const screamRow = rows.find(isScreamOfferRow) ?? rows[0];
    return readOfferVisibility(screamRow);
  } catch {
    return false;
  }
};
