import { Pricing } from '../features/order/orderTypes';
import { formatRupee } from '../utils/currency';

interface PriceBreakdownProps {
  pricing: Pricing;
  quantity: number;
}

export const PriceBreakdown = ({ pricing, quantity }: PriceBreakdownProps) => {
  return (
    <div className="rounded-3xl border border-lavender-200/80 bg-gradient-to-b from-white to-lavender-50 p-4 sm:p-5">
      <h3 className="font-['Sora'] text-sm font-bold uppercase tracking-[0.16em] text-lavender-700">Pricing Breakdown</h3>
      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-lavender-700">Base Price</span>
          <span className="font-semibold text-lavender-900">{formatRupee(pricing.unitPrice)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-lavender-700">Quantity ({quantity})</span>
          <span className="font-semibold text-lavender-900">{formatRupee(pricing.quantityTotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-lavender-700">Gift Wrap</span>
          <span className="font-semibold text-lavender-900">{formatRupee(pricing.giftWrapCharge)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-lavender-700">Personalized Name ({pricing.personalizedNameLetterCount} letters)</span>
          <span className="font-semibold text-lavender-900">{formatRupee(pricing.personalizedNameCharge)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-lavender-100 pt-2">
          <span className="text-lavender-700">Subtotal (Excl. Delivery)</span>
          <span className="font-semibold text-lavender-900">{formatRupee(pricing.subtotalBeforeDiscount)}</span>
        </div>
        {pricing.discountAmount > 0 ? (
          <div className="flex justify-between gap-4">
            <span className="text-emerald-700">Coupon ({pricing.appliedCouponCode})</span>
            <span className="font-semibold text-emerald-700">- {formatRupee(pricing.discountAmount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <span className="text-lavender-700">Delivery</span>
          <span className="font-semibold text-lavender-900">{formatRupee(pricing.deliveryCharge)}</span>
        </div>
        <div className="mt-4 flex justify-between rounded-2xl bg-gradient-to-r from-lavender-700 to-lavender-500 px-4 py-3 text-base font-bold text-white shadow-lg shadow-lavender-300/60">
          <span>Grand Total</span>
          <span>{formatRupee(pricing.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};
