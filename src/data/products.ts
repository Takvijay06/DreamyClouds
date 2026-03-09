import { Product } from '../features/order/orderTypes';
import img1 from './Products/tumblers/1.jpeg';
import img2 from './Products/tumblers/2.jpeg';
import img3 from './Products/tumblers/3.jpeg';
import img4 from './Products/tumblers/4.jpeg';
import img5 from './Products/tumblers/5.jpeg';
import img6 from './Products/tumblers/6.jpeg';
import img7 from './Products/tumblers/7.jpeg';
import img8 from './Products/tumblers/8.jpeg';
import img9 from './Products/tumblers/9.jpeg';
import img10 from './Products/tumblers/10.jpeg';
import img11 from './Products/tumblers/11.jpeg';
import img11a from './Products/tumblers/11-1.jpeg';
import img11b from './Products/tumblers/11-2.jpeg';
import img12 from './Products/tumblers/12.jpeg';
import img13 from './Products/tumblers/13.jpeg';
import img14 from './Products/tumblers/14.jpeg';

const BASE_PRODUCTS: Product[] = [
  {
    id: 'stanley-tri-color-pink',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Tri Color -Pink',
    description: '1200 ml Stainless Steel Stanley Tubmler in Tri Color',
    basePrice: 1399,
    availableQuantity: 1,
    imageFileNumber: 1,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-tri-color-peach',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Tri Color -Peach',
    description: '1200 ml Stainless Steel Stanley Tubmler in Tri Color',
    basePrice: 1399,
    availableQuantity: 1,
    imageFileNumber: 2,
    image: img2,
    images: [img2],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-marble-blue',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Marble - Blue',
    description: '1200 ml Stainless Steel Stanley Marble Finish Tubmler',
    basePrice: 1199,
    availableQuantity: 2,
    imageFileNumber: 3,
    image: img3,
    images: [img3],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-ice-flow-flip-straw-creamy-white',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Ice Flow Flip Straw - Creamy White',
    description: '900 ml Leak-Proof Stanley with Flip Straw',
    basePrice: 1299,
    availableQuantity: 1,
    imageFileNumber: 4,
    image: img4,
    images: [img4],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-ice-flow-flip-straw-purple',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Ice Flow Flip Straw - Purple',
    description: '900 ml Leak-Proof Stanley with Flip Straw',
    basePrice: 1299,
    availableQuantity: 1,
    imageFileNumber: 5,
    image: img5,
    images: [img5],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-dashing-black',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Dashing Black',
    description: '1200 ml Stainless Steel Stanley Tubmler',
    basePrice: 999,
    availableQuantity: 2,
    imageFileNumber: 6,
    image: img6,
    images: [img6],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-hot-pink',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Hot Pink',
    description: '1200 ml Stainless Steel Stanley Tubmler',
    basePrice: 999,
    availableQuantity: 1,
    imageFileNumber: 7,
    image: img7,
    images: [img7],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-army-green',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Army Green',
    description: '1200 ml Stainless Steel Stanley Tubmler',
    basePrice: 999,
    availableQuantity: 2,
    imageFileNumber: 8,
    image: img8,
    images: [img8],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'stanley-quencher-creamy-white',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Stanley Quencher - Creamy White',
    description: '1200 ml Stainless Steel Stanley Tubmler',
    basePrice: 999,
    availableQuantity: 2,
    imageFileNumber: 9,
    image: img9,
    images: [img9],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'rainbow-tumbler-yellow',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Rainbow Tumbler -Yellow',
    description: '900 ml Rainbow Tumbler with Double Drink Neo (Sip+Straw)',
    basePrice: 799,
    availableQuantity: 2,
    imageFileNumber: 10,
    image: img10,
    images: [img10],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'coffee-mug-black',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Coffee Mug - Black',
    description: '500 ml Stainless Steel Coffee Mug with Double Drink Neo (Sip+Straw)',
    basePrice: 499,
    availableQuantity: 5,
    imageFileNumber: 11,
    image: img11,
    images: [img11, img11a, img11b],
    overlayClassName: 'left-[24%] top-[28%] h-[36%] w-[50%]'
  },
  {
    id: 'coffee-mug-blue',
    category: 'tumblers',
    subCategory: 'steel-tumbler',
    name: 'Coffee Mug - Blue',
    description: '500 ml Stainless Steel Coffee Mug with Double Drink Neo (Sip+Straw)',
    basePrice: 499,
    availableQuantity: 1,
    imageFileNumber: 12,
    image: img12,
    images: [img12],
    overlayClassName: 'left-[24%] top-[28%] h-[36%] w-[50%]'
  },
  {
    id: 'candy-tumbler',
    category: 'tumblers',
    subCategory: 'glass-tumbler',
    name: 'Candy Tumbler',
    description: '510 ml Customisable Glass Tumbler with Bamboo Lid and Glass Straw',
    basePrice: 199,
    availableQuantity: null,
    imageFileNumber: 13,
    image: img13,
    images: [img13],
    overlayClassName: 'left-[28%] top-[27%] h-[38%] w-[44%]'
  },
  {
    id: 'mason-jar',
    category: 'mugs',
    name: 'Mason Jar',
    description: '450 ml Customisable Mason Jar with Colorful Straw',
    basePrice: 149,
    availableQuantity: null,
    imageFileNumber: 14,
    image: img14,
    images: [img14],
    overlayClassName: 'left-[22%] top-[34%] h-[30%] w-[48%]'
  },
  {
    id: 'bookmark-sunflower',
    category: 'bookmarks',
    name: 'Sunflower',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 15,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-dream-catcher',
    category: 'bookmarks',
    name: 'Dream Catcher',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 16,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-rainbow',
    category: 'bookmarks',
    name: 'Rainbow',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 17,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-lotus',
    category: 'bookmarks',
    name: 'Lotus',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 18,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-flower-pattles',
    category: 'bookmarks',
    name: 'Flower Pattles',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 19,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-go-with-the-flow',
    category: 'bookmarks',
    name: 'Go with the Flow',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 20,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-reading-therapy',
    category: 'bookmarks',
    name: 'Reading Therapy',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 21,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-lost-story',
    category: 'bookmarks',
    name: 'Lost Story',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 22,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-booked',
    category: 'bookmarks',
    name: 'Booked',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 1,
    imageFileNumber: 23,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'bookmark-better-book',
    category: 'bookmarks',
    name: 'Better Book',
    description: 'Acrylic Bookmark with High Quality UV-DTF Print and Charm',
    basePrice: 99,
    availableQuantity: 2,
    imageFileNumber: 24,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[38%] top-[18%] h-[62%] w-[24%]'
  },
  {
    id: 'candle-daisy-flower-bouquet',
    category: 'candles',
    name: 'Daisy Flower Bouquet',
    description: 'Single Daisy Flower Bouquet Candle',
    basePrice: 49,
    availableQuantity: null,
    imageFileNumber: 25,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'candle-dreamy-clouds',
    category: 'candles',
    name: 'Dreamy Clouds',
    description: 'Jar Candle with Clouds',
    basePrice: 299,
    availableQuantity: null,
    imageFileNumber: 26,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'candle-coffee-candle',
    category: 'candles',
    name: 'Coffee Candle',
    description: 'Cold Coffee Candle in Candy Tumber',
    basePrice: 499,
    availableQuantity: null,
    imageFileNumber: 27,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[24%] top-[34%] h-[30%] w-[45%]'
  },
  {
    id: 'accessory-colorful-straw',
    category: 'accessories',
    name: 'Colorful Straw',
    description: 'Set of 2',
    basePrice: 49,
    availableQuantity: 10,
    imageFileNumber: 28,
    imageAvailable: false,
    image: img1,
    images: [img1],
    overlayClassName: 'left-[26%] top-[30%] h-[36%] w-[46%]'
  },
  {
    id: 'accessory-steel-combo',
    category: 'accessories',
    name: 'Steel Combo',
    description: 'Steel Straw and Straw Cleaning Brush Combo',
    basePrice: 49,
    availableQuantity: 2,
    imageFileNumber: 29,
    imageAvailable: false,
    image: img6,
    images: [img6],
    overlayClassName: 'left-[26%] top-[30%] h-[36%] w-[46%]'
  }
];

const stickerImage = (subFolder: 'Single' | 'Full Wrap', num: number) =>
  new URL(`./Products/Stickers/${subFolder}/${num}.png`, import.meta.url).href;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SINGLE_STICKERS: Array<{ image: number; name: string }> = [
  { image: 1, name: 'Mor Pankh_1' },
  { image: 2, name: 'Mor Pankh_2' },
  { image: 3, name: 'Girl with Flowers' },
  { image: 4, name: 'Bike- Black' },
  { image: 7, name: 'Goku - Half' },
  { image: 8, name: 'Goku' },
  { image: 9, name: 'Tom and Jerry' },
  { image: 10, name: 'Naruto' },
  { image: 11, name: 'Batman - Kid' },
  { image: 12, name: 'Pink Panther' },
  { image: 13, name: 'Batman - Dark' },
  { image: 14, name: 'Captian America' },
  { image: 15, name: 'Bluee' },
  { image: 16, name: 'Stitch' },
  { image: 17, name: 'Dog Lover' },
  { image: 18, name: 'Pink Crown' },
  { image: 19, name: "Valentine's Day" },
  { image: 20, name: 'Cute Love' },
  { image: 21, name: 'Groot' },
  { image: 22, name: 'Pikachu' },
  { image: 23, name: 'Batman' },
  { image: 24, name: 'Dr. Strange' },
  { image: 25, name: 'Micky Mouse Club House' },
  { image: 26, name: 'Mustang' },
  { image: 27, name: 'Pokemon' },
  { image: 28, name: 'Hunter 350' },
  { image: 29, name: 'Iron Man' },
  { image: 30, name: 'Dead Pool' },
  { image: 31, name: 'Biker' },
  { image: 32, name: 'Spiderman - Half' },
  { image: 33, name: 'Pikachu - Half' },
  { image: 34, name: 'Spiderman' },
  { image: 35, name: 'Flower Bouquet' }
];

const FULL_WRAP_STICKERS: Array<{ image: number; name: string }> = [
  { image: 36, name: 'God is much bigger' },
  { image: 37, name: 'Rainbow' },
  { image: 38, name: 'Clouds' },
  { image: 39, name: 'Shinchen' },
  { image: 40, name: "I'm just a Girl" },
  { image: 41, name: 'Bow - Black' },
  { image: 42, name: 'Be You' },
  { image: 43, name: 'Heart - Big' },
  { image: 44, name: 'Cup of Positivity' },
  { image: 45, name: 'Flowers and Bow' },
  { image: 46, name: 'Duckly' },
  { image: 47, name: 'Cute Teddy Bear' },
  { image: 48, name: 'Ocean' },
  { image: 49, name: 'I am fearfully and Wonderfully Made' },
  { image: 50, name: 'Daisy Flowers - Multi Colour' },
  { image: 51, name: 'Daisy Flowers - White' },
  { image: 52, name: 'Tiny Dropping Hearts' },
  { image: 53, name: 'Cat Lover' },
  { image: 54, name: 'Tulip - Small' },
  { image: 55, name: 'Disco Dancer' },
  { image: 56, name: 'Harry Porter' },
  { image: 57, name: 'Snow - Blue' },
  { image: 58, name: 'Snow - Pink' },
  { image: 59, name: 'Flowers - Purple' },
  { image: 60, name: 'Tulip - Big' },
  { image: 61, name: 'Barbie' },
  { image: 62, name: 'Butterfly Girl' },
  { image: 63, name: 'God fills my Cup' },
  { image: 64, name: 'Bow - Baby Pink' },
  { image: 65, name: 'Tiny Hearts' },
  { image: 66, name: 'Sunflower' }
];

const STICKER_PRODUCTS: Product[] = [
  ...SINGLE_STICKERS.map((item) => ({
    id: `sticker-single-${item.image}-${slugify(item.name)}`,
    category: 'stickers' as const,
    subCategory: 'single' as const,
    name: item.name,
    description: 'Single sticker',
    basePrice: 299,
    availableQuantity: 1,
    imageFileNumber: item.image,
    image: stickerImage('Single', item.image),
    images: [stickerImage('Single', item.image)],
    overlayClassName: 'left-[20%] top-[20%] h-[60%] w-[60%]'
  })),
  ...FULL_WRAP_STICKERS.map((item) => ({
    id: `sticker-full-wrap-${item.image}-${slugify(item.name)}`,
    category: 'stickers' as const,
    subCategory: 'full-wrap' as const,
    name: item.name,
    description: 'Full wrap sticker',
    basePrice: 299,
    availableQuantity: 1,
    imageFileNumber: item.image,
    image: stickerImage('Full Wrap', item.image),
    images: [stickerImage('Full Wrap', item.image)],
    overlayClassName: 'left-[20%] top-[20%] h-[60%] w-[60%]'
  }))
];

export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...STICKER_PRODUCTS];

export const DELIVERY_CHARGE = 70;
export const GIFT_WRAP_CHARGE_PER_ITEM = 25;
export const PERSONALIZED_NAME_CHARGE_PER_LETTER = 10;
