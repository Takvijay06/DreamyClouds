import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AdminAccessGate } from '../components/AdminAccessGate';
import { FormInput } from '../components/FormInput';
import { ProductPreviewModal } from '../components/ProductPreviewModal';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ProductCategory, Product, StickerSubCategory } from '../features/order/orderTypes';
import { ProductMutationInput, ProductSubCategory } from '../features/products/productsApi';
import {
  createProduct,
  fetchProducts,
  resetProductSaveState,
  selectProductSaveError,
  selectProductSaveStatus,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
  updateProduct
} from '../features/products/productsSlice';
import { selectDesignsError, selectDesignsStatus, selectStickerProducts } from '../features/designs/designsSlice';
import { formatRupee } from '../utils/currency';

type ProductCategoryTab = ProductCategory | 'trending' | 'steel-tumblers' | 'glass-tumblers';

const CATEGORY_TABS: Array<{ key: ProductCategoryTab; label: string }> = [
  { key: 'trending', label: 'Trending' },
  { key: 'steel-tumblers', label: 'Steel Tumbler' },
  { key: 'glass-tumblers', label: 'Glass Tumbler' },
  { key: 'mugs', label: 'Mugs' },
  { key: 'candles', label: 'Candles' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'stickers', label: 'Stickers' }
];

const STICKER_SUBCATEGORY_TABS: Array<{ key: StickerSubCategory; label: string }> = [
  { key: 'full_wrap', label: 'Full Wrap' },
  { key: 'single_sticker', label: 'Single' }
];

type ProductFormState = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  basePrice: string;
  availableQuantity: string;
  image: string;
  imagesText: string;
  isTrending: boolean;
  scentedAddonPrice: string;
  colorsText: string;
  shippingCharge: string;
};

type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

const normalizeStickerSubCategory = (value: unknown): StickerSubCategory => {
  if (typeof value !== 'string') {
    return 'single_sticker';
  }
  const normalized = value.trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (normalized === 'full-wrap' || normalized === 'fullwrap' || (normalized.includes('full') && normalized.includes('wrap'))) {
    return 'full_wrap';
  }
  return 'single_sticker';
};

const parseListInput = (value: string): string[] =>
  value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const createEmptyProductForm = (category: ProductCategory = 'tumblers'): ProductFormState => ({
  id: '',
  name: '',
  description: '',
  category,
  subCategory: buildDefaultSubCategory(category),
  basePrice: '',
  availableQuantity: '',
  image: '',
  imagesText: '',
  isTrending: false,
  scentedAddonPrice: '',
  colorsText: '',
  shippingCharge: ''
});

const toFormState = (product: Product): ProductFormState => ({
  id: product.id,
  name: product.name,
  description: product.description,
  category: product.category,
  subCategory: (product.subCategory ?? '') as ProductSubCategory,
  basePrice: String(product.basePrice),
  availableQuantity:
    typeof product.availableQuantity === 'number' && Number.isFinite(product.availableQuantity)
      ? String(product.availableQuantity)
      : '',
  image: product.image,
  imagesText: product.images?.join('\n') ?? product.image,
  isTrending: Boolean(product.isTrending),
  scentedAddonPrice:
    typeof product.scentedAddonPrice === 'number' && Number.isFinite(product.scentedAddonPrice)
      ? String(product.scentedAddonPrice)
      : '',
  colorsText: product.colors?.join('\n') ?? '',
  shippingCharge:
    typeof product.shippingCharge === 'number' && Number.isFinite(product.shippingCharge)
      ? String(product.shippingCharge)
      : ''
});

const buildDefaultSubCategory = (category: ProductCategory): ProductSubCategory => {
  if (category === 'tumblers') {
    return 'steel-tumbler';
  }
  if (category === 'stickers') {
    return 'full_wrap';
  }
  return '';
};

const normalizeSubCategory = (category: ProductCategory, subCategory: ProductSubCategory): ProductSubCategory => {
  if (category === 'tumblers') {
    return subCategory === 'glass-tumbler' || subCategory === 'steel-tumbler' ? subCategory : 'steel-tumbler';
  }
  if (category === 'stickers') {
    return subCategory === 'full_wrap' || subCategory === 'single_sticker' ? subCategory : 'full_wrap';
  }
  return '';
};

export const AdminProductsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const stickerProducts = useAppSelector(selectStickerProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const productsError = useAppSelector(selectProductsError);
  const productSaveStatus = useAppSelector(selectProductSaveStatus);
  const productSaveError = useAppSelector(selectProductSaveError);
  const designsStatus = useAppSelector(selectDesignsStatus);
  const designsError = useAppSelector(selectDesignsError);

  const [activeCategory, setActiveCategory] = useState<ProductCategoryTab>('steel-tumblers');
  const [activeStickerSubCategory, setActiveStickerSubCategory] = useState<StickerSubCategory>('full_wrap');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('edit');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState | null>(null);
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  useEffect(() => {
    if (productSaveStatus === 'succeeded') {
      const timerId = window.setTimeout(() => {
        setSuccessMessage('');
        dispatch(resetProductSaveState());
      }, 2500);
      return () => window.clearTimeout(timerId);
    }
    return undefined;
  }, [dispatch, productSaveStatus]);

  const filteredProducts = useMemo(
    () =>
      (activeCategory === 'stickers' ? stickerProducts : products).filter((item) => {
        if (activeCategory === 'trending') {
          return item.isTrending === true;
        }
        if (activeCategory === 'steel-tumblers') {
          return item.category === 'tumblers' && item.subCategory === 'steel-tumbler';
        }
        if (activeCategory === 'glass-tumblers') {
          return item.category === 'tumblers' && item.subCategory === 'glass-tumbler';
        }
        if (item.category !== activeCategory) {
          return false;
        }
        if (activeCategory === 'stickers') {
          return normalizeStickerSubCategory(item.subCategory) === activeStickerSubCategory;
        }
        return true;
      }),
    [activeCategory, activeStickerSubCategory, products, stickerProducts]
  );

  const handleEditProduct = (product: Product) => {
    dispatch(resetProductSaveState());
    setSuccessMessage('');
    setProductModalMode('edit');
    setEditingProduct(product);
    setForm(toFormState(product));
    setFormErrors({});
  };

  const handleCreateProduct = () => {
    const nextCategory: ProductCategory = activeCategory === 'glass-tumblers' || activeCategory === 'steel-tumblers' || activeCategory === 'trending'
      ? 'tumblers'
      : activeCategory === 'stickers'
        ? 'stickers'
        : activeCategory;
    const nextForm = createEmptyProductForm(nextCategory);
    nextForm.subCategory =
      activeCategory === 'glass-tumblers'
        ? 'glass-tumbler'
        : activeCategory === 'steel-tumblers'
          ? 'steel-tumbler'
          : activeCategory === 'stickers'
            ? activeStickerSubCategory
            : buildDefaultSubCategory(nextCategory);

    dispatch(resetProductSaveState());
    setSuccessMessage('');
    setProductModalMode('create');
    setEditingProduct(null);
    setForm(nextForm);
    setFormErrors({});
  };

  const validateForm = (): ProductFormErrors => {
    if (!form) {
      return {};
    }
    const nextErrors: ProductFormErrors = {};
    if (!form.id.trim()) {
      nextErrors.id = 'Product ID is required.';
    }
    if (!form.name.trim()) {
      nextErrors.name = 'Product name is required.';
    }
    if (!form.description.trim()) {
      nextErrors.description = 'Description is required.';
    }
    const basePrice = Number(form.basePrice);
    if (form.basePrice.trim() === '' || !Number.isFinite(basePrice) || basePrice < 0) {
      nextErrors.basePrice = 'Enter a valid base price.';
    }
    if (form.availableQuantity.trim() !== '') {
      const availableQuantity = Number(form.availableQuantity);
      if (!Number.isInteger(availableQuantity) || availableQuantity < 0) {
        nextErrors.availableQuantity = 'Available quantity must be a whole number or blank.';
      }
    }
    if (form.scentedAddonPrice.trim() !== '') {
      const scentedAddonPrice = Number(form.scentedAddonPrice);
      if (!Number.isFinite(scentedAddonPrice) || scentedAddonPrice < 0) {
        nextErrors.scentedAddonPrice = 'Scented add-on must be a positive number or blank.';
      }
    }
    if (form.shippingCharge.trim() !== '') {
      const shippingCharge = Number(form.shippingCharge);
      if (!Number.isFinite(shippingCharge) || shippingCharge < 0) {
        nextErrors.shippingCharge = 'Shipping charge must be a positive number or blank.';
      }
    }
    return nextErrors;
  };

  const buildPayload = (): ProductMutationInput | null => {
    if (!form) {
      return null;
    }
    return {
      id: form.id.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      subCategory: normalizeSubCategory(form.category, form.subCategory),
      basePrice: Number(form.basePrice),
      availableQuantity: form.availableQuantity.trim() === '' ? null : Number(form.availableQuantity),
      image: form.image.trim() === '' ? null : form.image.trim(),
      images: parseListInput(form.imagesText),
      isTrending: form.isTrending,
      scentedAddonPrice: form.scentedAddonPrice.trim() === '' ? null : Number(form.scentedAddonPrice),
      colors: parseListInput(form.colorsText),
      shippingCharge: form.shippingCharge.trim() === '' ? null : Number(form.shippingCharge)
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) {
      return;
    }

    dispatch(resetProductSaveState());
    setSuccessMessage('');
    const nextErrors = validateForm();
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = buildPayload();
    if (!payload) {
      return;
    }

    try {
      if (productModalMode === 'create') {
        const created = await dispatch(createProduct(payload)).unwrap();
        await dispatch(fetchProducts()).unwrap();
        setSuccessMessage(`Created "${created.name}" successfully.`);
        setEditingProduct(null);
        setForm(null);
        setFormErrors({});
      } else if (editingProduct) {
        const updated = await dispatch(updateProduct({ id: editingProduct.id, input: payload })).unwrap();
        await dispatch(fetchProducts()).unwrap();
        setSuccessMessage(`Updated "${updated.name}" successfully.`);
        setEditingProduct(updated);
        setForm(toFormState(updated));
      }
    } catch {
      return;
    }
  };

  const subCategoryOptions =
    form?.category === 'tumblers'
      ? [
          { value: 'steel-tumbler', label: 'Steel Tumbler' },
          { value: 'glass-tumbler', label: 'Glass Tumbler' }
        ]
      : form?.category === 'stickers'
        ? [
            { value: 'full_wrap', label: 'Full Wrap' },
            { value: 'single_sticker', label: 'Single Sticker' }
          ]
        : [];

  return (
    <AdminAccessGate
      title="Manage Products"
      description="Browse products in the same storefront layout and update them with quick preview and edit actions."
    >
      <section className="space-y-3.5">
        {activeCategory !== 'stickers' && productsStatus === 'loading' ? (
          <div className="rounded-2xl border border-lavender-200/80 bg-white/85 p-3 text-xs font-semibold text-lavender-700">
            Loading the latest products...
          </div>
        ) : null}
        {activeCategory !== 'stickers' && productsStatus === 'failed' ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
            Could not load the latest product list. {productsError ? `(${productsError})` : ''}
          </div>
        ) : null}
        {activeCategory === 'stickers' && designsStatus === 'loading' ? (
          <div className="rounded-2xl border border-lavender-200/80 bg-white/85 p-3 text-xs font-semibold text-lavender-700">
            Loading the latest sticker designs...
          </div>
        ) : null}
        {activeCategory === 'stickers' && designsStatus === 'failed' ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
            Could not load the latest sticker designs. {designsError ? `(${designsError})` : ''}
          </div>
        ) : null}
        {productSaveError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
            {productSaveError}
          </div>
        ) : null}
        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.key === activeCategory;
            const isTrendingTab = tab.key === 'trending';
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={`${isTrendingTab ? 'trending-tab-border' : ''} ${isTrendingTab && isActive ? 'trending-tab-border-active' : ''} rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  isTrendingTab
                    ? isActive
                      ? 'border-fuchsia-500 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-lavender-600 text-white shadow-lg shadow-fuchsia-300/40'
                      : 'border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-violet-50 to-lavender-50 text-fuchsia-800 hover:border-fuchsia-400'
                    : isActive
                      ? 'border-lavender-600 bg-gradient-to-r from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-300/50'
                      : 'border-lavender-300 bg-white text-lavender-700 hover:border-lavender-500 hover:bg-lavender-50'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  {isTrendingTab ? (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${isActive ? 'bg-white/20 text-white' : 'bg-fuchsia-100 text-fuchsia-700'}`}>
                      HOT
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {activeCategory === 'stickers' ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-lavender-600">SUB CATEGORY</p>
            <div className="flex flex-wrap gap-2">
              {STICKER_SUBCATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveStickerSubCategory(tab.key)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    tab.key === activeStickerSubCategory
                      ? 'border-lavender-500 bg-lavender-100 text-lavender-800'
                      : 'border-lavender-200 bg-white text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 rounded-[2rem] border border-lavender-200/80 bg-gradient-to-r from-white via-lavender-50 to-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lavender-500">Catalog Controls</p>
            <h2 className="mt-2 font-['Sora'] text-lg font-bold text-lavender-900">
              {activeCategory === 'stickers'
                ? STICKER_SUBCATEGORY_TABS.find((tab) => tab.key === activeStickerSubCategory)?.label
                : CATEGORY_TABS.find((tab) => tab.key === activeCategory)?.label}
            </h2>
            <p className="mt-1 text-sm text-lavender-700">Add a new product or update an existing one without leaving the gallery.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-lavender-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-lavender-700">
              {filteredProducts.length} options
            </span>
            <button className="btn-primary whitespace-nowrap px-4 py-2.5 text-sm" type="button" onClick={handleCreateProduct}>
              Add New Product
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-3xl border border-lavender-200 bg-white shadow-soft">
              <button type="button" className="block w-full text-left" onClick={() => setPreviewProduct(product)}>
                {product.imageAvailable === false ? (
                  <div className="flex h-64 items-center justify-center bg-lavender-50 text-sm font-medium text-lavender-500">No image</div>
                ) : (
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                )}
              </button>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-['Sora'] text-sm font-semibold text-lavender-900 sm:text-base">{product.name}</h3>
                    <p className="mt-1 text-xs text-lavender-600">{product.id}</p>
                  </div>
                  <span className="rounded-full bg-lavender-100 px-3 py-1 text-xs font-semibold text-lavender-700">
                    {formatRupee(product.basePrice)}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-lavender-700">{product.description}</p>
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-lavender-600">
                  <span className="rounded-full bg-lavender-50 px-2.5 py-1">{product.category}</span>
                  {product.subCategory ? <span className="rounded-full bg-lavender-50 px-2.5 py-1">{product.subCategory}</span> : null}
                  {product.isTrending ? <span className="rounded-full bg-fuchsia-50 px-2.5 py-1 text-fuchsia-700">Trending</span> : null}
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 px-3 py-2 text-xs sm:text-sm" type="button" onClick={() => setPreviewProduct(product)}>
                    Preview
                  </button>
                  <button className="btn-primary flex-1 px-3 py-2 text-xs sm:text-sm" type="button" onClick={() => handleEditProduct(product)}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductPreviewModal product={previewProduct} open={!!previewProduct} onClose={() => setPreviewProduct(null)} />

      {form ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-lavender-950/55 backdrop-blur-sm"
            onClick={() => {
              setEditingProduct(null);
              setForm(null);
            }}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-lavender-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lavender-500">
                  {productModalMode === 'create' ? 'Create Product' : 'Update Product'}
                </p>
                <h2 className="mt-2 font-['Sora'] text-2xl font-bold text-lavender-950">
                  {productModalMode === 'create' ? 'Add a New Product' : editingProduct?.name}
                </h2>
                <p className="mt-1 text-sm text-lavender-700">
                  {productModalMode === 'create'
                    ? 'Fill in the product details below and publish it straight to the live catalog.'
                    : 'Update the live product record and keep the storefront in sync.'}
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-xs"
                onClick={() => {
                  setEditingProduct(null);
                  setForm(null);
                }}
              >
                Close
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  id="product-id"
                  label="Product ID"
                  value={form.id}
                  onChange={(value) => setForm((current) => (current ? { ...current, id: value } : current))}
                  error={formErrors.id}
                  readOnly={productModalMode === 'edit'}
                  placeholder="example: blush-steel-tumbler"
                  required
                />
                <FormInput
                  id="product-name"
                  label="Product Name"
                  value={form.name}
                  onChange={(value) => setForm((current) => (current ? { ...current, name: value } : current))}
                  error={formErrors.name}
                  required
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-lavender-900" htmlFor="product-category">Category</label>
                  <select
                    id="product-category"
                    className="input"
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? {
                              ...current,
                              category: event.target.value as ProductCategory,
                              subCategory: buildDefaultSubCategory(event.target.value as ProductCategory)
                            }
                          : current
                      )
                    }
                  >
                    <option value="tumblers">Tumblers</option>
                    <option value="mugs">Mugs</option>
                    <option value="bookmarks">Bookmarks</option>
                    <option value="candles">Candles</option>
                    <option value="gift-hampers">Gift Hampers</option>
                    <option value="accessories">Accessories</option>
                    <option value="stickers">Stickers</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-lavender-900" htmlFor="product-subcategory">Subcategory</label>
                  <select
                    id="product-subcategory"
                    className="input"
                    value={form.subCategory}
                    disabled={subCategoryOptions.length === 0}
                    onChange={(event) =>
                      setForm((current) => (current ? { ...current, subCategory: event.target.value as ProductSubCategory } : current))
                    }
                  >
                    {subCategoryOptions.length > 0 ? (
                      subCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    ) : (
                      <option value="">No subcategory required</option>
                    )}
                  </select>
                </div>
                <FormInput id="base-price" label="Base Price" type="number" value={form.basePrice} onChange={(value) => setForm((current) => (current ? { ...current, basePrice: value } : current))} error={formErrors.basePrice} required />
                <FormInput id="available-quantity" label="Available Quantity" type="number" value={form.availableQuantity} onChange={(value) => setForm((current) => (current ? { ...current, availableQuantity: value } : current))} error={formErrors.availableQuantity} placeholder="Leave blank for unlimited" />
                <FormInput id="shipping-charge" label="Shipping Charge" type="number" value={form.shippingCharge} onChange={(value) => setForm((current) => (current ? { ...current, shippingCharge: value } : current))} error={formErrors.shippingCharge} />
                <FormInput id="scented-addon" label="Scented Add-on Price" type="number" value={form.scentedAddonPrice} onChange={(value) => setForm((current) => (current ? { ...current, scentedAddonPrice: value } : current))} error={formErrors.scentedAddonPrice} />
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-lavender-800">Description</span>
                <textarea className={`input min-h-28 resize-y ${formErrors.description ? '!border-red-400 !ring-1 !ring-red-200' : ''}`} value={form.description} onChange={(event) => setForm((current) => (current ? { ...current, description: event.target.value } : current))} />
                {formErrors.description ? <p className="text-xs text-red-600">{formErrors.description}</p> : null}
              </label>

              <div className="grid gap-4 lg:grid-cols-2">
                <FormInput id="product-image" label="Primary Image URL" value={form.image} onChange={(value) => setForm((current) => (current ? { ...current, image: value } : current))} error={formErrors.image} />
                <label className="flex items-center gap-3 rounded-2xl border border-lavender-200 bg-lavender-50/70 px-4 py-3 text-sm font-medium text-lavender-900">
                  <input type="checkbox" checked={form.isTrending} onChange={(event) => setForm((current) => (current ? { ...current, isTrending: event.target.checked } : current))} />
                  Mark as trending
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-lavender-800">Gallery Images</span>
                  <textarea className="input min-h-32 resize-y" value={form.imagesText} onChange={(event) => setForm((current) => (current ? { ...current, imagesText: event.target.value } : current))} placeholder="One image URL per line or comma-separated" />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-lavender-800">Color Options</span>
                  <textarea className="input min-h-32 resize-y" value={form.colorsText} onChange={(event) => setForm((current) => (current ? { ...current, colorsText: event.target.value } : current))} placeholder="One color per line or comma-separated" />
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setForm(null);
                  }}
                >
                  Cancel
                </button>
                <button className="btn-primary" type="submit" disabled={productSaveStatus === 'saving'}>
                  {productSaveStatus === 'saving' ? (productModalMode === 'create' ? 'Creating...' : 'Updating...') : productModalMode === 'create' ? 'Create Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminAccessGate>
  );
};
