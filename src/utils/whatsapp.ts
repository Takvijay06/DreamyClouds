import { Pricing, Product, Design, CustomerDetails } from '../features/order/orderTypes';

interface WhatsAppPayload {
  product: Product;
  design: Design;
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
  quantity,
  giftWrap,
  personalizedNote,
  customerDetails,
  pricing,
  upiId
}: WhatsAppPayload): string => {
  return [
    '*New Order Request - DreamyClouds*',
    '',
    `Product: ${product.name}`,
    `Design: ${design.name}`,
    `Quantity: ${quantity}`,
    `Gift Wrap: ${giftWrap ? 'Yes' : 'No'}`,
    `Personalized Note: ${personalizedNote.trim() || 'N/A'}`,
    '',
    '*Pricing*',
    `Unit Price: INR ${pricing.unitPrice}`,
    `Items Total: INR ${pricing.quantityTotal}`,
    `Gift Wrap Charge: INR ${pricing.giftWrapCharge}`,
    `Delivery Charge: INR ${pricing.deliveryCharge}`,
    `Grand Total: INR ${pricing.grandTotal}`,
    '',
    '*Customer Details*',
    `Name: ${customerDetails.fullName}`,
    `Address: ${customerDetails.address}`,
    `Contact Number: ${customerDetails.contactNumber}`,
    `Alternative Number: ${customerDetails.alternateNumber || 'N/A'}`,
    `Email: ${customerDetails.email}`,
    '',
    '*Payment Instructions*',
    `Please pay via UPI to: ${upiId}`,
    'After payment, share screenshot for manual verification.'
  ].join('\n');
};

export const buildWhatsAppUrl = (businessNumber: string, message: string): string => {
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
};
