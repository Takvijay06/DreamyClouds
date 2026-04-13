import { TouchEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { Layout } from '../components/Layout';
import { NoImageBanner } from '../components/NoImageBanner';
import { selectStickerProducts } from '../features/designs/designsSlice';
import { selectProducts } from '../features/products/productsSlice';
import { formatRupee } from '../utils/currency';

const IMAGE_SLIDE_MS = 260;

export const ProductPreviewPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const products = useAppSelector(selectProducts);
  const stickerProducts = useAppSelector(selectStickerProducts);
  const product = useMemo(
    () => [...products, ...stickerProducts].find((item) => item.id === productId) ?? null,
    [productId, products, stickerProducts]
  );

  const hasImage = product?.imageAvailable !== false;
  const productImages = useMemo(() => {
    if (!product || !hasImage) {
      return [];
    }
    return product.images && product.images.length > 0 ? product.images : [product.image];
  }, [hasImage, product]);
  const hasMultipleImages = productImages.length > 1;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');
  const [hasSlideStarted, setHasSlideStarted] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const slideTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const copyLabelTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchLastXRef = useRef<number | null>(null);
  const touchLastYRef = useRef<number | null>(null);
  const hasTouchMovedRef = useRef(false);

  useEffect(() => {
    if (!productId) {
      navigate('/', { replace: true });
    }
  }, [navigate, productId]);

  useEffect(() => {
    if (!product && productId && products.length + stickerProducts.length > 0) {
      navigate('/', { replace: true });
    }
  }, [navigate, product, productId, products.length, stickerProducts.length]);

  useEffect(() => {
    setActiveImageIndex(0);
    setPreviousImageIndex(null);
    setHasSlideStarted(false);
    setIsSliding(false);
  }, [productId]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current !== null) {
        window.clearTimeout(slideTimerRef.current);
      }
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (copyLabelTimerRef.current !== null) {
        window.clearTimeout(copyLabelTimerRef.current);
      }
    };
  }, []);

  if (!product) {
    return null;
  }

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
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchLastXRef.current = null;
    touchLastYRef.current = null;
    hasTouchMovedRef.current = false;
  };

  const enteringStartClass = slideDirection === 'next' ? 'translate-x-full' : '-translate-x-full';
  const exitingEndClass = slideDirection === 'next' ? '-translate-x-full' : 'translate-x-full';
  const activeImageClass = isSliding ? (hasSlideStarted ? 'translate-x-0' : enteringStartClass) : 'translate-x-0';
  const previousImageClass = hasSlideStarted ? exitingEndClass : 'translate-x-0';

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const handleCopyLink = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setIsLinkCopied(true);
      if (copyLabelTimerRef.current !== null) {
        window.clearTimeout(copyLabelTimerRef.current);
      }
      copyLabelTimerRef.current = window.setTimeout(() => {
        setIsLinkCopied(false);
      }, 2200);
    } catch {
      showToast('Copy failed. Please copy from browser address bar.');
    }
  };

  const shareText = `Check out this product from Dreamy Clouds By Daisy: ${product.name} - ${formatRupee(product.basePrice)}.`;
  const shareUrl = window.location.href;

  const handleShareWhatsApp = () => {
    const message = `${shareText}\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = async () => {
    const sharePayload = {
      title: `${product.name} | Dreamy Clouds By Daisy`,
      text: shareText,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        showToast('Shared successfully.');
        return;
      }
      throw new Error('Web Share API unavailable');
    } catch {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          showToast('Caption copied. Paste it while posting on Instagram.');
        } else {
          showToast('Share unavailable. Please copy from browser address bar.');
        }
      } finally {
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <Layout currentStep={1}>
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-[120] rounded-2xl border border-lavender-200 bg-white/95 px-4 py-2 text-sm font-semibold text-lavender-800 shadow-lg backdrop-blur"
        >
          {toastMessage}
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-6xl space-y-4">
        <section className="rounded-3xl border border-lavender-200/80 bg-white/95 p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-lavender-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-lavender-700">
                  {product.category.replace('-', ' ')}
                </span>
                {product.availableQuantity === 0 ? (
                  <span className="rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Sold Out
                  </span>
                ) : null}
              </div>
              <h1 className="font-['Sora'] text-2xl font-bold text-lavender-900 sm:text-3xl">{product.name}</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-lavender-700 sm:text-base">{product.description}</p>
              <p className="text-xl font-bold text-lavender-900">{formatRupee(product.basePrice)}</p>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <button
                type="button"
                className={`px-4 py-2 sm:flex-none ${
                  isLinkCopied
                    ? 'rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'btn-secondary'
                }`}
                onClick={handleCopyLink}
              >
                {isLinkCopied ? 'Link copied' : 'Copy Link'}
              </button>
              <button type="button" className="btn-secondary flex-1 px-4 py-2 sm:flex-none" onClick={handleShareWhatsApp}>
                Share Via WhatsApp
              </button>
              <button type="button" className="btn-secondary flex-1 px-4 py-2 sm:flex-none" onClick={handleShareInstagram}>
                Share Via Instagram
              </button>
              <button type="button" className="btn-secondary flex-1 px-4 py-2 sm:flex-none" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-lavender-600">
            Tip: use <span className="font-semibold">Copy Link</span> to share this product preview.
          </p>
        </section>

        <section
          className="relative h-[72vh] min-h-[340px] overflow-hidden rounded-3xl border border-lavender-200 bg-gradient-to-b from-lavender-50 to-white shadow-soft"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
        {hasImage && previousImageIndex !== null ? (
          <img
            src={productImages[previousImageIndex]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-contain p-4 transition-transform ease-in-out sm:p-6 ${previousImageClass}`}
            style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
            loading="eager"
            decoding="sync"
          />
        ) : null}

        {hasImage ? (
          <img
            src={productImages[activeImageIndex]}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-contain p-4 transition-transform ease-in-out sm:p-6 ${activeImageClass}`}
            style={{ transitionDuration: `${IMAGE_SLIDE_MS}ms` }}
            loading="eager"
            decoding="sync"
          />
        ) : (
          <NoImageBanner category={product.category} className="m-2 rounded-2xl" />
        )}

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-lavender-900/22 to-transparent transition hover:from-lavender-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lavender-300"
              onClick={showPreviousImage}
            />
            <button
              type="button"
              aria-label="Next image"
              className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-lavender-900/22 to-transparent transition hover:from-lavender-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lavender-300"
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
        </section>
      </div>
    </Layout>
  );
};
