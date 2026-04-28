import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AdminAccessGate } from '../components/AdminAccessGate';
import { FormInput } from '../components/FormInput';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Design, ProductCategory, StickerSubCategory } from '../features/order/orderTypes';
import {
  fetchDesigns,
  resetDesignSaveState,
  selectDesignSaveError,
  selectDesignSaveStatus,
  selectDesigns,
  selectDesignsError,
  selectDesignsStatus,
  updateDesign
} from '../features/designs/designsSlice';
import { DesignMutationInput } from '../features/designs/designsApi';

type DesignFormState = {
  id: string;
  name: string;
  productCategory: ProductCategory;
  stickerSubCategory: StickerSubCategory | '';
  image: string;
  basePrice: string;
  availableQuantity: string;
};

type DesignFormErrors = Partial<Record<keyof DesignFormState, string>>;

const CATEGORY_OPTIONS: Array<{ value: ProductCategory; label: string }> = [
  { value: 'tumblers', label: 'Tumblers' },
  { value: 'mugs', label: 'Mugs' },
  { value: 'bookmarks', label: 'Bookmarks' },
  { value: 'candles', label: 'Candles' },
  { value: 'gift-hampers', label: 'Gift Hampers' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'stickers', label: 'Stickers' }
];

const toFormState = (design: Design): DesignFormState => ({
  id: design.id,
  name: design.name,
  productCategory: design.productCategory,
  stickerSubCategory: design.stickerSubCategory ?? '',
  image: design.image,
  basePrice: typeof design.basePrice === 'number' && Number.isFinite(design.basePrice) ? String(design.basePrice) : '',
  availableQuantity:
    typeof design.availableQuantity === 'number' && Number.isFinite(design.availableQuantity)
      ? String(design.availableQuantity)
      : ''
});

const buildPayload = (form: DesignFormState): DesignMutationInput => ({
  id: form.id.trim(),
  name: form.name.trim(),
  productCategory: form.productCategory,
  stickerSubCategory: form.productCategory === 'stickers' ? form.stickerSubCategory : '',
  image: form.image.trim(),
  basePrice: form.basePrice.trim() === '' ? null : Number(form.basePrice),
  availableQuantity: form.availableQuantity.trim() === '' ? null : Number(form.availableQuantity)
});

const DesignPreviewModal = ({ design, onClose }: { design: Design | null; onClose: () => void }) => {
  if (!design) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-lavender-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-lavender-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-lavender-100 px-4 py-3">
          <div>
            <h3 className="font-['Sora'] text-lg font-bold text-lavender-950">{design.name}</h3>
            <p className="text-xs text-lavender-600">{design.id}</p>
          </div>
          <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="bg-lavender-50 p-4">
          <img src={design.image} alt={design.name} className="h-[70vh] min-h-[320px] w-full object-contain" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export const AdminDesignsPage = () => {
  const dispatch = useAppDispatch();
  const designs = useAppSelector(selectDesigns);
  const designsStatus = useAppSelector(selectDesignsStatus);
  const designsError = useAppSelector(selectDesignsError);
  const designSaveStatus = useAppSelector(selectDesignSaveStatus);
  const designSaveError = useAppSelector(selectDesignSaveError);

  const [previewDesign, setPreviewDesign] = useState<Design | null>(null);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [form, setForm] = useState<DesignFormState | null>(null);
  const [formErrors, setFormErrors] = useState<DesignFormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (designsStatus === 'idle') {
      dispatch(fetchDesigns());
    }
  }, [dispatch, designsStatus]);

  useEffect(() => {
    if (designSaveStatus === 'succeeded') {
      const timerId = window.setTimeout(() => {
        setSuccessMessage('');
        dispatch(resetDesignSaveState());
      }, 2500);
      return () => window.clearTimeout(timerId);
    }
    return undefined;
  }, [dispatch, designSaveStatus]);

  const groupedDesigns = useMemo(() => {
    const stickerDesigns = designs.filter((design) => design.productCategory === 'stickers');
    const nonStickerDesigns = designs.filter((design) => design.productCategory !== 'stickers');
    const single = stickerDesigns.filter((design) => design.stickerSubCategory === 'single_sticker');
    const fullWrap = stickerDesigns.filter((design) => design.stickerSubCategory === 'full_wrap');

    const groups = nonStickerDesigns.reduce<Array<{ key: string; title: string; items: Design[] }>>((acc, design) => {
      const existing = acc.find((entry) => entry.key === design.productCategory);
      if (existing) {
        existing.items.push(design);
      } else {
        acc.push({
          key: design.productCategory,
          title: CATEGORY_OPTIONS.find((option) => option.value === design.productCategory)?.label ?? design.productCategory,
          items: [design]
        });
      }
      return acc;
    }, []);

    if (single.length > 0) {
      groups.push({ key: 'sticker-single', title: 'Single Sticker', items: single });
    }
    if (fullWrap.length > 0) {
      groups.push({ key: 'sticker-full-wrap', title: 'Full Wrap Sticker', items: fullWrap });
    }

    return groups;
  }, [designs]);

  const handleEditDesign = (design: Design) => {
    dispatch(resetDesignSaveState());
    setSuccessMessage('');
    setEditingDesign(design);
    setForm(toFormState(design));
    setFormErrors({});
  };

  const validateForm = (): DesignFormErrors => {
    if (!form) {
      return {};
    }

    const nextErrors: DesignFormErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Design name is required.';
    }
    if (!form.image.trim()) {
      nextErrors.image = 'Image URL is required.';
    }
    if (form.basePrice.trim() !== '') {
      const basePrice = Number(form.basePrice);
      if (!Number.isFinite(basePrice) || basePrice < 0) {
        nextErrors.basePrice = 'Base price must be a positive number or blank.';
      }
    }
    if (form.availableQuantity.trim() !== '') {
      const availableQuantity = Number(form.availableQuantity);
      if (!Number.isInteger(availableQuantity) || availableQuantity < 0) {
        nextErrors.availableQuantity = 'Available quantity must be a whole number or blank.';
      }
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingDesign || !form) {
      return;
    }

    dispatch(resetDesignSaveState());
    setSuccessMessage('');
    const nextErrors = validateForm();
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const updated = await dispatch(updateDesign({ id: editingDesign.id, input: buildPayload(form) })).unwrap();
      await dispatch(fetchDesigns()).unwrap();
      setSuccessMessage(`Updated "${updated.name}" successfully.`);
      setEditingDesign(updated);
      setForm(toFormState(updated));
    } catch {
      return;
    }
  };

  return (
    <AdminAccessGate
      title="Manage Designs"
      description="Review designs in the same visual grouping as the storefront and update them with quick preview and edit actions."
    >
      <div className="space-y-5">
        {designsStatus === 'loading' ? (
          <div className="rounded-2xl border border-lavender-200/80 bg-white/85 p-3 text-xs font-semibold text-lavender-700">
            Loading the latest designs...
          </div>
        ) : null}
        {designsStatus === 'failed' ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
            Could not load the latest designs. {designsError ? `(${designsError})` : ''}
          </div>
        ) : null}
        {designSaveError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
            {designSaveError}
          </div>
        ) : null}
        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {groupedDesigns.map((group) => (
          <section key={group.key} className="space-y-2 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">{group.title}</h2>
              <span className="rounded-full bg-lavender-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-lavender-700">
                {group.items.length} items
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {group.items.map((design) => (
                <div key={design.id} className="overflow-hidden rounded-3xl border border-lavender-200 bg-white shadow-soft">
                  <button type="button" className="block w-full bg-lavender-50/40" onClick={() => setPreviewDesign(design)}>
                    <img src={design.image} alt={design.name} className="h-40 w-full object-contain p-2" loading="lazy" />
                  </button>
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-['Sora'] text-sm font-semibold text-lavender-900 sm:text-base">{design.name}</h3>
                      <p className="mt-1 text-xs text-lavender-600">{design.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-lavender-600">
                      <span className="rounded-full bg-lavender-50 px-2.5 py-1">{design.productCategory}</span>
                      {design.stickerSubCategory ? <span className="rounded-full bg-lavender-50 px-2.5 py-1">{design.stickerSubCategory}</span> : null}
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary flex-1 px-3 py-2 text-xs" type="button" onClick={() => setPreviewDesign(design)}>
                        Preview
                      </button>
                      <button className="btn-primary flex-1 px-3 py-2 text-xs" type="button" onClick={() => handleEditDesign(design)}>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <DesignPreviewModal design={previewDesign} onClose={() => setPreviewDesign(null)} />

      {editingDesign && form ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-lavender-950/55 backdrop-blur-sm" onClick={() => setEditingDesign(null)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-lavender-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lavender-500">Update Design</p>
                <h2 className="mt-2 font-['Sora'] text-2xl font-bold text-lavender-950">{editingDesign.name}</h2>
                <p className="mt-1 text-sm text-lavender-700">Update the live design record used by the storefront.</p>
              </div>
              <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={() => setEditingDesign(null)}>
                Close
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput id="design-id" label="Design ID" value={form.id} onChange={() => undefined} readOnly />
                <FormInput
                  id="design-name"
                  label="Design Name"
                  value={form.name}
                  onChange={(value) => setForm((current) => (current ? { ...current, name: value } : current))}
                  error={formErrors.name}
                  required
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-lavender-900" htmlFor="product-category">Product Category</label>
                  <select
                    id="product-category"
                    className="input"
                    value={form.productCategory}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? {
                              ...current,
                              productCategory: event.target.value as ProductCategory,
                              stickerSubCategory: event.target.value === 'stickers' ? current.stickerSubCategory || 'single_sticker' : ''
                            }
                          : current
                      )
                    }
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-lavender-900" htmlFor="sticker-sub-category">Sticker Subcategory</label>
                  <select
                    id="sticker-sub-category"
                    className="input"
                    disabled={form.productCategory !== 'stickers'}
                    value={form.stickerSubCategory}
                    onChange={(event) =>
                      setForm((current) => (current ? { ...current, stickerSubCategory: event.target.value as StickerSubCategory } : current))
                    }
                  >
                    <option value="single_sticker">Single Sticker</option>
                    <option value="full_wrap">Full Wrap</option>
                  </select>
                </div>
                <FormInput
                  id="base-price"
                  label="Base Price"
                  type="number"
                  value={form.basePrice}
                  onChange={(value) => setForm((current) => (current ? { ...current, basePrice: value } : current))}
                  error={formErrors.basePrice}
                  placeholder="Optional"
                />
                <FormInput
                  id="available-quantity"
                  label="Available Quantity"
                  type="number"
                  value={form.availableQuantity}
                  onChange={(value) => setForm((current) => (current ? { ...current, availableQuantity: value } : current))}
                  error={formErrors.availableQuantity}
                  placeholder="Leave blank for unlimited"
                />
              </div>

              <FormInput
                id="design-image"
                label="Image URL"
                value={form.image}
                onChange={(value) => setForm((current) => (current ? { ...current, image: value } : current))}
                error={formErrors.image}
                required
              />

              <div className="flex justify-end gap-3">
                <button className="btn-secondary" type="button" onClick={() => setEditingDesign(null)}>
                  Cancel
                </button>
                <button className="btn-primary" type="submit" disabled={designSaveStatus === 'saving'}>
                  {designSaveStatus === 'saving' ? 'Updating...' : 'Update Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminAccessGate>
  );
};
