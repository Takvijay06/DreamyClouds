import { Pricing, Product, Design, CustomerDetails } from '../features/order/orderTypes';

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
          ...(product.id === 'candle-daisy-flower-bouquet' ? [`- Color: ${selectedColor || 'White'}`] : []),
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
          ...(product.id === 'candle-daisy-flower-bouquet'
            ? [`- Scented: ${candleScented ? 'Yes' : 'No'}`, `- Candle Note: ${candleNote.trim() || 'N/A'}`]
            : []),
          `- Name: ${designCustomerName.trim() || 'N/A'}`,
          `- Quantity: ${quantity}`,
          `- Gift Wrap: ${giftWrap ? 'Yes' : 'No'}`,
          `- Personalized Name: ${personalizedNote.trim() || 'N/A'}`
        ]),
    '',
    '*Pricing*',
    `- Unit Price: INR ${pricing.unitPrice}`,
    `- Items Total: INR ${pricing.quantityTotal}`,
    `- Gift Wrap Charge: INR ${pricing.giftWrapCharge}`,
    `- Personalized Name Charge (${pricing.personalizedNameLetterCount} letters): INR ${pricing.personalizedNameCharge}`,
    ...(pricing.candleScentedCharge > 0 ? [`- Candle Scented Charge: INR ${pricing.candleScentedCharge}`] : []),
    ...(pricing.candleNoteCharge > 0 ? [`- Daisy Candle Note Charge: INR ${pricing.candleNoteCharge}`] : []),
    `- Subtotal (Excl. Delivery): INR ${pricing.subtotalBeforeDiscount}`,
    `- Coupon: ${pricing.appliedCouponCode ?? 'N/A'}`,
    `- Discount: INR ${pricing.discountAmount}`,
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
    'After payment, share screenshot for manual verification.'
  ].join('\n');
};

export const buildWhatsAppUrl = (businessNumber: string, message: string): string => {
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
};

