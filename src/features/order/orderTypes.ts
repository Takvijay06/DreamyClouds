export type ProductCategory = 'tumblers' | 'mugs' | 'bookmarks' | 'candles' | 'gift-hampers' | 'accessories' | 'stickers';
export type TumblerSubCategory = 'steel-tumbler' | 'glass-tumbler';
export type StickerSubCategory = 'full-wrap' | 'single';

export interface Product {
  id: string;
  category: ProductCategory;
  subCategory?: TumblerSubCategory | StickerSubCategory;
  colors?: string[];
  availableQuantity?: number | null;
  imageFileNumber?: number;
  imageAvailable?: boolean;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  overlayClassName: string;
}

export interface Design {
  id: string;
  productCategory: ProductCategory;
  stickerSubCategory?: StickerSubCategory;
  name: string;
  image: string;
}

export interface CustomerDetails {
  fullName: string;
  address: string;
  contactNumber: string;
  alternateNumber: string;
  email: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedStickerId?: string | null;
}

export interface Pricing {
  unitPrice: number;
  quantityTotal: number;
  designCharge: number;
  giftWrapCharge: number;
  personalizedNameLetterCount: number;
  personalizedNameCharge: number;
  subtotalBeforeDiscount: number;
  discountAmount: number;
  totalBeforeDelivery: number;
  appliedCouponCode: string | null;
  deliveryCharge: number;
  grandTotal: number;
}

export interface OrderState {
  productId: string | null;
  selectedColor: string;
  couponCode: string;
  quantity: number;
  cartItems: CartItem[];
  designId: string | null;
  placementStyle: '' | 'full-wrap' | 'random-placement';
  letDaisyDecide: boolean;
  customDesignImageName: string;
  designCustomerName: string;
  giftWrap: boolean;
  personalizedNote: string;
  customerDetails: CustomerDetails;
}
