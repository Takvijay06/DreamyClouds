import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DesignCard } from '../components/DesignCard';
import { Layout } from '../components/Layout';
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
import { Design } from '../features/order/orderTypes';
import { selectDesignsError, selectDesignsStatus } from '../features/designs/designsSlice';

export const DesignSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const selectedDesign = useAppSelector(selectSelectedDesign);
  const filteredDesigns = useAppSelector(selectFilteredDesigns);
  const designsStatus = useAppSelector(selectDesignsStatus);
  const designsError = useAppSelector(selectDesignsError);
  const isStickerDesignFlowProduct = product?.category === 'tumblers' || product?.category === 'mugs';
  const isGlassTumbler = product?.category === 'tumblers' && product?.subCategory === 'glass-tumbler';
  const isDaisyBouquetCandle = product?.id === 'candle-daisy-flower-bouquet';
  const isNoDesignNeeded = order.designId === 'no-design-needed';
  const isSelectedDesignSoldOut = !!selectedDesign && selectedDesign.availableQuantity === 0;
  const requiresPlacement =
    !isDaisyBouquetCandle &&
    !isNoDesignNeeded &&
    !isGlassTumbler &&
    (!isStickerDesignFlowProduct || selectedDesign?.stickerSubCategory === 'full_wrap');
  const canAddToCart = isDaisyBouquetCandle
    ? true
    : !!order.designId &&
      !isSelectedDesignSoldOut &&
      (!requiresPlacement || order.letDaisyDecide || !!order.placementStyle);
  const [previewDesign, setPreviewDesign] = useState<Design | null>(null);
  const buttonAreaRef = useRef<HTMLDivElement | null>(null);
  const placementSectionRef = useRef<HTMLDivElement | null>(null);
  const hasMountedDesignScrollRef = useRef(false);
  const groupedStickerDesigns = useMemo(() => {
    const single = filteredDesigns.filter((design) => design.stickerSubCategory === 'single_sticker');
    const fullWrap = filteredDesigns.filter((design) => design.stickerSubCategory === 'full_wrap');
    if (!isStickerDesignFlowProduct) {
      return [{ key: 'all', title: 'Designs', items: filteredDesigns }];
    }
    return [
      { key: 'single', title: 'Single Sticker', items: single },
      { key: 'full-wrap', title: 'Full Wrap Sticker', items: fullWrap }
    ].filter((group) => group.items.length > 0);
  }, [filteredDesigns, isStickerDesignFlowProduct]);

  useEffect(() => {
    const preloadLimit = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches ? 8 : 16;
    filteredDesigns.slice(0, preloadLimit).forEach((design) => {
      if (!design.image) {
        return;
      }
      const img = new Image();
      img.src = design.image;
    });
  }, [filteredDesigns]);

  useEffect(() => {
    if (!previewDesign) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [previewDesign]);

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
    if (!hasMountedDesignScrollRef.current) {
      hasMountedDesignScrollRef.current = true;
      return;
    }
    if (!order.designId || typeof window === 'undefined') {
      return;
    }
    if (requiresPlacement) {
      return;
    }
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) {
      return;
    }
    window.requestAnimationFrame(() => {
      buttonAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [order.designId, requiresPlacement]);

  const scrollToAfterStickerSelection = (needsPlacement: boolean) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      if (needsPlacement) {
        placementSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      buttonAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

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
            {designsStatus === 'loading' ? (
              <div className="rounded-2xl border border-lavender-200/80 bg-white/85 p-3 text-xs font-semibold text-lavender-700">
                Loading the latest designs…
              </div>
            ) : null}
            {designsStatus === 'failed' ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
                Could not load the latest designs. {designsError ? `(${designsError})` : ''}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => {
                dispatch(setDesign('no-design-needed'));
                dispatch(setPlacementStyle(''));
                dispatch(setLetDaisyDecide(false));
                scrollToAfterStickerSelection(false);
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
                        onPreview={(selected) => setPreviewDesign(selected)}
                        onSelect={(id) => {
                          dispatch(setDesign(id));
                          const selected = filteredDesigns.find((entry) => entry.id === id);
                          const needsPlacement = selected?.stickerSubCategory === 'full_wrap' && !isGlassTumbler;
                          if (isGlassTumbler) {
                            dispatch(setPlacementStyle(''));
                            dispatch(setLetDaisyDecide(false));
                          } else if (selected?.stickerSubCategory === 'single_sticker') {
                            dispatch(setPlacementStyle(''));
                            dispatch(setLetDaisyDecide(false));
                          }
                          scrollToAfterStickerSelection(!!needsPlacement);
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
          <section ref={placementSectionRef} className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <h2 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Placement</h2>
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
            Placement option is not required for this selection.
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
              const selectedColor = '';
                dispatch(
                  addToCart({
                    productId: product.id,
                    quantity: order.quantity,
                    selectedColor,
                    candleScented: false,
                    candleNote: '',
                    selectedStickerId: selectedDesign?.productCategory === 'stickers' ? selectedDesign.id : null,
                    personalizedNote: order.personalizedNote,
                    replaceExisting: true
                  })
                );
                navigate('/preview');
            }}
          >
            Add to Cart
          </button>
        </div>

        {previewDesign && typeof document !== 'undefined'
          ? createPortal(
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
                <div className="flex h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-lavender-100 px-4 py-3">
                    <p className="font-['Sora'] text-sm font-bold text-lavender-900">Sticker Preview</p>
                    <button className="btn-secondary px-3 py-1.5 text-xs" type="button" onClick={() => setPreviewDesign(null)}>
                      Close
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-1 items-center justify-center rounded-2xl bg-lavender-50/50 p-2">
                      <img
                        src={previewDesign.image}
                        alt={previewDesign.name}
                        className="h-full w-full object-contain"
                        loading="eager"
                        decoding="sync"
                      />
                    </div>
                    <p className="mt-3 text-center text-sm font-semibold text-lavender-900">{previewDesign.name}</p>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null}

      </div>
    </Layout>
  );
};
