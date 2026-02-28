import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Product } from '../features/order/orderTypes';
import { formatRupee } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const IMAGE_SLIDE_MS = 240;

export const ProductCard = ({ product, selected, onSelect, onPreview, onAddToCart }: ProductCardProps) => {
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const computedOriginalPrice = Math.ceil((product.basePrice * 1.2) / 10) * 10;
  const originalPrice =
    typeof product.originalPrice === 'number' && product.originalPrice > product.basePrice
      ? product.originalPrice
      : computedOriginalPrice;
  const hasMultipleImages = productImages.length > 1;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');
  const [hasSlideStarted, setHasSlideStarted] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const slideTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

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

    event.preventDefault();
    onSelect(product.id);
  };

  const enteringStartClass = slideDirection === 'next' ? 'translate-x-full' : '-translate-x-full';
  const exitingEndClass = slideDirection === 'next' ? '-translate-x-full' : 'translate-x-full';

  const activeImageClass = isSliding
    ? hasSlideStarted
      ? 'translate-x-0'
      : enteringStartClass
    : 'translate-x-0';

  const previousImageClass = hasSlideStarted ? exitingEndClass : 'translate-x-0';

  return (
    <div
      className={`group w-full overflow-hidden rounded-3xl border text-left transition duration-200 ${
        selected
          ? 'border-lavender-600 bg-lavender-50/70 ring-2 ring-lavender-300'
          : 'border-lavender-200 bg-white hover:-translate-y-1 hover:border-lavender-400 hover:shadow-soft'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(product.id)}
        onKeyDown={onImageKeyDown}
        className="relative block w-full cursor-pointer overflow-hidden bg-lavender-50/40 text-left outline-none focus-visible:ring-2 focus-visible:ring-lavender-400"
      >
        <div className="relative h-44 w-full overflow-hidden">
          {previousImageIndex !== null ? (
            <img
              src={productImages[previousImageIndex]}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-contain p-2 transition-transform ease-in-out ${previousImageClass}`}
              style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
              loading="lazy"
            />
          ) : null}

          <img
            src={productImages[activeImageIndex]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-contain p-2 transition-transform ease-in-out ${activeImageClass}`}
            style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
            loading="lazy"
          />

          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lavender-700">
            {product.category}
          </span>

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

      <button type="button" onClick={() => onSelect(product.id)} className="w-full text-left">
        <div className="space-y-2.5 p-4">
          <h3 className="font-['Sora'] text-base font-bold text-lavender-900">{product.name}</h3>
          <p className="text-sm text-lavender-700">{product.description}</p>
        </div>
      </button>

      <div className="space-y-3 border-t border-lavender-100 px-4 pb-4 pt-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="btn-primary flex-1 px-3 py-2 text-xs sm:text-sm"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => onPreview(product)}
            className="btn-secondary flex-1 px-3 py-2 text-xs sm:text-sm"
          >
            Preview
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-lavender-500 line-through">{formatRupee(originalPrice)}</p>
            <p className="text-base font-bold text-lavender-800">{formatRupee(product.basePrice)}</p>
          </div>
          {selected ? (
            <span className="rounded-full bg-lavender-600 px-2.5 py-1 text-[11px] font-bold text-white">Selected</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
