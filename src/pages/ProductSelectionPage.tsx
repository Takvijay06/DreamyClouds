import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { ProductPreviewModal } from '../components/ProductPreviewModal';
import { PRODUCTS } from '../data/products';
import { setProduct, setQuantity, setSelectedColor } from '../features/order/orderSlice';
import { selectOrder, selectSelectedProduct } from '../features/order/selectors';
import { Product, ProductCategory, TumblerSubCategory } from '../features/order/orderTypes';

const CATEGORY_TABS: Array<{ key: ProductCategory; label: string }> = [
  { key: 'tumblers', label: 'Tumblers' },
  { key: 'mugs', label: 'Mugs' },
  { key: 'bookmarks', label: 'Bookmarks' },
  { key: 'candles', label: 'Candles' },
  { key: 'gift-hampers', label: 'Gift Hampers' },
  { key: 'accessories', label: 'Accessories' }
];

const TUMBLER_SUBCATEGORY_TABS: Array<{ key: TumblerSubCategory; label: string }> = [
  { key: 'steel-tumbler', label: 'Steel Tumbler' },
  { key: 'glass-tumbler', label: 'Glass Tumbler' }
];

const DEFAULT_COLORS_BY_CATEGORY: Record<ProductCategory, string[]> = {
  tumblers: ['White', 'Black', 'Pink', 'Sky Blue'],
  mugs: ['White', 'Matte Black', 'Red', 'Navy Blue'],
  bookmarks: ['Ivory', 'Blush Pink', 'Sage Green', 'Lavender'],
  candles: ['Cream', 'Rose Gold', 'Sand Beige', 'Olive'],
  'gift-hampers': ['Classic Red', 'Royal Blue', 'Emerald', 'Pastel Peach'],
  accessories: ['Silver', 'Gold', 'Rose Gold', 'Black']
};

export const ProductSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(selectedProduct?.category ?? 'tumblers');
  const [activeTumblerSubCategory, setActiveTumblerSubCategory] = useState<TumblerSubCategory>(
    selectedProduct?.category === 'tumblers' && selectedProduct.subCategory ? selectedProduct.subCategory : 'steel-tumbler'
  );
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((item) => {
        if (item.category !== activeCategory) {
          return false;
        }

        if (activeCategory !== 'tumblers') {
          return true;
        }

        return item.subCategory === activeTumblerSubCategory;
      }),
    [activeCategory, activeTumblerSubCategory]
  );
  const isBookmarkProduct = selectedProduct?.category === 'bookmarks';
  const selectedColorOptions = useMemo(() => {
    if (!selectedProduct) {
      return [];
    }

    if (selectedProduct.colors && selectedProduct.colors.length > 0) {
      return selectedProduct.colors;
    }

    return DEFAULT_COLORS_BY_CATEGORY[selectedProduct.category];
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct || selectedColorOptions.length === 0) {
      return;
    }

    if (!order.selectedColor || !selectedColorOptions.includes(order.selectedColor)) {
      dispatch(setSelectedColor(selectedColorOptions[0]));
    }
  }, [dispatch, order.selectedColor, selectedColorOptions, selectedProduct]);

  const handleProductSelect = (id: string) => {
    dispatch(setProduct(id));

    if (typeof window === 'undefined') {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) {
      return;
    }

    window.requestAnimationFrame(() => {
      nextSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  };

  return (
    <Layout currentStep={1}>
      <div className="space-y-8">
        <section className="space-y-3.5">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === activeCategory;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(tab.key);
                    if (tab.key === 'tumblers') {
                      setActiveTumblerSubCategory(
                        selectedProduct?.category === 'tumblers' && selectedProduct.subCategory
                          ? selectedProduct.subCategory
                          : 'steel-tumbler'
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

          {activeCategory === 'tumblers' ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-lavender-600">SUB CATEGORY</p>
              <div className="flex flex-wrap gap-2">
                {TUMBLER_SUBCATEGORY_TABS.map((tab) => {
                  const isActive = tab.key === activeTumblerSubCategory;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTumblerSubCategory(tab.key)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                        isActive
                          ? 'border-lavender-500 bg-lavender-100 text-lavender-800'
                          : 'border-lavender-200 bg-white text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">
              {activeCategory === 'tumblers'
                ? TUMBLER_SUBCATEGORY_TABS.find((tab) => tab.key === activeTumblerSubCategory)?.label
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

        <section className="flex flex-col gap-4 rounded-3xl border border-lavender-200/80 bg-gradient-to-r from-white to-lavender-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="font-['Sora'] text-base font-bold text-lavender-900">How many pieces do you need?</p>
            <p className="text-xs text-lavender-600 sm:text-sm">
              {isBookmarkProduct
                ? 'Bookmarks skip design selection. You will go directly to preview.'
                : 'Adjust quantity before moving to design selection.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="btn-secondary h-11 w-11 p-0 text-xl"
              type="button"
              onClick={() => dispatch(setQuantity(order.quantity - 1))}
            >
              -
            </button>
            <div className="w-14 text-center font-['Sora'] text-2xl font-bold text-lavender-900">{order.quantity}</div>
            <button
              className="btn-secondary h-11 w-11 p-0 text-xl"
              type="button"
              onClick={() => dispatch(setQuantity(order.quantity + 1))}
            >
              +
            </button>
          </div>
        </section>

        {selectedProduct ? (
          <section className="space-y-3 rounded-3xl border border-lavender-200/80 bg-white/85 p-4 sm:p-5">
            <p className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Select Color</p>
            <div className="flex flex-wrap gap-2">
              {selectedColorOptions.map((color) => {
                const isActive = order.selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => dispatch(setSelectedColor(color))}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? 'border-lavender-500 bg-lavender-100 text-lavender-800'
                        : 'border-lavender-200 bg-white text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <div ref={nextSectionRef} className="flex justify-end">
          <button
            className="btn-primary"
            type="button"
            disabled={!selectedProduct}
            onClick={() => navigate(isBookmarkProduct ? '/preview' : '/design')}
          >
            {isBookmarkProduct ? 'Next: Preview' : 'Next: Select Design'}
          </button>
        </div>
      </div>

      <ProductPreviewModal product={previewProduct} open={!!previewProduct} onClose={() => setPreviewProduct(null)} />
    </Layout>
  );
};
