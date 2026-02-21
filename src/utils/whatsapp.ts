import { Pricing, Product, Design, CustomerDetails } from '../features/order/orderTypes';

interface WhatsAppPayload {
  product: Product;
  design: Design;
  productImageUrl: string;
  designImageUrl: string;
  quantity: number;
  giftWrap: boolean;
  personalizedNote: string;
  customerDetails: CustomerDetails;
  pricing: Pricing;
  upiId: string;
}

export const buildWhatsAppMessage = ({
  product,
  design,
  productImageUrl,
  designImageUrl,
  quantity,
  giftWrap,
  personalizedNote,
  customerDetails,
  pricing,
  upiId
}: WhatsAppPayload): string => {
  return [
    '*New Order Request - Dreamy Clouds By Daisy*',
    '',
    '*Selected Product Details*',
    `- Product: ${product.name}`,
    `- Design: ${design.name}`,
    `- Quantity: ${quantity}`,
    `- Gift Wrap: ${giftWrap ? 'Yes' : 'No'}`,
    `- Personalized Note: ${personalizedNote.trim() || 'N/A'}`,
    '',
    '*Selected Images*',
    `- Product Image: ${productImageUrl}`,
    `- Design Image: ${designImageUrl}`,
    '',
    '*Pricing*',
    `- Unit Price: INR ${pricing.unitPrice}`,
    `- Items Total: INR ${pricing.quantityTotal}`,
    `- Gift Wrap Charge: INR ${pricing.giftWrapCharge}`,
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
