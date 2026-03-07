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
    id: 'stanley-tri-color-pink',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Tri Color - Pink',
    description: '1200 ml stainless steel Stanley tumbler in tri color.',
    basePrice: 1399,
    availableQuantity: 1,
    image: tumbler1,
    images: [tumbler1, tumbler2, tumbler3],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-tri-color-peach',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Tri Color - Peach',
    description: '1200 ml stainless steel Stanley tumbler in tri color.',
    basePrice: 1399,
    availableQuantity: 1,
    image: tumbler2,
    images: [tumbler2, tumbler1, tumbler4],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-marble-blue',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Marble - Blue',
    description: '1200 ml stainless steel Stanley marble finish tumbler.',
    basePrice: 1199,
    availableQuantity: 2,
    image: tumbler3,
    images: [tumbler3, tumblerWhite, tumblerCool],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-ice-flow-creamy-white',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Ice Flow Flip Straw - Creamy White',
    description: '900 ml leak-proof Stanley with flip straw.',
    basePrice: 1299,
    availableQuantity: 1,
    image: tumblerWhite,
    images: [tumblerWhite, tumbler4, tumbler3],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-ice-flow-purple',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Ice Flow Flip Straw - Purple',
    description: '900 ml leak-proof Stanley with flip straw.',
    basePrice: 1299,
    availableQuantity: 1,
    image: tumblerFlower,
    images: [tumblerFlower, tumblerWhite, tumbler2],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-dashing-black',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Dashing Black',
    description: '1200 ml stainless steel Stanley tumbler.',
    basePrice: 999,
    availableQuantity: 2,
    image: tumblerCool,
    images: [tumblerCool, tumbler4, tumblerWhite],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-hot-pink',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Hot Pink',
    description: '1200 ml stainless steel Stanley tumbler.',
    basePrice: 999,
    availableQuantity: 1,
    image: tumbler4,
    images: [tumbler4, tumbler2, tumbler1],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-army-green',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Army Green',
    description: '1200 ml stainless steel Stanley tumbler.',
    basePrice: 999,
    availableQuantity: 2,
    image: tumblerBaby2,
    images: [tumblerBaby2, tumblerWhite, tumbler3],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-creamy-white',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Creamy White',
    description: '1200 ml stainless steel Stanley tumbler.',
    basePrice: 999,
    availableQuantity: 2,
    image: tumblerWhite,
    images: [tumblerWhite, tumbler3, tumbler1],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'rainbow-tumbler-yellow',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Rainbow Tumbler - Yellow',
    description: '900 ml rainbow tumbler with double drink neo (sip + straw).',
    basePrice: 799,
    availableQuantity: 2,
    image: tumblerBaby,
    images: [tumblerBaby, tumblerBaby2, tumblerFlower],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'coffee-mug-black',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Coffee Mug - Black',
    description: '500 ml stainless steel coffee mug with double drink neo (sip + straw).',
    basePrice: 499,
    availableQuantity: 5,
    image: mug1,
    images: [mug1, mug2, mug3],
    overlayClassName: 'left-[24%] top-[28%] h-[36%] w-[50%]'
  },
  {
    id: 'coffee-mug-blue',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Coffee Mug - Blue',
    description: '500 ml stainless steel coffee mug with double drink neo (sip + straw).',
    basePrice: 499,
    availableQuantity: 1,
    image: mug2,
    images: [mug2, mug1, mug3],
    overlayClassName: 'left-[24%] top-[28%] h-[36%] w-[50%]'
  },
  {
    id: 'candy-tumbler',
    category: 'tumblers',
    subCategory: 'glass-tumbler',
    name: 'Candy Tumbler',
    description: '510 ml customisable glass tumbler with bamboo lid and glass straw.',
    basePrice: 199,
    availableQuantity: null,
    image: tumblerBaby,
    images: [tumblerBaby, tumblerBaby2, tumblerFlower],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'mason-jar',
    category: 'mugs',
    name: 'Mason Jar',
    description: '450 ml customisable mason jar with colorful straw.',
    basePrice: 149,
    availableQuantity: null,
    image: mug7,
    images: [mug7, mug6, mug5],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'bookmark-sunflower',
    category: 'bookmarks',
    name: 'Sunflower',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-dream-catcher',
    category: 'bookmarks',
    name: 'Dream Catcher',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-rainbow',
    category: 'bookmarks',
    name: 'Rainbow',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-lotus',
    category: 'bookmarks',
    name: 'Lotus',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-flower-pattles',
    category: 'bookmarks',
    name: 'Flower Pattles',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-go-with-the-flow',
    category: 'bookmarks',
    name: 'Go with the Flow',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-reading-therapy',
    category: 'bookmarks',
    name: 'Reading Therapy',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-lost-story',
    category: 'bookmarks',
    name: 'Lost Story',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-booked',
    category: 'bookmarks',
    name: 'Booked',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 1,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-better-book',
    category: 'bookmarks',
    name: 'Better Book',
    description: 'Acrylic bookmark with high-quality UV-DTF print and charm.',
    basePrice: 99,
    availableQuantity: 2,
    image: bookmark1,
    images: [bookmark1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'candle-daisy-flower-bouquet',
    category: 'candles',
    name: 'Daisy Flower Bouquet',
    description: 'Single daisy flower bouquet candle.',
    basePrice: 49,
    availableQuantity: null,
    image: mug4,
    images: [mug4, mug5, mug6],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'candle-dreamy-clouds',
    category: 'candles',
    name: 'Dreamy Clouds',
    description: 'Jar candle with clouds.',
    basePrice: 299,
    availableQuantity: null,
    image: mug5,
    images: [mug5, mug4, mug3],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'candle-coffee-candle',
    category: 'candles',
    name: 'Coffee Candle',
    description: 'Cold coffee candle in candy tumbler.',
    basePrice: 499,
    availableQuantity: null,
    image: mug3,
    images: [mug3, mug2, mug1],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'accessory-colorful-straw',
    category: 'accessories',
    name: 'Colorful Straw',
    description: 'Set of 2 colorful reusable straws.',
    basePrice: 49,
    availableQuantity: 10,
    image: tumblerFlower,
    images: [tumblerFlower, tumblerWhite, tumblerBaby2],
    overlayClassName: 'left-[26%] top-[30%] h-[36%] w-[46%]'
  },
  {
    id: 'accessory-steel-combo',
    category: 'accessories',
    name: 'Steel Combo',
    description: 'Steel straw and straw cleaning brush combo.',
    basePrice: 49,
    availableQuantity: 2,
    image: tumblerCool,
    images: [tumblerCool, tumbler3, tumblerWhite],
    overlayClassName: 'left-[26%] top-[30%] h-[36%] w-[46%]'
  }
];

export const DELIVERY_CHARGE = 70;
export const GIFT_WRAP_CHARGE_PER_ITEM = 25;
export const PERSONALIZED_NAME_CHARGE_PER_LETTER = 10;
