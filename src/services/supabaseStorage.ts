import {
  PRODUCT_IMAGE_SIGNED_URL_EXPIRY_SECONDS,
  PRODUCT_IMAGES_BUCKET,
  SUPABASE_ANON_KEY,
  SUPABASE_URL
} from '../config/supabase';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string; error?: string };
    return data.message ?? data.error ?? `Request failed with ${response.status}`;
  } catch {
    return `Request failed with ${response.status}`;
  }
};

const encodeStoragePath = (path: string): string => path.split('/').map(encodeURIComponent).join('/');

const encodeBucketName = (bucket: string): string => encodeURIComponent(bucket);

const buildStorageHeaders = (contentType?: string): HeadersInit => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  ...(contentType ? { 'Content-Type': contentType } : {})
});

const resolveSignedUrl = (signedURL: string): string => {
  if (signedURL.startsWith('http://') || signedURL.startsWith('https://')) {
    return signedURL;
  }

  // Supabase returns `/object/sign/...`; the public URL must include `/storage/v1`.
  const normalizedPath = signedURL.startsWith('/storage/v1')
    ? signedURL
    : signedURL.startsWith('/object/')
      ? `/storage/v1${signedURL}`
      : signedURL.startsWith('/')
        ? signedURL
        : `/${signedURL}`;

  return `${SUPABASE_URL}${normalizedPath}`;
};

const createSignedObjectUrl = async (objectPath: string): Promise<string> => {
  const signResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${encodeBucketName(PRODUCT_IMAGES_BUCKET)}/${encodeStoragePath(objectPath)}`,
    {
      method: 'POST',
      headers: {
        ...buildStorageHeaders('application/json')
      },
      body: JSON.stringify({ expiresIn: PRODUCT_IMAGE_SIGNED_URL_EXPIRY_SECONDS })
    }
  );

  if (!signResponse.ok) {
    throw new Error(await parseErrorMessage(signResponse));
  }

  const signData = (await signResponse.json()) as { signedURL?: string };
  if (!signData.signedURL) {
    throw new Error('Upload succeeded but Supabase did not return a signed image URL.');
  }

  return resolveSignedUrl(signData.signedURL);
};

const inferFileExtension = (file: File): string => {
  const fromName = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName;
  }

  const fromType = file.type.split('/')[1]?.toLowerCase() ?? '';
  if (fromType === 'jpeg') {
    return 'jpg';
  }
  if (['png', 'webp', 'gif', 'avif'].includes(fromType)) {
    return fromType;
  }

  return 'jpg';
};

export const buildProductImageObjectPath = (file: File, productId?: string): string => {
  const folder = productId?.trim() ? productId.trim().replace(/[^a-zA-Z0-9_-]+/g, '-').toLowerCase() : 'drafts';
  const extension = inferFileExtension(file);
  return `catalog/${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
};

export const uploadProductImage = async (file: File, productId?: string): Promise<string> => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Please upload a JPEG, PNG, WebP, GIF, or AVIF image.');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 5 MB or smaller.');
  }

  const objectPath = buildProductImageObjectPath(file, productId);
  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${encodeBucketName(PRODUCT_IMAGES_BUCKET)}/${encodeStoragePath(objectPath)}`,
    {
      method: 'POST',
      headers: {
        ...buildStorageHeaders(file.type),
        'x-upsert': 'true'
      },
      body: file
    }
  );

  if (!uploadResponse.ok) {
    throw new Error(await parseErrorMessage(uploadResponse));
  }

  return createSignedObjectUrl(objectPath);
};
