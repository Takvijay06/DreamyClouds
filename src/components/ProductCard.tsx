import { KeyboardEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NoImageBanner } from './NoImageBanner';
import { Product } from '../features/order/orderTypes';
import { formatRupee } from '../utils/currency';

const DAISY_BOUQUET_CANDLE_ID = 'candle-daisy-flower-bouquet';

interface ProductCardProps {
  product: Product;
  onShare: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  /** Shown only for Daisy bouquet candle — sets product in order so candle options appear below. */
  onRequestCandleOptions?: () => void;
}

const IMAGE_SLIDE_MS = 240;

export const ProductCard = ({ product, onShare, onBuyNow, onRequestCandleOptions }: ProductCardProps) => {
  const hasImage = product.imageAvailable !== false;
  const productImages = hasImage ? (product.images && product.images.length > 0 ? product.images : [product.image]) : [];
  const hasMultipleImages = productImages.length > 1;
  const isSoldOut = product.availableQuantity === 0;
  // const stockLabel =
  //   product.availableQuantity === null || product.availableQuantity === undefined
  //     ? 'No stock limit'
  //     : `${product.availableQuantity} available`;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');
  const [hasSlideStarted, setHasSlideStarted] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const slideTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchLastXRef = useRef<number | null>(null);
  const touchLastYRef = useRef<number | null>(null);
  const hasTouchMovedRef = useRef(false);
  const lastSwipeAtRef = useRef(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const categoryLabel =
    product.category === 'tumblers'
      ? product.subCategory === 'glass-tumbler'
        ? 'glass tumbler'
        : 'steel tumbler'
      : product.category.replace('-', ' ');

  useEffect(() => {
    return () => {
      if (slideTimerRef.current !== null) {
        window.clearTimeout(slideTimerRef.current);
      }
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!imageModalOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setImageModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [imageModalOpen]);

  useEffect(() => {
    setActiveImageIndex(0);
    setPreviousImageIndex(null);
    setHasSlideStarted(false);
    setIsSliding(false);
  }, [product.id]);

  const transitionToImage = (nextIndex: number, direction: 'next' | 'previous') => {
    if (!hasMultipleImages || isSliding || nextIndex === activeImageIndex) {
      return;
    }

    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
    }
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    setSlideDirection(direction);
    setPreviousImageIndex(activeImageIndex);
    setActiveImageIndex(nextIndex);
    setHasSlideStarted(false);
    setIsSliding(true);

    frameRef.current = window.requestAnimationFrame(() => {
      setHasSlideStarted(true);
    });

    slideTimerRef.current = window.setTimeout(() => {
      setPreviousImageIndex(null);
      setHasSlideStarted(false);
      setIsSliding(false);
    }, IMAGE_SLIDE_MS);
  };

  const showPreviousImage = () => {
    const nextIndex = (activeImageIndex - 1 + productImages.length) % productImages.length;
    transitionToImage(nextIndex, 'previous');
  };

  const showNextImage = () => {
    const nextIndex = (activeImageIndex + 1) % productImages.length;
    transitionToImage(nextIndex, 'next');
  };

  const onImageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    if (isSoldOut) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setModalImageIndex(activeImageIndex);
    setImageModalOpen(true);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) {
      return;
    }
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchLastXRef.current = touch.clientX;
    touchLastYRef.current = touch.clientY;
    hasTouchMovedRef.current = false;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleImages || touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;
    touchLastXRef.current = touch.clientX;
    touchLastYRef.current = touch.clientY;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      hasTouchMovedRef.current = true;
      event.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages || touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }
    const endX = touchLastXRef.current ?? touchStartXRef.current;
    const endY = touchLastYRef.current ?? touchStartYRef.current;
    const deltaX = endX - touchStartXRef.current;
    const deltaY = endY - touchStartYRef.current;
    const swipeThreshold = 40;

    if (hasTouchMovedRef.current && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= swipeThreshold) {
      if (deltaX > 0) {
        showPreviousImage();
      } else {
        showNextImage();
      }
      lastSwipeAtRef.current = Date.now();
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchLastXRef.current = null;
    touchLastYRef.current = null;
    hasTouchMovedRef.current = false;
  };

  const handleImageAreaClick = () => {
    if (isSoldOut) {
      return;
    }
    if (Date.now() - lastSwipeAtRef.current < 350) {
      return;
    }
    setModalImageIndex(activeImageIndex);
    setImageModalOpen(true);
  };

  const modalShowPrevious = () => {
    if (!hasMultipleImages) {
      return;
    }
    setModalImageIndex((i) => (i - 1 + productImages.length) % productImages.length);
  };

  const modalShowNext = () => {
    if (!hasMultipleImages) {
      return;
    }
    setModalImageIndex((i) => (i + 1) % productImages.length);
  };

  const enteringStartClass = slideDirection === 'next' ? 'translate-x-full' : '-translate-x-full';
  const exitingEndClass = slideDirection === 'next' ? '-translate-x-full' : 'translate-x-full';

  const activeImageClass = isSliding
    ? hasSlideStarted
      ? 'translate-x-0'
      : enteringStartClass
    : 'translate-x-0';

  const previousImageClass = hasSlideStarted ? exitingEndClass : 'translate-x-0';

  const imageModal =
    imageModalOpen && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            <button
              type="button"
              aria-label="Close image"
              className="absolute inset-0 bg-lavender-900/55 backdrop-blur-sm"
              onClick={() => setImageModalOpen(false)}
            />
            <div className="relative z-10 flex max-h-[min(90vh,880px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-lavender-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-lavender-100 px-4 py-3">
                <p className="font-['Sora'] text-sm font-bold text-lavender-900 sm:text-base">{product.name}</p>
                <button
                  type="button"
                  className="rounded-xl border border-lavender-300 bg-white px-3 py-1.5 text-sm font-semibold text-lavender-800 transition hover:bg-lavender-50"
                  onClick={() => setImageModalOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="relative flex min-h-[240px] flex-1 items-center justify-center bg-lavender-50/80 p-4">
                {hasImage ? (
                  <img
                    src={productImages[modalImageIndex]}
                    alt={`${product.name} ${modalImageIndex + 1}`}
                    className="max-h-[min(75vh,720px)] w-full object-contain"
                    loading="eager"
                  />
                ) : (
                  <div className="relative h-72 w-full max-w-lg">
                    <NoImageBanner category={product.category} className="rounded-2xl" />
                  </div>
                )}
                {hasMultipleImages ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      className="absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-lavender-900/25 to-transparent transition hover:from-lavender-900/35"
                      onClick={modalShowPrevious}
                    />
                    <button
                      type="button"
                      aria-label="Next image"
                      className="absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-lavender-900/25 to-transparent transition hover:from-lavender-900/35"
                      onClick={modalShowNext}
                    />
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-sm">
                      {productImages.map((image, index) => (
                        <button
                          key={`modal-${image}-${index}`}
                          type="button"
                          aria-label={`Show image ${index + 1}`}
                          className={`h-2 w-2 rounded-full transition ${index === modalImageIndex ? 'bg-lavender-700' : 'bg-lavender-300 hover:bg-lavender-500'}`}
                          onClick={() => setModalImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      className={`group w-full overflow-hidden rounded-3xl border border-lavender-200 bg-white text-left transition duration-200 hover:-translate-y-1 hover:border-lavender-400 hover:shadow-soft ${
        isSoldOut ? 'opacity-70' : ''
      }`}
    >
      {imageModal}
      <div
        role="button"
        tabIndex={isSoldOut ? -1 : 0}
        aria-disabled={isSoldOut}
        aria-label={`View ${product.name} images`}
        onClick={handleImageAreaClick}
        onKeyDown={onImageKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative block w-full overflow-hidden bg-lavender-50/40 text-left outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 ${
          isSoldOut ? 'cursor-not-allowed' : 'cursor-zoom-in'
        }`}
      >
        <div className="relative h-44 w-full overflow-hidden">
          {hasImage && previousImageIndex !== null ? (
            <img
              src={productImages[previousImageIndex]}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-contain p-2 transition-transform ease-in-out ${previousImageClass}`}
              style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
              loading="eager"
              decoding="sync"
            />
          ) : null}

          {hasImage ? (
            <img
              src={productImages[activeImageIndex]}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-contain p-2 transition-transform ease-in-out ${activeImageClass}`}
              style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
              loading="eager"
              decoding="sync"
            />
          ) : (
            <NoImageBanner category={product.category} />
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lavender-700">
            {categoryLabel}
          </span>
          {isSoldOut ? (
            <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Sold out
            </span>
          ) : null}

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-lavender-900/18 to-transparent transition hover:from-lavender-900/26 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lavender-300"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
              />
              <button
                type="button"
                aria-label="Next image"
                className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-lavender-900/18 to-transparent transition hover:from-lavender-900/26 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lavender-300"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
              />
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-white/75 px-2 py-1">
                {productImages.map((image, index) => (
                  <span
                    key={`${image}-${index}`}
                    className={`h-1.5 w-1.5 rounded-full ${index === activeImageIndex ? 'bg-lavender-700' : 'bg-lavender-300'}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        <h3 className="font-['Sora'] text-base font-bold text-lavender-900">{product.name}</h3>
        <p className="text-sm text-lavender-700">{product.description}</p>
      </div>

      <div className="space-y-3 border-t border-lavender-100 px-4 pb-4 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShare(product);
            }}
            className="btn-secondary px-2 py-2 text-xs sm:px-3 sm:text-sm"
          >
            Share
          </button>
          <button
            type="button"
            disabled={isSoldOut}
            onClick={(event) => {
              event.stopPropagation();
              onBuyNow(product);
            }}
            className="btn-primary px-2 py-2 text-xs sm:px-3 sm:text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            Buy now
          </button>
        </div>
        {product.id === DAISY_BOUQUET_CANDLE_ID && onRequestCandleOptions ? (
          <button
            type="button"
            className="btn-secondary w-full px-3 py-2 text-xs sm:text-sm"
            onClick={(event) => {
              event.stopPropagation();
              onRequestCandleOptions();
            }}
          >
            Customize candle options
          </button>
        ) : null}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-lavender-800">{formatRupee(product.basePrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
