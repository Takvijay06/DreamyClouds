import { FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Layout } from '../components/Layout';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { setGiftWrap, setPersonalizedNote } from '../features/order/orderSlice';
import { selectOrder, selectPricing, selectSelectedDesign, selectSelectedProduct } from '../features/order/selectors';

export const PreviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const design = useAppSelector(selectSelectedDesign);
  const pricing = useAppSelector(selectPricing);

  useEffect(() => {
    if (!product) {
      navigate('/');
      return;
    }

    if (!design) {
      navigate('/design');
    }
  }, [product, design, navigate]);

  if (!product || !design) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/summary');
  };

  return (
    <Layout currentStep={3}>
      <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-lavender-200/80 bg-white p-2">
            <img src={product.image} alt={product.name} className="h-72 w-full rounded-2xl object-cover" loading="lazy" />
            <img
              src={design.image}
              alt={design.name}
              className={`absolute rounded-lg border-2 border-white/80 object-cover shadow-lg ${product.overlayClassName}`}
            />
            <div className="absolute left-5 top-5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white">
              Live Preview
            </div>
          </div>

          <div className="rounded-3xl border border-lavender-200/80 bg-gradient-to-r from-lavender-50 to-white p-4 text-sm text-lavender-800">
            <p>
              <span className="font-semibold">Product:</span> {product.name}
            </p>
            <p>
              <span className="font-semibold">Design:</span> {design.name}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {order.quantity}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 rounded-2xl border border-lavender-200/80 bg-white p-4">
            <input
              type="checkbox"
              checked={order.giftWrap}
              onChange={(event) => dispatch(setGiftWrap(event.target.checked))}
              className="h-4 w-4 accent-lavender-600"
            />
            <span className="text-sm font-medium text-lavender-800">Add gift wrapping (INR 25 per item)</span>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-lavender-800">Personalized Note (optional)</span>
            <textarea
              className="input min-h-28 resize-y"
              maxLength={160}
              value={order.personalizedNote}
              onChange={(event) => dispatch(setPersonalizedNote(event.target.value))}
              placeholder="Example: Happy Birthday, Aanya!"
            />
          </label>

          <PriceBreakdown pricing={pricing} quantity={order.quantity} />

          <div className="flex justify-between gap-3">
            <button className="btn-secondary" type="button" onClick={() => navigate('/design')}>
              Back
            </button>
            <button className="btn-primary" type="submit">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};
