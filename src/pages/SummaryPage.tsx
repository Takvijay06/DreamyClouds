import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { FormInput } from '../components/FormInput';
import { Layout } from '../components/Layout';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { clearOrder, clearPersistedOrder, setCustomerDetails } from '../features/order/orderSlice';
import { selectOrder, selectPricing, selectSelectedDesign, selectSelectedProduct } from '../features/order/selectors';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp';

const BUSINESS_WHATSAPP_NUMBER = '919999999999';
const BUSINESS_UPI_ID = 'dreamyclouds@upi';

export const SummaryPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const design = useAppSelector(selectSelectedDesign);
  const pricing = useAppSelector(selectPricing);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!product) {
      navigate('/');
      return;
    }

    if (!design) {
      navigate('/design');
    }
  }, [product, design, navigate]);

  const canSubmit = useMemo(() => {
    const details = order.customerDetails;
    return !!(details.fullName.trim() && details.address.trim() && details.contactNumber.trim() && details.email.trim());
  }, [order.customerDetails]);

  if (!product || !design) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const details = order.customerDetails;
    if (!details.fullName || !details.address || !details.contactNumber || !details.email) {
      setError('Please fill all required fields before proceeding.');
      return;
    }

    const message = buildWhatsAppMessage({
      product,
      design,
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
    <Layout currentStep={4}>
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

            <FormInput
              label="Contact Number"
              required
              type="tel"
              value={order.customerDetails.contactNumber}
              onChange={(contactNumber) => dispatch(setCustomerDetails({ ...order.customerDetails, contactNumber }))}
              placeholder="10-digit mobile number"
            />

            <div className="sm:col-span-2">
              <FormInput
                label="Address"
                required
                value={order.customerDetails.address}
                onChange={(address) => dispatch(setCustomerDetails({ ...order.customerDetails, address }))}
                placeholder="Complete shipping address"
              />
            </div>

            <FormInput
              label="Alternative Number"
              type="tel"
              value={order.customerDetails.alternateNumber}
              onChange={(alternateNumber) => dispatch(setCustomerDetails({ ...order.customerDetails, alternateNumber }))}
              placeholder="Optional"
            />

            <FormInput
              label="Email Address"
              required
              type="email"
              value={order.customerDetails.email}
              onChange={(email) => dispatch(setCustomerDetails({ ...order.customerDetails, email }))}
              placeholder="name@example.com"
            />
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
              Design: <span className="font-semibold text-lavender-900">{design.name}</span>
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
