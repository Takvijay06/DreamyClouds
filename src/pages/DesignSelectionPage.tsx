import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DesignCard } from '../components/DesignCard';
import { Layout } from '../components/Layout';
import { LazyImage } from '../components/LazyImage';
import fullWrapPlacementImage from '../data/Products/tumblers/Full Wrap.jpeg';
import randomPlacementImage from '../data/Products/tumblers/Random.jpeg';
import {
  addToCart,
  setDesign,
  setLetDaisyDecide,
  setPersonalizedNote,
  setPlacementStyle
} from '../features/order/orderSlice';
import {
  selectFilteredDesigns,
  selectOrder,
  selectSelectedDesign,
  selectSelectedProduct
} from '../features/order/selectors';
import { ProductCategory } from '../features/order/orderTypes';

const DEFAULT_COLORS_BY_CATEGORY: Record<ProductCategory, string[]> = {
  tumblers: ['White', 'Black', 'Pink', 'Sky Blue'],
  mugs: ['White', 'Matte Black', 'Red', 'Navy Blue'],
  bookmarks: ['Ivory', 'Blush Pink', 'Sage Green', 'Lavender'],
  candles: ['Cream', 'Rose Gold', 'Sand Beige', 'Olive'],
  'gift-hampers': ['Classic Red', 'Royal Blue', 'Emerald', 'Pastel Peach'],
  accessories: ['Silver', 'Gold', 'Rose Gold', 'Black'],
  stickers: ['Multicolor']
};

export const DesignSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const selectedDesign = useAppSelector(selectSelectedDesign);
  const filteredDesigns = useAppSelector(selectFilteredDesigns);
  const isStickerDesignFlowProduct = product?.category === 'tumblers' || product?.category === 'mugs';
  const isDaisyBouquetCandle = product?.id === 'candle-daisy-flower-bouquet';
  const isNoDesignNeeded = order.designId === 'no-design-needed';
  const requiresPlacement =
    !isDaisyBouquetCandle &&
    !isNoDesignNeeded &&
    (!isStickerDesignFlowProduct || selectedDesign?.stickerSubCategory === 'full-wrap');
  const canAddToCart = isDaisyBouquetCandle
    ? true
    : !!order.designId && (!requiresPlacement || order.letDaisyDecide || !!order.placementStyle);
  const [previewDesignId, setPreviewDesignId] = useState<string | null>(null);
  const buttonAreaRef = useRef<HTMLDivElement | null>(null);
  const previewDesign = useMemo(
    () => filteredDesigns.find((design) => design.id === previewDesignId) ?? null,
    [filteredDesigns, previewDesignId]
  );
  const groupedStickerDesigns = useMemo(() => {
    const single = filteredDesigns.filter((design) => design.stickerSubCategory === 'single');
    const fullWrap = filteredDesigns.filter((design) => design.stickerSubCategory === 'full-wrap');
    if (!isStickerDesignFlowProduct) {
      return [{ key: 'all', title: 'Designs', items: filteredDesigns }];
    }
    return [
      { key: 'single', title: 'Single Sticker', items: single },
      { key: 'full-wrap', title: 'Full Wrap Sticker', items: fullWrap }
    ].filter((group) => group.items.length > 0);
  }, [filteredDesigns, isStickerDesignFlowProduct]);

  useEffect(() => {
    if (!product) {
      navigate('/');
      return;
    }

    if (
      product.category === 'bookmarks' ||
      product.category === 'accessories' ||
      product.category === 'stickers' ||
      product.category === 'candles'
    ) {
      navigate('/preview');
    }
  }, [product, navigate]);

  useEffect(() => {
    if (!order.designId || typeof window === 'undefined') {
      return;
    }
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) {
      return;
    }
    window.requestAnimationFrame(() => {
      buttonAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [order.designId]);

  if (
    !product ||
    product.category === 'bookmarks' ||
    product.category === 'accessories' ||
    product.category === 'stickers' ||
    product.category === 'candles'
  ) {
    return null;
  }

  return (
    <Layout currentStep={2}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-lavender-200/80 bg-lavender-50/80 p-4">
          <p className="text-sm text-lavender-700">
            Selected product: <span className="font-semibold text-lavender-900">{product.name}</span>
          </p>
          <p className="mt-1 text-xs text-lavender-600 sm:text-sm">
            {isDaisyBouquetCandle ? 'Add your custom note/branding/wishes.' : 'Pick a design that best matches your style.'}
          </p>
        </div>

        {!isDaisyBouquetCandle ? (
          <section className="space-y-2 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <h2 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Select Design</h2>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-lavender-700">
              Order Step -2: click to select the sticker
            </p>
            <button
              type="button"
              onClick={() => {
                dispatch(setDesign('no-design-needed'));
                dispatch(setPlacementStyle(''));
                dispatch(setLetDaisyDecide(false));
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isNoDesignNeeded
                  ? 'border-lavender-500 bg-lavender-50 text-lavender-900 ring-2 ring-lavender-200'
                  : 'border-lavender-200 bg-white text-lavender-700 hover:border-lavender-400 hover:bg-lavender-50'
              }`}
            >
              No design needed
            </button>
            <div className="space-y-4">
              {groupedStickerDesigns.map((group) => (
                <div key={group.key} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-lavender-600">{group.title}</p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {group.items.map((design) => (
                      <DesignCard
                        key={design.id}
                        design={design}
                        selected={order.designId === design.id}
                        onPreview={(id) => setPreviewDesignId(id)}
                        onSelect={(id) => {
                          dispatch(setDesign(id));
                          const selected = filteredDesigns.find((entry) => entry.id === id);
                          if (selected?.stickerSubCategory === 'single') {
                            dispatch(setPlacementStyle(''));
                            dispatch(setLetDaisyDecide(false));
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {order.designId && requiresPlacement && !isDaisyBouquetCandle ? (
          <section className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <h2 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Placement</h2>
            <p className="text-xs text-lavender-600 sm:text-sm">
              Placement options: Full Wrap or Random Placement. Sticker-only price is INR 299, and when applied on tumbler or mug
              only INR 199 is added.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                disabled={order.letDaisyDecide}
                onClick={() => dispatch(setPlacementStyle('full-wrap'))}
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  order.placementStyle === 'full-wrap'
                    ? 'border-lavender-500 bg-lavender-50 ring-2 ring-lavender-200'
                    : 'border-lavender-200 bg-white'
                } ${order.letDaisyDecide ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="relative h-52 w-full bg-lavender-50/40">
                  <img
                    src={fullWrapPlacementImage}
                    alt="Full wrap placement"
                    className="h-52 w-full object-contain bg-lavender-50/40 p-1"
                    loading="lazy"
                  />
                </div>
                <p className="px-3 pb-3 pt-2 text-base font-semibold text-lavender-800">Full Wrap</p>
              </button>
              <button
                type="button"
                disabled={order.letDaisyDecide}
                onClick={() => dispatch(setPlacementStyle('random-placement'))}
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  order.placementStyle === 'random-placement'
                    ? 'border-lavender-500 bg-lavender-50 ring-2 ring-lavender-200'
                    : 'border-lavender-200 bg-white'
                } ${order.letDaisyDecide ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="relative h-52 w-full bg-lavender-50/40">
                  <img
                    src={randomPlacementImage}
                    alt="Random placement"
                    className="h-52 w-full object-cover bg-lavender-50/40 p-1"
                    loading="lazy"
                  />
                </div>
                <p className="px-3 pb-3 pt-2 text-base font-semibold text-lavender-800">Random Placement</p>
              </button>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-lavender-200/80 bg-white p-4">
              <input
                type="checkbox"
                checked={order.letDaisyDecide}
                onChange={(event) => dispatch(setLetDaisyDecide(event.target.checked))}
                className="h-4 w-4 accent-lavender-600"
              />
              <span className="text-sm font-medium text-lavender-800">Let Daisy Decide !</span>
            </label>
          </section>
        ) : null}

        {order.designId && isStickerDesignFlowProduct && !requiresPlacement && !isDaisyBouquetCandle ? (
          <section className="rounded-2xl border border-lavender-200/80 bg-lavender-50/70 p-4 text-sm text-lavender-800">
            Single sticker design selected. Placement option is not required.
          </section>
        ) : null}

        {order.designId || isDaisyBouquetCandle ? (
          <section className="space-y-2 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-lavender-800">
                {isDaisyBouquetCandle ? 'Customise Note / Branding / Wishes' : 'Personalized Name (optional)'}
              </span>
              <textarea
                className="input min-h-20 resize-y"
                maxLength={160}
                value={order.personalizedNote}
                onChange={(event) => dispatch(setPersonalizedNote(event.target.value))}
                placeholder={isDaisyBouquetCandle ? 'Type your custom note here' : 'Example: Aanya'}
              />
              <p className="text-xs text-lavender-600">
                One letter costs 10 rupees. Current: {order.personalizedNote.replace(/\s+/g, '').length} letters = INR{' '}
                {order.personalizedNote.replace(/\s+/g, '').length * 10}
              </p>
            </label>
          </section>
        ) : null}

        <div ref={buttonAreaRef} className="flex justify-between gap-3">
          <button className="btn-secondary" type="button" onClick={() => navigate('/')}>
            Back
          </button>
          <button
            className="btn-primary"
            type="button"
            disabled={!canAddToCart}
            onClick={() => {
              const selectedColor =
                order.selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : DEFAULT_COLORS_BY_CATEGORY[product.category][0]) || 'N/A';
              dispatch(
                addToCart({
                  productId: product.id,
                  quantity: order.quantity,
                  selectedColor,
                  selectedStickerId: selectedDesign?.productCategory === 'stickers' ? selectedDesign.id : null
                })
              );
              navigate('/preview');
            }}
          >
            Add to Cart
          </button>
        </div>

        {previewDesign ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-lavender-100 px-4 py-3">
                <p className="font-['Sora'] text-sm font-bold text-lavender-900">Sticker Preview</p>
                <button className="btn-secondary px-3 py-1.5 text-xs" type="button" onClick={() => setPreviewDesignId(null)}>
                  Close
                </button>
              </div>
              <div className="max-h-[78vh] overflow-y-auto p-4">
                <div className="sticky top-0 z-10 flex items-center justify-center rounded-2xl bg-white/90 pb-2 pt-1 backdrop-blur-sm">
                  <LazyImage
                    src={previewDesign.image}
                    alt={previewDesign.name}
                    showShimmer
                    wrapperClassName="h-72 w-full rounded-2xl bg-lavender-50/50"
                    imgClassName="h-72 w-full rounded-2xl object-contain p-2"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-lavender-900">{previewDesign.name}</p>
              </div>
            </div>
          </div>
        ) : null}

        {order.designId && requiresPlacement && !order.placementStyle && !order.letDaisyDecide ? (
          <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
            <div className="rounded-2xl border border-lavender-300 bg-white px-4 py-3 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-lavender-700">Placement</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button className="btn-secondary px-3 py-2 text-xs" type="button" onClick={() => dispatch(setPlacementStyle('full-wrap'))}>
                  Full Wrap
                </button>
                <button className="btn-secondary px-3 py-2 text-xs" type="button" onClick={() => dispatch(setPlacementStyle('random-placement'))}>
                  Random
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};
