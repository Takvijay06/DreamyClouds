import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Layout } from '../components/Layout';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { clearCouponCode, setCouponCode, setGiftWrap, setPersonalizedNote } from '../features/order/orderSlice';
import {
  selectCouponEvaluation,
  selectOrder,
  selectPricing,
  selectSelectedDesign,
  selectSelectedProduct
} from '../features/order/selectors';

export const PreviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const design = useAppSelector(selectSelectedDesign);
  const pricing = useAppSelector(selectPricing);
  const couponEvaluation = useAppSelector(selectCouponEvaluation);
  const isBookmarkProduct = product?.category === 'bookmarks';

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  useEffect(() => {
    if (!isLivePreviewOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLivePreviewOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isLivePreviewOpen]);

  useEffect(() => {
    setCouponInput(order.couponCode);
  }, [order.couponCode]);

  if (!product) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/summary');
  };

  return (
    <Layout currentStep={3} crossedSteps={isBookmarkProduct ? [2] : undefined}>
      <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-lavender-200/80 bg-white p-2">
            <img
              src={product.image}
              alt={product.name}
              className="h-72 w-full rounded-2xl bg-lavender-50/40 object-contain p-2"
              loading="lazy"
            />
            {design ? (
              <img
                src={design.image}
                alt={design.name}
                className={`absolute rounded-lg border-2 border-white/80 bg-white/40 object-contain shadow-lg ${product.overlayClassName}`}
              />
            ) : null}
            <button
              type="button"
              onClick={() => setIsLivePreviewOpen(true)}
              className="absolute left-5 top-5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-black/70"
            >
              Live Preview
            </button>
          </div>

          <div className="rounded-3xl border border-lavender-200/80 bg-gradient-to-r from-lavender-50 to-white p-4 text-sm text-lavender-800">
            <p>
              <span className="font-semibold">Product:</span> {product.name}
            </p>
            <p>
              <span className="font-semibold">Color:</span> {order.selectedColor || 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Design:</span> {design?.name ?? 'Not selected'}
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
            <span className="text-sm font-semibold text-lavender-800">Personalized Name (optional)</span>
            <textarea
              className="input min-h-20 resize-y"
              maxLength={160}
              value={order.personalizedNote}
              onChange={(event) => dispatch(setPersonalizedNote(event.target.value))}
              placeholder="Example: Aanya"
            />
            {pricing.personalizedNameLetterCount > 0 ? (
              <p className="text-xs font-medium text-lavender-700">
                Personalized Name charge: INR {pricing.personalizedNameCharge} ({pricing.personalizedNameLetterCount} letters x INR 10)
              </p>
            ) : null}
          </label>

          <div className="space-y-2 rounded-2xl border border-lavender-200/80 bg-white p-3">
            <p className="text-sm font-semibold text-lavender-800">Apply Coupon</p>
            <div className="flex gap-2">
              <input
                className="input"
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                placeholder="Enter code (e.g. FIRST10)"
              />
              <button
                type="button"
                className="btn-secondary px-4 py-2"
                disabled={!couponInput.trim()}
                onClick={() => dispatch(setCouponCode(couponInput))}
              >
                Apply
              </button>
              {order.couponCode ? (
                <button
                  type="button"
                  className="btn-secondary px-4 py-2"
                  onClick={() => {
                    dispatch(clearCouponCode());
                    setCouponInput('');
                  }}
                >
                  Remove
                </button>
              ) : null}
            </div>
            <p className="text-xs text-lavender-600">Use `FIRST10` for 10% off (minimum subtotal INR 1000, delivery excluded).</p>
            {order.couponCode && couponEvaluation.status === 'applied' ? (
              <p className="text-xs font-semibold text-emerald-700">{couponEvaluation.message}</p>
            ) : null}
            {order.couponCode && couponEvaluation.status === 'invalid' ? (
              <p className="text-xs font-semibold text-red-600">{couponEvaluation.message}</p>
            ) : null}
          </div>

          <PriceBreakdown pricing={pricing} quantity={order.quantity} />

          <div className="flex justify-between gap-3">
            <button className="btn-secondary" type="button" onClick={() => navigate(isBookmarkProduct ? '/' : '/design')}>
              Back
            </button>
            <button className="btn-primary" type="submit">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </form>

      {isLivePreviewOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close live preview"
            className="absolute inset-0 bg-lavender-900/55 backdrop-blur-sm"
            onClick={() => setIsLivePreviewOpen(false)}
          />
          <div className="relative z-10 flex h-[90vh] w-full max-w-3xl items-center justify-center overflow-hidden rounded-3xl border border-lavender-200 bg-white p-3 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 z-20 rounded-xl border border-lavender-300 bg-white px-3 py-1 text-sm font-semibold text-lavender-700 transition hover:bg-lavender-100"
              onClick={() => setIsLivePreviewOpen(false)}
            >
              Close
            </button>
            <div className="relative mx-auto flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-lavender-50/45 p-2">
              <img src={product.image} alt={product.name} className="mx-auto max-h-[82vh] w-full object-contain" />
              {design ? (
                <img
                  src={design.image}
                  alt={design.name}
                  className={`absolute rounded-lg border-2 border-white/80 bg-white/40 object-contain shadow-lg ${product.overlayClassName}`}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};
