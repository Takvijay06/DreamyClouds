import { Product } from '../features/order/orderTypes';
import tumbler1 from './Products/tumblers/tumbler_1.jpeg';
import tumbler2 from './Products/tumblers/tumbler_2.jpeg';
import tumbler3 from './Products/tumblers/tumbler_3.jpeg';
import tumbler4 from './Products/tumblers/tumbler_4.jpeg';
import tumblerBaby from './Products/tumblers/tumbler_baby.jpeg';
import tumblerBaby2 from './Products/tumblers/tumbler_baby2.jpeg';
import tumblerCool from './Products/tumblers/tumbler_cool.jpeg';
import tumblerFlower from './Products/tumblers/tumbler_flower.jpeg';
import tumblerWhite from './Products/tumblers/tumbler_white.jpeg';
import mug1 from './Products/mugs/mug_1.jpeg';
import mug2 from './Products/mugs/mug_2.jpeg';
import mug3 from './Products/mugs/mug_3.jpeg';
import mug4 from './Products/mugs/mug_4.jpeg';
import mug5 from './Products/mugs/mug_5.jpeg';
import mug6 from './Products/mugs/mug_6.jpeg';
import mug7 from './Products/mugs/mug_7.jpeg';
import bookmark1 from './Products/bookmarks/bookmark_1.jpeg';

export const PRODUCTS: Product[] = [
  {
    id: 'tumbler-1',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Tumbler Classic',
    description: 'Premium UV TF-ready steel tumbler.',
    basePrice: 499,
    image: tumbler1,
    images: [tumbler1, tumbler2, tumbler3],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-2',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Tumbler Bloom',
    description: 'Custom printed tumbler with floral-inspired finish.',
    basePrice: 499,
    image: tumbler2,
    images: [tumbler2, tumbler4, tumblerFlower],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-3',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Tumbler Bliss',
    description: 'Durable insulated tumbler for daily use.',
    basePrice: 499,
    image: tumbler3,
    images: [tumbler3, tumblerCool, tumblerWhite],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-4',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Tumbler Spark',
    description: 'Glossy finish tumbler with smooth print area.',
    basePrice: 499,
    image: tumbler4,
    images: [tumbler4, tumbler1, tumblerBaby],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-baby',
    category: 'tumblers',
    subCategory: 'glass-tumbler',
    name: 'Tumbler Baby Theme',
    description: 'Cute-themed tumbler design sample.',
    basePrice: 499,
    image: tumblerBaby,
    images: [tumblerBaby, tumblerBaby2, tumblerFlower],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-baby-2',
    category: 'tumblers',
    subCategory: 'glass-tumbler',
    name: 'Tumbler Baby Theme 2',
    description: 'Soft pastel style tumbler sample for gifting.',
    basePrice: 499,
    image: tumblerBaby2,
    images: [tumblerBaby2, tumblerBaby, tumblerWhite],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-cool',
    category: 'tumblers',
    subCategory: 'glass-tumbler',
    name: 'Tumbler Cool Vibe',
    description: 'Modern look tumbler with clean print space.',
    basePrice: 499,
    image: tumblerCool,
    images: [tumblerCool, tumbler3, tumblerWhite],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-flower',
    category: 'tumblers',
    subCategory: 'glass-tumbler',
    name: 'Tumbler Flower Art',
    description: 'Floral art tumbler sample.',
    basePrice: 499,
    image: tumblerFlower,
    images: [tumblerFlower, tumbler2, tumblerBaby],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'tumbler-white',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Tumbler White Minimal',
    description: 'Minimal white tumbler for vibrant custom prints.',
    basePrice: 499,
    image: tumblerWhite,
    images: [tumblerWhite, tumblerCool, tumbler1],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'mug-1',
    category: 'mugs',
    name: 'Mug Classic',
    description: 'Glossy ceramic mug ready for UV TF printing.',
    basePrice: 299,
    image: mug1,
    images: [mug1, mug2, mug3],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'mug-2',
    category: 'mugs',
    name: 'Mug Pastel',
    description: 'Soft-tone ceramic mug design sample.',
    basePrice: 299,
    image: mug2,
    images: [mug2, mug4, mug5],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'mug-3',
    category: 'mugs',
    name: 'Mug Artwork',
    description: 'Art-themed mug with high-quality print area.',
    basePrice: 299,
    image: mug3,
    images: [mug3, mug1, mug6],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'mug-4',
    category: 'mugs',
    name: 'Mug Soft Bloom',
    description: 'Elegant mug sample with premium finish.',
    basePrice: 299,
    image: mug4,
    images: [mug4, mug2, mug7],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'mug-5',
    category: 'mugs',
    name: 'Mug Dreamy Print',
    description: 'Dream-style mug sample for custom gifts.',
    basePrice: 299,
    image: mug5,
    images: [mug5, mug6, mug4],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'mug-6',
    category: 'mugs',
    name: 'Mug Everyday',
    description: 'Daily-use mug with durable print support.',
    basePrice: 299,
    image: mug6,
    images: [mug6, mug3, mug1],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'mug-7',
    category: 'mugs',
    name: 'Mug Signature',
    description: 'Signature mug style for personalized branding.',
    basePrice: 299,
    image: mug7,
    images: [mug7, mug5, mug2],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'candle-1',
    category: 'candles',
    name: 'Candle Amber Glow',
    description: 'Scented soy candle jar with printable gift tag area.',
    basePrice: 349,
    image: mug4,
    images: [mug4, mug5, mug2],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'candle-2',
    category: 'candles',
    name: 'Candle Vanilla Bloom',
    description: 'Decorative candle option for premium gifting boxes.',
    basePrice: 379,
    image: mug2,
    images: [mug2, mug6, mug4],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'gift-hamper-1',
    category: 'gift-hampers',
    name: 'Gift Hamper Celebration',
    description: 'Curated festive hamper with custom branding inserts.',
    basePrice: 899,
    image: tumbler4,
    images: [tumbler4, tumbler1, mug7],
    overlayClassName: 'left-[24%] top-[30%] h-[34%] w-[48%]'
  },
  {
    id: 'gift-hamper-2',
    category: 'gift-hampers',
    name: 'Gift Hamper Premium',
    description: 'Premium hamper setup with reusable keepsake items.',
    basePrice: 1199,
    image: tumblerWhite,
    images: [tumblerWhite, tumbler3, mug5],
    overlayClassName: 'left-[24%] top-[30%] h-[34%] w-[48%]'
  },
  {
    id: 'accessory-1',
    category: 'accessories',
    name: 'Accessory Keychain Set',
    description: 'Custom keychain pair with high-detail print support.',
    basePrice: 199,
    image: bookmark1,
    images: [bookmark1, mug3, bookmark1],
    overlayClassName: 'left-[34%] top-[24%] h-[52%] w-[30%]'
  },
  {
    id: 'accessory-2',
    category: 'accessories',
    name: 'Accessory Desk Charm',
    description: 'Desktop charm accessory for personalized gifting.',
    basePrice: 249,
    image: mug1,
    images: [mug1, bookmark1, mug6],
    overlayClassName: 'left-[26%] top-[30%] h-[36%] w-[46%]'
  },
  {
    id: 'bookmark-1',
    category: 'bookmarks',
    name: 'Premium Bookmark',
    description: 'Laminated bookmark with vibrant UV TF-ready finish.',
    basePrice: 99,
    image: bookmark1,
    images: [bookmark1, bookmark1, bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  }
];

export const DELIVERY_CHARGE = 70;
export const GIFT_WRAP_CHARGE_PER_ITEM = 25;
export const PERSONALIZED_NAME_CHARGE_PER_LETTER = 10;
