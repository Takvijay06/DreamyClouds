import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DesignCard } from '../components/DesignCard';
import { Layout } from '../components/Layout';
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
  selectSelectedProduct
} from '../features/order/selectors';
import { ProductCategory } from '../features/order/orderTypes';

const DEFAULT_COLORS_BY_CATEGORY: Record<ProductCategory, string[]> = {
  tumblers: ['White', 'Black', 'Pink', 'Sky Blue'],
  mugs: ['White', 'Matte Black', 'Red', 'Navy Blue'],
  bookmarks: ['Ivory', 'Blush Pink', 'Sage Green', 'Lavender'],
  candles: ['Cream', 'Rose Gold', 'Sand Beige', 'Olive'],
  'gift-hampers': ['Classic Red', 'Royal Blue', 'Emerald', 'Pastel Peach'],
  accessories: ['Silver', 'Gold', 'Rose Gold', 'Black']
};

export const DesignSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const filteredDesigns = useAppSelector(selectFilteredDesigns);
  const canAddToCart = !!order.designId && (order.letDaisyDecide || !!order.placementStyle);

  useEffect(() => {
    if (!product) {
      navigate('/');
      return;
    }

    if (product.category === 'bookmarks') {
      navigate('/preview');
    }
  }, [product, navigate]);

  if (!product || product.category === 'bookmarks') {
    return null;
  }

  return (
    <Layout currentStep={2}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-lavender-200/80 bg-lavender-50/80 p-4">
          <p className="text-sm text-lavender-700">
            Selected product: <span className="font-semibold text-lavender-900">{product.name}</span>
          </p>
          <p className="mt-1 text-xs text-lavender-600 sm:text-sm">Pick a design that best matches your style.</p>
        </div>

        <section className="space-y-2 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
          <h2 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Select Design</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {filteredDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              selected={order.designId === design.id}
              onSelect={(id) => dispatch(setDesign(id))}
            />
          ))}
          </div>
        </section>

        {order.designId ? (
          <section className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <h2 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Placement</h2>
            <div className="grid gap-3 sm:grid-cols-2">
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
                <img src={product.image} alt="Full wrap placement" className="h-32 w-full object-contain bg-lavender-50/40 p-2" loading="lazy" />
                <p className="px-3 pb-3 pt-2 text-sm font-semibold text-lavender-800">Full Wrap</p>
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
                <img
                  src={product.image}
                  alt="Random placement"
                  className="h-32 w-full object-cover bg-lavender-50/40 p-2"
                  loading="lazy"
                />
                <p className="px-3 pb-3 pt-2 text-sm font-semibold text-lavender-800">Random Placement</p>
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

        {order.designId ? (
          <section className="space-y-2 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-lavender-800">Personalized Name (optional)</span>
              <textarea
                className="input min-h-20 resize-y"
                maxLength={160}
                value={order.personalizedNote}
                onChange={(event) => dispatch(setPersonalizedNote(event.target.value))}
                placeholder="Example: Aanya"
              />
              <p className="text-xs text-lavender-600">
                One letter costs 10 rupees. Current: {order.personalizedNote.replace(/\s+/g, '').length} letters = INR{' '}
                {order.personalizedNote.replace(/\s+/g, '').length * 10}
              </p>
            </label>
          </section>
        ) : null}

        <div className="flex justify-between gap-3">
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
                  selectedColor
                })
              );
              navigate('/preview');
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
};
