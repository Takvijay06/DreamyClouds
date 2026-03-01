import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { FormInput } from '../components/FormInput';
import { Layout } from '../components/Layout';
import { PriceBreakdown } from '../components/PriceBreakdown';
import {
  clearOrder,
  clearPersistedOrder,
  clearCouponCode,
  removeFromCart,
  setCouponCode,
  setCustomerDetails,
  setGiftWrap,
  updateCartItemQuantity
} from '../features/order/orderSlice';
import {
  selectCartTotalQuantity,
  selectCouponEvaluation,
  selectOrder,
  selectPricing,
  selectResolvedCartItems,
  selectSelectedDesign,
  selectSelectedProduct
} from '../features/order/selectors';
import { formatRupee } from '../utils/currency';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp';

const BUSINESS_WHATSAPP_NUMBER = '6350422134';
const BUSINESS_UPI_ID = 'dreamyclouds@upi';
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type ValidationField = 'fullName' | 'address' | 'contactNumber' | 'alternateNumber' | 'email';
type ValidationErrors = Record<ValidationField, string>;

const EMPTY_VALIDATION_ERRORS: ValidationErrors = {
  fullName: '',
  address: '',
  contactNumber: '',
  alternateNumber: '',
  email: ''
};

export const PreviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [couponInput, setCouponInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>(EMPTY_VALIDATION_ERRORS);

  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const cartItems = useAppSelector(selectResolvedCartItems);
  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity);
  const design = useAppSelector(selectSelectedDesign);
  const pricing = useAppSelector(selectPricing);
  const couponEvaluation = useAppSelector(selectCouponEvaluation);
  const isBookmarkProduct = product?.category === 'bookmarks';
  const hasCartItems = cartItems.length > 0;
  const isBookmarkCart = cartItems.length > 0 && cartItems.every((item) => item.product.category === 'bookmarks');
  const displayProduct = product ?? cartItems[0]?.product ?? null;

  useEffect(() => {
    if (!product && !hasCartItems) {
      navigate('/');
    }
  }, [product, hasCartItems, navigate]);

  useEffect(() => {
    setCouponInput(order.couponCode);
  }, [order.couponCode]);

  if (!displayProduct && !hasCartItems) {
    return null;
  }
  if (!displayProduct) {
    return null;
  }

  const canSubmit = useMemo(() => {
    const details = order.customerDetails;
    const hasRequiredFields = !!(
      details.fullName.trim() &&
      details.address.trim() &&
      details.contactNumber.trim() &&
      details.email.trim()
    );
    const hasValidContact = INDIAN_MOBILE_REGEX.test(details.contactNumber);
    const hasValidAlt = !details.alternateNumber.trim() || INDIAN_MOBILE_REGEX.test(details.alternateNumber);
    const hasValidEmail = EMAIL_REGEX.test(details.email.trim());

    return hasRequiredFields && hasValidContact && hasValidAlt && hasValidEmail;
  }, [order.customerDetails]);

  const toAbsoluteAssetUrl = (assetPath: string): string => {
    if (/^https?:\/\//i.test(assetPath)) {
      return assetPath;
    }

    return `${window.location.origin}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`;
  };

  const validateField = (field: ValidationField, details = order.customerDetails): string => {
    if (field === 'fullName') {
      return details.fullName.trim() ? '' : 'Full Name is required.';
    }
    if (field === 'address') {
      return details.address.trim() ? '' : 'Address is required.';
    }
    if (field === 'contactNumber') {
      if (!details.contactNumber.trim()) {
        return 'Contact Number is required.';
      }
      return INDIAN_MOBILE_REGEX.test(details.contactNumber) ? '' : 'Enter a valid 10-digit Indian mobile number.';
    }
    if (field === 'alternateNumber') {
      if (!details.alternateNumber.trim()) {
        return '';
      }
      return INDIAN_MOBILE_REGEX.test(details.alternateNumber) ? '' : 'Alternative Number must be a valid 10-digit Indian number.';
    }
    if (!details.email.trim()) {
      return 'Email Address is required.';
    }
    return EMAIL_REGEX.test(details.email.trim()) ? '' : 'Enter a valid email address.';
  };

  const validateDetails = (): ValidationErrors => ({
    fullName: validateField('fullName'),
    address: validateField('address'),
    contactNumber: validateField('contactNumber'),
    alternateNumber: validateField('alternateNumber'),
    email: validateField('email')
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = order.customerDetails;
    const nextFieldErrors = validateDetails();

    setFieldErrors(nextFieldErrors);
    const hasAnyFieldError = (Object.keys(nextFieldErrors) as ValidationField[]).some((field) => !!nextFieldErrors[field]);
    if (hasAnyFieldError) {
      return;
    }

    const message = buildWhatsAppMessage({
      product: displayProduct,
      design,
      productImageUrl: toAbsoluteAssetUrl(displayProduct.image),
      designImageUrl: design ? toAbsoluteAssetUrl(design.image) : undefined,
      placementStyle: order.placementStyle,
      letDaisyDecide: order.letDaisyDecide,
      customDesignImageName: order.customDesignImageName,
      designCustomerName: order.designCustomerName,
      selectedColor: order.selectedColor,
      quantity: cartTotalQuantity || order.quantity,
      cartItems: cartItems.map(
        (item) => `- ${item.product.name} (${item.selectedColor}) x ${item.quantity} = ${formatRupee(item.lineTotal)}`
      ),
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
    <Layout currentStep={3} crossedSteps={isBookmarkCart || isBookmarkProduct ? [2] : undefined}>
      <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="rounded-3xl border border-lavender-200/80 bg-white p-4 sm:p-5">
            <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">Cart</h2>
            <p className="mt-1 text-xs text-lavender-600 sm:text-sm">Review your selected items and adjust quantities.</p>
          </div>

          {cartItems.length > 0 ? (
            <div className="rounded-3xl border border-lavender-200/80 bg-white p-4 text-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-['Sora'] text-base font-bold text-lavender-900">Cart Items</h3>
                <span className="rounded-full bg-lavender-100 px-2.5 py-1 text-xs font-semibold text-lavender-700">
                  {cartItems.length} items
                </span>
              </div>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-2xl border border-lavender-200 bg-lavender-50/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-lavender-900">{item.product.name}</p>
                      <p className="text-xs text-lavender-700">
                        Color: {item.selectedColor} | Unit: {formatRupee(item.product.basePrice)} | Line: {formatRupee(item.lineTotal)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn-secondary h-9 w-9 p-0 text-lg"
                        onClick={() => dispatch(updateCartItemQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-lavender-900">{item.quantity}</span>
                      <button
                        type="button"
                        className="btn-secondary h-9 w-9 p-0 text-lg"
                        onClick={() => dispatch(updateCartItemQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      >
                        +
                      </button>
                      <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={() => dispatch(removeFromCart(item.id))}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-lavender-200/80 bg-lavender-50/60 p-4">
                <p className="text-sm font-semibold text-lavender-900">Want to add more products?</p>
                <p className="mt-1 text-xs text-lavender-700 sm:text-sm">
                  Continue shopping to add more items to the same cart. Your current cart is preserved.
                </p>
                <button className="btn-secondary mt-3 w-full sm:w-auto" type="button" onClick={() => navigate('/')}>
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-lavender-200/80 bg-white p-4 text-sm text-lavender-700 sm:p-5">
              No items in cart yet.
            </div>
          )}

        </div>

        <div className="space-y-4">
          <section className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/75 p-4 sm:p-5">
            <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">Customer Details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FormInput
                  label="Full Name"
                  required
                  value={order.customerDetails.fullName}
                  onChange={(fullName) => {
                    const nextDetails = { ...order.customerDetails, fullName };
                    setFieldErrors((prev) => ({ ...prev, fullName: validateField('fullName', nextDetails) }));
                    dispatch(setCustomerDetails(nextDetails));
                  }}
                  placeholder="Enter full name"
                />
                {fieldErrors.fullName ? <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.fullName}</p> : null}
              </div>

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
                      const nextDetails = { ...order.customerDetails, contactNumber: normalized };
                      setFieldErrors((prev) => ({ ...prev, contactNumber: validateField('contactNumber', nextDetails) }));
                      dispatch(setCustomerDetails(nextDetails));
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
                  onChange={(address) => {
                    const nextDetails = { ...order.customerDetails, address };
                    setFieldErrors((prev) => ({ ...prev, address: validateField('address', nextDetails) }));
                    dispatch(setCustomerDetails(nextDetails));
                  }}
                  placeholder="Complete shipping address"
                />
                {fieldErrors.address ? <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.address}</p> : null}
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
                      const nextDetails = { ...order.customerDetails, alternateNumber: normalized };
                      setFieldErrors((prev) => ({ ...prev, alternateNumber: validateField('alternateNumber', nextDetails) }));
                      dispatch(setCustomerDetails(nextDetails));
                    }}
                    placeholder="Optional"
                  />
                </div>
                {fieldErrors.alternateNumber ? (
                  <p className="text-xs font-medium text-red-600">{fieldErrors.alternateNumber}</p>
                ) : null}
              </label>

              <div>
                <FormInput
                  label="Email Address"
                  required
                  type="email"
                  value={order.customerDetails.email}
                  onChange={(email) => {
                    const nextDetails = { ...order.customerDetails, email };
                    setFieldErrors((prev) => ({ ...prev, email: validateField('email', nextDetails) }));
                    dispatch(setCustomerDetails(nextDetails));
                  }}
                  placeholder="name@example.com"
                />
                {fieldErrors.email ? <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.email}</p> : null}
              </div>
            </div>

          </section>

          <label className="flex items-center gap-3 rounded-2xl border border-lavender-200/80 bg-white p-4">
            <input
              type="checkbox"
              checked={order.giftWrap}
              onChange={(event) => dispatch(setGiftWrap(event.target.checked))}
              className="h-4 w-4 accent-lavender-600"
            />
            <span className="text-sm font-medium text-lavender-800">Add gift wrapping (INR 25 per item)</span>
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
            {order.couponCode && couponEvaluation.status === 'applied' ? (
              <p className="text-xs font-semibold text-emerald-700">{couponEvaluation.message}</p>
            ) : null}
            {order.couponCode && couponEvaluation.status === 'invalid' ? (
              <p className="text-xs font-semibold text-red-600">{couponEvaluation.message}</p>
            ) : null}
          </div>

          <PriceBreakdown pricing={pricing} quantity={cartTotalQuantity || order.quantity} />

          <div className="rounded-2xl border border-lavender-200/80 bg-gradient-to-r from-lavender-50 to-white p-4 text-sm text-lavender-800">
            <p className="font-bold text-lavender-900">Manual Payment Flow</p>
            <p className="mt-1">
              Transfer payment using UPI ID: <span className="font-semibold">{BUSINESS_UPI_ID}</span>
            </p>
            <p className="mt-1">After payment, share screenshot in WhatsApp for manual verification.</p>
          </div>

          <div className="flex justify-between gap-3">
            <button className="btn-secondary" type="button" onClick={() => navigate(isBookmarkCart || isBookmarkProduct ? '/' : '/design')}>
              Back
            </button>
            <button className="btn-primary" type="submit" disabled={!canSubmit}>
              Proceed to Buy (WhatsApp)
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};
