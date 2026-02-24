import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../features/order/orderTypes';

interface ProductPreviewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const IMAGE_SLIDE_MS = 260;

export const ProductPreviewModal = ({ product, open, onClose }: ProductPreviewModalProps) => {
  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.images && product.images.length > 0 ? product.images : [product.image];
  }, [product]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');
  const [hasSlideStarted, setHasSlideStarted] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const slideTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    setActiveImageIndex(0);
    setPreviousImageIndex(null);
    setHasSlideStarted(false);
    setIsSliding(false);
  }, [product, open]);

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

  if (!open || !product) {
    return null;
  }

  const hasMultipleImages = productImages.length > 1;

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

  const enteringStartClass = slideDirection === 'next' ? 'translate-x-full' : '-translate-x-full';
  const exitingEndClass = slideDirection === 'next' ? '-translate-x-full' : 'translate-x-full';

  const activeImageClass = isSliding
    ? hasSlideStarted
      ? 'translate-x-0'
      : enteringStartClass
    : 'translate-x-0';

  const previousImageClass = hasSlideStarted ? exitingEndClass : 'translate-x-0';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 bg-lavender-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-lavender-200 bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-lavender-100 bg-white px-4 py-3">
          <h3 className="font-['Sora'] text-base font-bold text-lavender-900">{product.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-lavender-300 bg-white px-3 py-1 text-sm font-semibold text-lavender-700 transition hover:bg-lavender-100"
          >
            Close
          </button>
        </div>

        <div className="relative h-[75vh] min-h-[280px] w-full overflow-hidden bg-lavender-50">
          {previousImageIndex !== null ? (
            <img
              src={productImages[previousImageIndex]}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-contain p-2 transition-transform ease-in-out ${previousImageClass}`}
              style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
            />
          ) : null}

          <img
            src={productImages[activeImageIndex]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-contain p-2 transition-transform ease-in-out ${activeImageClass}`}
            style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
          />

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-lavender-900/20 to-transparent transition hover:from-lavender-900/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lavender-300"
                onClick={showPreviousImage}
              />
              <button
                type="button"
                aria-label="Next image"
                className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-lavender-900/20 to-transparent transition hover:from-lavender-900/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lavender-300"
                onClick={showNextImage}
              />
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/85 px-2.5 py-1">
                {productImages.map((image, index) => (
                  <span
                    key={`${image}-${index}`}
                    className={`h-2 w-2 rounded-full ${index === activeImageIndex ? 'bg-lavender-700' : 'bg-lavender-300'}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
};
