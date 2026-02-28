import { Pricing, Product, Design, CustomerDetails } from '../features/order/orderTypes';

interface WhatsAppPayload {
  product: Product;
  design: Design | null;
  productImageUrl: string;
  designImageUrl?: string;
  stickerFromGallery: '' | 'yes' | 'no';
  placementPreference: 'design-yourself' | 'decide-by-daisy';
  customDesignImageName: string;
  designCustomerName: string;
  selectedColor: string;
  quantity: number;
  cartItems?: string[];
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
  stickerFromGallery,
  placementPreference,
  customDesignImageName,
  designCustomerName,
  selectedColor,
  quantity,
  cartItems,
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
    `- Color: ${selectedColor || 'N/A'}`,
    `- Design: ${design?.name ?? 'Not selected'}`,
    `- Select Sticker From Gallery: ${stickerFromGallery === 'yes' ? 'Yes' : stickerFromGallery === 'no' ? 'No' : 'N/A'}`,
    `- Sticker Choice: ${design?.name ?? 'N/A'}`,
    `- Placement: ${
      stickerFromGallery === 'yes' ? 'N/A' : placementPreference === 'design-yourself' ? 'Design Yourself' : 'Decide By Daisy'
    }`,
    `- Name: ${designCustomerName.trim() || 'N/A'}`,
    `- Quantity: ${quantity}`,
    `- Gift Wrap: ${giftWrap ? 'Yes' : 'No'}`,
    `- Personalized Name: ${personalizedNote.trim() || 'N/A'}`,
    ...(cartItems && cartItems.length > 0 ? ['', '*Cart Items*', ...cartItems] : []),
    '',
    '*Selected Images*',
    `- Product Image: ${productImageUrl}`,
    `- Design Image: ${designImageUrl ?? 'N/A'}`,
    '',
    '*Pricing*',
    `- Unit Price: INR ${pricing.unitPrice}`,
    `- Items Total: INR ${pricing.quantityTotal}`,
    `- Gift Wrap Charge: INR ${pricing.giftWrapCharge}`,
    `- Personalized Name Charge (${pricing.personalizedNameLetterCount} letters): INR ${pricing.personalizedNameCharge}`,
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
    'After payment, share screenshot for manual verification.',
    '',
    '*Uploaded Image (At Checkout)*',
    `- ${customDesignImageName || 'N/A'}`
  ].join('\n');
};

export const buildWhatsAppUrl = (businessNumber: string, message: string): string => {
  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
};

