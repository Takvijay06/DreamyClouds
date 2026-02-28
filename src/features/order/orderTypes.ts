export type ProductCategory = 'tumblers' | 'mugs' | 'bookmarks' | 'candles' | 'gift-hampers' | 'accessories';
export type TumblerSubCategory = 'steel-tumbler' | 'glass-tumbler';

export interface Product {
  id: string;
  category: ProductCategory;
  subCategory?: TumblerSubCategory;
  colors?: string[];
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
}

export interface Pricing {
  unitPrice: number;
  quantityTotal: number;
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
  stickerFromGallery: '' | 'yes' | 'no';
  placementPreference: 'design-yourself' | 'decide-by-daisy';
  customDesignImageName: string;
  designCustomerName: string;
  giftWrap: boolean;
  personalizedNote: string;
  customerDetails: CustomerDetails;
}
