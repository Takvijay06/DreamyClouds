import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { ProductPreviewModal } from '../components/ProductPreviewModal';
import {
  BIG_RAINBOW_CANDLE_ID,
  CUP_CAKE_CANDLE_ID,
  DAISY_BOUQUET_CANDLE_ID,
  ELEPHANT_CANDLE_ID,
  LOTUS_BOUQUET_CANDLE_ID,
  PRODUCTS,
  ROSE_BOUQUET_CANDLE_ID,
  SMALL_BUBBLE_CANDLE_ID,
  TEDDY_CANDLE_ID,
  resolveCandleScentedCharge
} from '../data/products';
import { addToCart, setCandleNote, setCandleScented, setProduct, setSelectedColor } from '../features/order/orderSlice';
import { selectOrder, selectSelectedProduct } from '../features/order/selectors';
import { Product, ProductCategory, StickerSubCategory } from '../features/order/orderTypes';

type ProductCategoryTab = ProductCategory | 'steel-tumblers' | 'glass-tumblers';

const CATEGORY_TABS: Array<{ key: ProductCategoryTab; label: string }> = [
  { key: 'steel-tumblers', label: 'Steel Tumbler' },
  { key: 'glass-tumblers', label: 'Glass Tumbler' },
  { key: 'mugs', label: 'Mugs' },
  { key: 'candles', label: 'Candles' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'stickers', label: 'Stickers' }
];

const STICKER_SUBCATEGORY_TABS: Array<{ key: StickerSubCategory; label: string }> = [
  { key: 'full-wrap', label: 'Full Wrap' },
  { key: 'single', label: 'Single' }
];

const isStickerSubCategory = (value: unknown): value is StickerSubCategory =>
  value === 'full-wrap' || value === 'single';

const DEFAULT_COLORS_BY_CATEGORY: Record<ProductCategory, string[]> = {
  tumblers: ['White', 'Black', 'Pink', 'Sky Blue'],
  mugs: ['White', 'Matte Black', 'Red', 'Navy Blue'],
  bookmarks: ['Ivory', 'Blush Pink', 'Sage Green', 'Lavender'],
  candles: ['White', 'Pink', 'Red', 'Yellow', 'Purple'],
  'gift-hampers': ['Classic Red', 'Royal Blue', 'Emerald', 'Pastel Peach'],
  accessories: ['Silver', 'Gold', 'Rose Gold', 'Black'],
  stickers: ['Multicolor']
};
const CUP_CAKE_CANDLE_DESIGNS = ['HBD with teddy', 'Pink with sprinkles', 'White with Hearts'];
const DEFAULT_CUP_CAKE_CANDLE_DESIGN = CUP_CAKE_CANDLE_DESIGNS[0];

export const ProductSelectionPage = () => {
  const INSTAGRAM_URL = 'https://www.instagram.com/dreamycloudsbydaisy/';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const [activeCategory, setActiveCategory] = useState<ProductCategoryTab>(() => {
    if (selectedProduct?.category === 'tumblers') {
      return selectedProduct.subCategory === 'glass-tumbler' ? 'glass-tumblers' : 'steel-tumblers';
    }
    return (selectedProduct?.category as ProductCategoryTab) ?? 'steel-tumblers';
  });
  const [activeStickerSubCategory, setActiveStickerSubCategory] = useState<StickerSubCategory>(
    selectedProduct?.category === 'stickers' && isStickerSubCategory(selectedProduct.subCategory)
      ? selectedProduct.subCategory
      : 'full-wrap'
  );
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const buttonAreaRef = useRef<HTMLDivElement | null>(null);
  const hasMountedProductScrollRef = useRef(false);
  const isDaisyBouquetCandle = selectedProduct?.id === DAISY_BOUQUET_CANDLE_ID;
  const isTeddyCandle = selectedProduct?.id === TEDDY_CANDLE_ID;
  const isRoseBouquetCandle = selectedProduct?.id === ROSE_BOUQUET_CANDLE_ID;
  const isLotusBouquetCandle = selectedProduct?.id === LOTUS_BOUQUET_CANDLE_ID;
  const isCuteElephantCandle = selectedProduct?.id === ELEPHANT_CANDLE_ID;
  const isSmallBubbleCandle = selectedProduct?.id === SMALL_BUBBLE_CANDLE_ID;
  const isBigRainbowCandle = selectedProduct?.id === BIG_RAINBOW_CANDLE_ID;
  const isCupCakeCandle = selectedProduct?.id === CUP_CAKE_CANDLE_ID;
  const hasCandleOptions =
    selectedProduct?.category === 'candles' &&
    (
      isDaisyBouquetCandle ||
      isTeddyCandle ||
      isRoseBouquetCandle ||
      isLotusBouquetCandle ||
      isCuteElephantCandle ||
      isSmallBubbleCandle ||
      isBigRainbowCandle ||
      isCupCakeCandle
    );
  const showCandleOptions = hasCandleOptions && activeCategory === 'candles';
  const hideColorOptionForSelectedCandle =
    isCuteElephantCandle || isBigRainbowCandle || isCupCakeCandle || isSmallBubbleCandle;
  const showColorOption = showCandleOptions && !hideColorOptionForSelectedCandle;
  const showCupCakeDesignOption = showCandleOptions && isCupCakeCandle;
  const candleScentedPrice = selectedProduct ? resolveCandleScentedCharge(selectedProduct.id) : 0;

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((item) => {
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
          return item.subCategory === activeStickerSubCategory;
        }

        return true;
      }),
    [activeCategory, activeStickerSubCategory]
  );
  const selectedColorOptions = useMemo(() => {
    if (!selectedProduct || selectedProduct.category !== 'candles' || !hasCandleOptions) {
      return [];
    }

    if (isCupCakeCandle) {
      return CUP_CAKE_CANDLE_DESIGNS;
    }

    if (selectedProduct.colors && selectedProduct.colors.length > 0) {
      return selectedProduct.colors;
    }

    return DEFAULT_COLORS_BY_CATEGORY[selectedProduct.category];
  }, [hasCandleOptions, isCupCakeCandle, selectedProduct, showColorOption]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    if (selectedProduct.category !== 'candles' || !hasCandleOptions) {
      if (order.selectedColor) {
        dispatch(setSelectedColor(''));
      }
      if (order.candleScented) {
        dispatch(setCandleScented(false));
      }
      return;
    }

    if (!showColorOption && !showCupCakeDesignOption) {
      if (order.selectedColor) {
        dispatch(setSelectedColor(''));
      }
      return;
    }

    if (!order.selectedColor || !selectedColorOptions.includes(order.selectedColor)) {
      dispatch(setSelectedColor(isCupCakeCandle ? DEFAULT_CUP_CAKE_CANDLE_DESIGN : selectedColorOptions[0]));
    }
  }, [
    dispatch,
    isCupCakeCandle,
    order.candleScented,
    order.selectedColor,
    selectedColorOptions,
    selectedProduct,
    hasCandleOptions,
    showColorOption,
    showCupCakeDesignOption
  ]);

  useEffect(() => {
    const preloadLimit = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches ? 6 : 12;
    filteredProducts.slice(0, preloadLimit).forEach((product) => {
      const images = product.images && product.images.length > 0 ? product.images : [product.image];
      images.slice(0, 2).forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }, [filteredProducts]);

  useEffect(() => {
    if (!hasMountedProductScrollRef.current) {
      hasMountedProductScrollRef.current = true;
      return;
    }
    if (!order.productId || typeof window === 'undefined') {
      return;
    }
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) {
      return;
    }
    window.requestAnimationFrame(() => {
      buttonAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [order.productId]);

  const handleProductSelect = (id: string) => {
    dispatch(setProduct(id));
  };

  const shouldUseDesignStep = (product: Product | null) => {
    if (!product) {
      return false;
    }
    return product.category === 'tumblers' || product.category === 'mugs';
  };

  const handleNext = () => {
    if (!selectedProduct) {
      return;
    }

    if (shouldUseDesignStep(selectedProduct)) {
      navigate('/design');
      return;
    }

    const selectedColor =
      hasCandleOptions && (showColorOption || showCupCakeDesignOption)
        ? order.selectedColor || (isCupCakeCandle ? DEFAULT_CUP_CAKE_CANDLE_DESIGN : DEFAULT_COLORS_BY_CATEGORY.candles[0])
        : '';

    dispatch(
      addToCart({
        productId: selectedProduct.id,
        quantity: order.quantity,
        selectedColor,
        candleScented: hasCandleOptions ? order.candleScented : false,
        candleNote: isDaisyBouquetCandle ? order.candleNote : '',
        selectedStickerId: null,
        personalizedNote: ''
      })
    );
    navigate('/preview');
  };

  return (
    <Layout currentStep={1}>
      <div className="space-y-8">
        <section className="rounded-2xl border border-lavender-200/80 bg-white/85 p-4 text-sm text-lavender-800">
          <p>
            Follow us on Instagram for latest designs:{' '}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-lavender-700 underline decoration-lavender-300 underline-offset-2 hover:text-lavender-900"
            >
              @dreamycloudsbydaisy
            </a>
          </p>
        </section>

        <section className="space-y-3.5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-lavender-700">
            Order Step -1: click to select the product
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === activeCategory;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(tab.key);
                    if (tab.key === 'stickers') {
                      setActiveStickerSubCategory(
                        selectedProduct?.category === 'stickers' && isStickerSubCategory(selectedProduct.subCategory)
                          ? selectedProduct.subCategory
                          : 'full-wrap'
                      );
                    }
                  }}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-lavender-600 bg-gradient-to-r from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-300/50'
                      : 'border-lavender-300 bg-white text-lavender-700 hover:border-lavender-500 hover:bg-lavender-50'
                  }`}
                >
                  {tab.label}
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

          <div className="flex items-center justify-between">
            <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">
              {activeCategory === 'stickers'
                  ? STICKER_SUBCATEGORY_TABS.find((tab) => tab.key === activeStickerSubCategory)?.label
                : CATEGORY_TABS.find((tab) => tab.key === activeCategory)?.label}
            </h2>
            <span className="rounded-full bg-lavender-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-lavender-700">
              {filteredProducts.length} options
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={order.productId === product.id}
                onSelect={handleProductSelect}
                onPreview={(item) => setPreviewProduct(item)}
              />
            ))}
          </div>
        </section>

        {showCandleOptions ? (
          <section className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <h3 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Candle Options</h3>
            {showColorOption || showCupCakeDesignOption ? (
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-lavender-800">
                  {showCupCakeDesignOption ? 'Select Design' : 'Color'}
                </span>
                <select
                  className="input"
                  value={order.selectedColor}
                  onChange={(event) => dispatch(setSelectedColor(event.target.value))}
                >
                  {selectedColorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="flex items-center gap-3 rounded-2xl border border-lavender-200/80 bg-white p-4">
              <input
                type="checkbox"
                checked={order.candleScented}
                onChange={(event) => dispatch(setCandleScented(event.target.checked))}
                className="h-4 w-4 accent-lavender-600"
              />
              <span className="text-sm font-medium text-lavender-800">
                Scented (+ INR {candleScentedPrice} per item)
              </span>
            </label>

            {isDaisyBouquetCandle ? (
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-lavender-800">Short Note (optional)</span>
                <textarea
                  className="input min-h-20 resize-y"
                  maxLength={80}
                  value={order.candleNote}
                  onChange={(event) => dispatch(setCandleNote(event.target.value))}
                  placeholder="Add a short note for the candle"
                />
                <p className="text-xs text-lavender-600">Adds INR 10 if you enter a note.</p>
              </label>
            ) : null}
          </section>
        ) : null}

        <div ref={buttonAreaRef} className="flex justify-end">
          <div className="flex flex-col items-end gap-1.5">
            <p className="text-right text-xs text-lavender-600">
              Select a product card to proceed.
            </p>
            <button
              className="btn-primary"
              type="button"
              disabled={!selectedProduct}
              onClick={handleNext}
            >
              {selectedProduct && shouldUseDesignStep(selectedProduct) ? 'Next: Select Design' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {selectedProduct ? (
          <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
            <button className="btn-primary w-full" type="button" onClick={handleNext}>
              {shouldUseDesignStep(selectedProduct) ? 'Next: Select Design' : 'Add to Cart'}
            </button>
          </div>
        ) : null}
      </div>

      <ProductPreviewModal product={previewProduct} open={!!previewProduct} onClose={() => setPreviewProduct(null)} />
    </Layout>
  );
};
