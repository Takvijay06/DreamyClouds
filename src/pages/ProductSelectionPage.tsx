import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { ProductPreviewModal } from '../components/ProductPreviewModal';
import { PRODUCTS } from '../data/products';
import { setProduct, setQuantity } from '../features/order/orderSlice';
import { selectOrder, selectSelectedProduct } from '../features/order/selectors';
import { Product, ProductCategory } from '../features/order/orderTypes';

const CATEGORY_TABS: Array<{ key: ProductCategory; label: string }> = [
  { key: 'tumblers', label: 'Tumblers' },
  { key: 'mugs', label: 'Mugs' },
  { key: 'bookmarks', label: 'Bookmarks' }
];

export const ProductSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(selectedProduct?.category ?? 'tumblers');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(
    () => PRODUCTS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );
  const isBookmarkProduct = selectedProduct?.category === 'bookmarks';

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
                  onClick={() => setActiveCategory(tab.key)}
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

          <div className="flex items-center justify-between">
            <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">
              {CATEGORY_TABS.find((tab) => tab.key === activeCategory)?.label}
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
                onSelect={(id) => dispatch(setProduct(id))}
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

        <div className="flex justify-end">
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
