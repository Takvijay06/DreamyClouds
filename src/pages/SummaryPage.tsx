import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { FormInput } from '../components/FormInput';
import { Layout } from '../components/Layout';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { clearOrder, clearPersistedOrder, setCustomerDetails } from '../features/order/orderSlice';
import { selectOrder, selectPricing, selectSelectedDesign, selectSelectedProduct } from '../features/order/selectors';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp';

const BUSINESS_WHATSAPP_NUMBER = '6350422134';
const BUSINESS_UPI_ID = 'dreamyclouds@upi';
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const SummaryPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const design = useAppSelector(selectSelectedDesign);
  const pricing = useAppSelector(selectPricing);
  const isBookmarkProduct = product?.category === 'bookmarks';

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    contactNumber: '',
    alternateNumber: '',
    email: ''
  });

  useEffect(() => {
    if (!product) {
      navigate('/');
      return;
    }

    if (!isBookmarkProduct && !design) {
      navigate('/design');
    }
  }, [product, design, isBookmarkProduct, navigate]);

  const canSubmit = useMemo(() => {
    const details = order.customerDetails;
    const hasRequiredFields = !!(
      details.fullName.trim() &&
      details.address.trim() &&
      details.contactNumber.trim() &&
      details.email.trim()
    );
    const hasValidContact = INDIAN_MOBILE_REGEX.test(details.contactNumber);
    const hasValidAlt =
      !details.alternateNumber.trim() || INDIAN_MOBILE_REGEX.test(details.alternateNumber);
    const hasValidEmail = EMAIL_REGEX.test(details.email.trim());

    return hasRequiredFields && hasValidContact && hasValidAlt && hasValidEmail;
  }, [order.customerDetails]);

  if (!product || (!isBookmarkProduct && !design)) {
    return null;
  }

  const toAbsoluteAssetUrl = (assetPath: string): string => {
    if (/^https?:\/\//i.test(assetPath)) {
      return assetPath;
    }

    return `${window.location.origin}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const details = order.customerDetails;
    const nextFieldErrors = {
      contactNumber: '',
      alternateNumber: '',
      email: ''
    };

    if (!details.fullName || !details.address || !details.contactNumber || !details.email) {
      setError('Please fill all required fields before proceeding.');
      return;
    }
    if (!INDIAN_MOBILE_REGEX.test(details.contactNumber)) {
      nextFieldErrors.contactNumber = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (details.alternateNumber && !INDIAN_MOBILE_REGEX.test(details.alternateNumber)) {
      nextFieldErrors.alternateNumber = 'Alternative number must be a valid 10-digit Indian number.';
    }
    if (!EMAIL_REGEX.test(details.email.trim())) {
      nextFieldErrors.email = 'Enter a valid email address.';
    }

    setFieldErrors(nextFieldErrors);
    if (nextFieldErrors.contactNumber || nextFieldErrors.alternateNumber || nextFieldErrors.email) {
      setError('Please correct highlighted fields before proceeding.');
      return;
    }

    const message = buildWhatsAppMessage({
      product,
      design,
      productImageUrl: toAbsoluteAssetUrl(product.image),
      designImageUrl: design ? toAbsoluteAssetUrl(design.image) : undefined,
      quantity: order.quantity,
      giftWrap: order.giftWrap,
      personalizedNote: order.personalizedNote,
      customerDetails: details,
      pricing,
      upiId: BUSINESS_UPI_ID
    });

    const url = buildWhatsAppUrl(BUSINESS_WHATSAPP_NUMBER, message);
    clearPersistedOrder();
    dispatch(clearOrder());
    window.location.href = url;
  };

  return (
    <Layout currentStep={4} crossedSteps={isBookmarkProduct ? [2] : undefined}>
      <form className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]" onSubmit={handleSubmit}>
        <section className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/75 p-4 sm:p-5">
          <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">Customer Details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormInput
              label="Full Name"
              required
              value={order.customerDetails.fullName}
              onChange={(fullName) => dispatch(setCustomerDetails({ ...order.customerDetails, fullName }))}
              placeholder="Enter full name"
            />

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-lavender-800">Contact Number *</span>
              <div className="flex items-center overflow-hidden rounded-2xl border border-lavender-200 bg-white/95">
                <span className="border-r border-lavender-200 bg-lavender-50 px-3 py-2.5 text-sm font-semibold text-lavender-700">
                  +91
                </span>
                <input
                  className="w-full px-3.5 py-2.5 text-sm text-lavender-900 outline-none placeholder:text-lavender-400"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={order.customerDetails.contactNumber}
                  onChange={(event) => {
                    const normalized = event.target.value.replace(/\D/g, '').slice(0, 10);
                    setFieldErrors((prev) => ({ ...prev, contactNumber: '' }));
                    dispatch(setCustomerDetails({ ...order.customerDetails, contactNumber: normalized }));
                  }}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
              {fieldErrors.contactNumber ? (
                <p className="text-xs font-medium text-red-600">{fieldErrors.contactNumber}</p>
              ) : null}
            </label>

            <div className="sm:col-span-2">
              <FormInput
                label="Address"
                required
                value={order.customerDetails.address}
                onChange={(address) => dispatch(setCustomerDetails({ ...order.customerDetails, address }))}
                placeholder="Complete shipping address"
              />
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-lavender-800">Alternative Number</span>
              <div className="flex items-center overflow-hidden rounded-2xl border border-lavender-200 bg-white/95">
                <span className="border-r border-lavender-200 bg-lavender-50 px-3 py-2.5 text-sm font-semibold text-lavender-700">
                  +91
                </span>
                <input
                  className="w-full px-3.5 py-2.5 text-sm text-lavender-900 outline-none placeholder:text-lavender-400"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={order.customerDetails.alternateNumber}
                  onChange={(event) => {
                    const normalized = event.target.value.replace(/\D/g, '').slice(0, 10);
                    setFieldErrors((prev) => ({ ...prev, alternateNumber: '' }));
                    dispatch(setCustomerDetails({ ...order.customerDetails, alternateNumber: normalized }));
                  }}
                  placeholder="Optional"
                />
              </div>
              {fieldErrors.alternateNumber ? (
                <p className="text-xs font-medium text-red-600">{fieldErrors.alternateNumber}</p>
              ) : null}
            </label>

            <FormInput
              label="Email Address"
              required
              type="email"
              value={order.customerDetails.email}
              onChange={(email) => {
                setFieldErrors((prev) => ({ ...prev, email: '' }));
                dispatch(setCustomerDetails({ ...order.customerDetails, email }));
              }}
              placeholder="name@example.com"
            />
            {fieldErrors.email ? <p className="text-xs font-medium text-red-600 sm:col-span-2">{fieldErrors.email}</p> : null}
          </div>

          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

          <div className="rounded-2xl border border-lavender-200/80 bg-gradient-to-r from-lavender-50 to-white p-4 text-sm text-lavender-800">
            <p className="font-bold text-lavender-900">Manual Payment Flow</p>
            <p className="mt-1">
              Transfer payment using UPI ID: <span className="font-semibold">{BUSINESS_UPI_ID}</span>
            </p>
            <p className="mt-1">After payment, share screenshot in WhatsApp for manual verification.</p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-lavender-200/80 bg-white p-4 text-sm sm:p-5">
            <h3 className="font-['Sora'] text-base font-bold text-lavender-900">Order Snapshot</h3>
            <p className="mt-2 text-lavender-700">
              Product: <span className="font-semibold text-lavender-900">{product.name}</span>
            </p>
            <p className="text-lavender-700">
              Design: <span className="font-semibold text-lavender-900">{design?.name ?? 'Not required for bookmarks'}</span>
            </p>
            <p className="text-lavender-700">
              Quantity: <span className="font-semibold text-lavender-900">{order.quantity}</span>
            </p>
            <p className="text-lavender-700">
              Gift Wrap: <span className="font-semibold text-lavender-900">{order.giftWrap ? 'Yes' : 'No'}</span>
            </p>
            <p className="text-lavender-700">
              Note: <span className="font-semibold text-lavender-900">{order.personalizedNote.trim() || 'N/A'}</span>
            </p>
            <p className="text-lavender-700">
              Contact: <span className="font-semibold text-lavender-900">+91 {order.customerDetails.contactNumber || '—'}</span>
            </p>
          </div>

          <PriceBreakdown pricing={pricing} quantity={order.quantity} />

          <div className="flex justify-between gap-3">
            <button className="btn-secondary" type="button" onClick={() => navigate('/preview')}>
              Back
            </button>
            <button className="btn-primary" type="submit" disabled={!canSubmit}>
              Proceed to Buy (WhatsApp)
            </button>
          </div>
        </section>
      </form>
    </Layout>
  );
};
