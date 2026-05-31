import { Pricing, Product, Design, CustomerDetails } from '../features/order/orderTypes';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/business';

const CUP_CAKE_CANDLE_ID = 'CUP_CAKE_CANDLE';

/** Same canonical URL used by the product preview share / copy-link actions. */
export const buildProductShareUrl = (productId: string): string => {
  const path = `/product/${productId}`;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return path;
};

export const buildArrangeNotifyWhatsAppMessage = (product: Product): string => {
  const shareUrl = buildProductShareUrl(product.id);

  return [
    '*Restock / Arrange Request - Dreamy Clouds By Daisy*',
    '',
    'Hi! This product is sold out on your website. Can you arrange it for me urgently?',
    '',
    `*Product:* ${product.name}`,
    `*Product link:* ${shareUrl}`,
    '',
    'Please let me know if this can be arranged. Thank you!'
  ].join('\n');
};

export const openArrangeNotifyWhatsApp = (product: Product): void => {
  const url = buildWhatsAppUrl(BUSINESS_WHATSAPP_NUMBER, buildArrangeNotifyWhatsAppMessage(product));
  window.open(url, '_blank', 'noopener,noreferrer');
};

interface WhatsAppPayload {
  product: Product;
  design: Design | null;
  placementStyle: '' | 'full-wrap' | 'random-placement';
  letDaisyDecide: boolean;
  designCustomerName: string;
  selectedColor: string;
  candleScented: boolean;
  candleNote: string;
  quantity: number;
  orderDetails?: string[];
  giftWrap: boolean;
  personalizedNote: string;
  customerDetails: CustomerDetails;
  pricing: Pricing;
  upiId: string;
}

export const buildWhatsAppMessage = ({
  product,
  design,
  placementStyle,
  letDaisyDecide,
  designCustomerName,
  selectedColor,
  candleScented,
  candleNote,
  quantity,
  orderDetails,
  giftWrap,
  personalizedNote,
  customerDetails,
  pricing,
  upiId
}: WhatsAppPayload): string => {
  const hasOrderDetails = !!orderDetails && orderDetails.length > 0;
  return [
    '*New Order Request - Dreamy Clouds By Daisy*',
    '',
    ...(hasOrderDetails
      ? ['*Order Details*', ...orderDetails]
      : [
          '*Selected Product Details*',
          `- Product: ${product.name}`,
          ...(product.id === CUP_CAKE_CANDLE_ID ? [`- Design: ${selectedColor || 'HBD with teddy'}`] : []),
          ...(product.category === 'candles' && (product.colors?.length ?? 0) > 0
            ? [`- Color: ${selectedColor || '—'}`]
            : []),
          `- Design: ${design?.name ?? 'Not selected'}`,
          `- Placement: ${
            letDaisyDecide
              ? 'Let Daisy Decide'
              : placementStyle === 'full-wrap'
                ? 'Full Wrap'
                : placementStyle === 'random-placement'
                  ? 'Random Placement'
                  : 'N/A'
          }`,
          ...(product.category === 'candles' ? [`- Scented: ${candleScented ? 'Yes' : 'No'}`] : []),
          ...(product.id === 'candle-daisy-flower-bouquet'
            ? [`- Candle Note: ${candleNote.trim() || 'N/A'}`]
            : []),
          `- Name: ${designCustomerName.trim() || 'N/A'}`,
          `- Quantity: ${quantity}`,
          `- Gift Wrap: ${giftWrap ? 'Yes' : 'No'}`,
          `- Personalized Name: ${personalizedNote.trim() || 'N/A'}`
        ]),
    '',
    '*Total*',
    `- Items Total: INR ${pricing.quantityTotal}`,
    `- Gift Wrap Charge: INR ${pricing.giftWrapCharge}`,
    `- Personalized Name Charge (${pricing.personalizedNameLetterCount} letters): INR ${pricing.personalizedNameCharge}`,
    ...(pricing.candleScentedCharge > 0 ? [`- Candle Scented Charge: INR ${pricing.candleScentedCharge}`] : []),
    ...(pricing.candleNoteCharge > 0 ? [`- Daisy Candle Note Charge: INR ${pricing.candleNoteCharge}`] : []),
    `- Subtotal (Excl. Delivery): INR ${pricing.subtotalBeforeDiscount}`,
    `- Coupon: ${pricing.appliedCouponCode ?? 'N/A'}`,
    `- Coupon Discount: INR ${pricing.couponDiscountAmount}`,
    ...(pricing.screamOfferDiscount > 0 ? [`- Tumbler Scream Offer: INR ${pricing.screamOfferDiscount}`] : []),
    `- Total Discount: INR ${pricing.discountAmount}`,
    `- Delivery Charge: INR ${pricing.deliveryCharge}`,
    `- Grand Total: INR ${pricing.grandTotal}`,
    '',
    '*Customer Details*',
    `- Name: ${customerDetails.fullName}`,
    `- Address: ${customerDetails.address}`,
    `- Contact Number: +91 ${customerDetails.contactNumber}`,
    `- Alternative Number: ${customerDetails.alternateNumber ? `+91 ${customerDetails.alternateNumber}` : 'N/A'}`,
    `- Email: ${customerDetails.email}`,
    '',
    '*Payment Instructions*',
    `- Please pay via UPI to: ${upiId}`,
    `- UPI QR: ${product.qrImage ?? 'N/A'}`,
    `- Note - Cash on Delivery not available at this moment`,
    'After payment, share screenshot for manual verification.',
    `Without Payment screenshot order will not be confirmed.`
  ].join('\n');
};

export const buildWhatsAppUrl = (businessNumber: string, message: string): string => {
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
};
