export type ProductCategory = 'tumblers' | 'mugs' | 'bookmarks';

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  basePrice: number;
  image: string;
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

export interface Pricing {
  unitPrice: number;
  quantityTotal: number;
  giftWrapCharge: number;
  deliveryCharge: number;
  grandTotal: number;
}

export interface OrderState {
  productId: string | null;
  quantity: number;
  designId: string | null;
  giftWrap: boolean;
  personalizedNote: string;
  customerDetails: CustomerDetails;
}
