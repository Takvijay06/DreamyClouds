import { Pricing } from '../features/order/orderTypes';
import { formatRupee } from '../utils/currency';
import { SCREAM_OFFER_DISCOUNT_PERCENT } from '../utils/tumblerScreamOffer';

interface PriceBreakdownProps {
  pricing: Pricing;
  quantity: number;
}

const Row = ({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) => (
  <div
    className={`flex justify-between gap-4 rounded-xl px-1 py-1.5 transition-colors sm:px-2 ${
      emphasize ? '' : 'hover:bg-white/60'
    }`}
  >
    <span className={`text-lavender-700 ${emphasize ? 'font-semibold text-lavender-800' : ''}`}>{label}</span>
    <span className={`text-right tabular-nums font-semibold text-lavender-900 ${emphasize ? 'text-base' : ''}`}>{value}</span>
  </div>
);

export const PriceBreakdown = ({ pricing, quantity }: PriceBreakdownProps) => {
  return (
    <div className="rounded-3xl border border-lavender-200/80 bg-gradient-to-b from-white via-white to-lavender-50/50 p-4 shadow-md shadow-lavender-200/20 sm:p-5">
      <h3 className="font-['Sora'] text-sm font-bold uppercase tracking-[0.16em] text-lavender-700">Pricing Breakdown</h3>
      <div className="mt-4 space-y-0.5 text-sm">
        <Row label="Quantity" value={String(quantity)} />
        <Row label="Items Total" value={formatRupee(pricing.quantityTotal)} />
        <Row label="Design / Sticker Charge" value={formatRupee(pricing.designCharge)} />
        <Row label="Gift Wrap" value={formatRupee(pricing.giftWrapCharge)} />
        <Row
          label={`Personalized Name (${pricing.personalizedNameLetterCount} letters)`}
          value={formatRupee(pricing.personalizedNameCharge)}
        />
        {pricing.candleScentedCharge > 0 ? (
          <Row label="Candle Scented Add-on" value={formatRupee(pricing.candleScentedCharge)} />
        ) : null}
        {pricing.candleNoteCharge > 0 ? (
          <Row label="Daisy Candle Note" value={formatRupee(pricing.candleNoteCharge)} />
        ) : null}
        <div className="my-2 border-t border-lavender-200/80" />
        <Row label="Subtotal (Excl. Delivery)" value={formatRupee(pricing.subtotalBeforeDiscount)} emphasize />
        {pricing.couponDiscountAmount > 0 ? (
          <div className="flex justify-between gap-4 rounded-xl bg-emerald-50/80 px-2 py-2">
            <span className="font-semibold text-emerald-800">Coupon ({pricing.appliedCouponCode})</span>
            <span className="tabular-nums font-semibold text-emerald-700">- {formatRupee(pricing.couponDiscountAmount)}</span>
          </div>
        ) : null}
        {pricing.screamOfferDiscount > 0 ? (
          <div className="flex justify-between gap-4 rounded-xl bg-sky-50/80 px-2 py-2">
            <span className="font-semibold text-indigo-800">Tumbler Scream Offer ({SCREAM_OFFER_DISCOUNT_PERCENT}%)</span>
            <span className="tabular-nums font-semibold text-indigo-700">- {formatRupee(pricing.screamOfferDiscount)}</span>
          </div>
        ) : null}
        <Row label="Delivery" value={formatRupee(pricing.deliveryCharge)} />
        <div className="mt-4 flex justify-between rounded-2xl bg-gradient-to-r from-lavender-700 to-lavender-500 px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-lavender-400/45 tabular-nums">
          <span>Grand Total</span>
          <span>{formatRupee(pricing.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};
