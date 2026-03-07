import { Design } from '../features/order/orderTypes';

const stickerImage = (subFolder: 'Single' | 'Full Wrap', num: number) =>
  new URL(`./Products/Stickers/${subFolder}/${num}.png`, import.meta.url).href;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SINGLE_STICKER_DESIGNS: Array<{ image: number; name: string }> = [
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

const FULL_WRAP_STICKER_DESIGNS: Array<{ image: number; name: string }> = [
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

const STICKER_DESIGNS: Design[] = [
  ...SINGLE_STICKER_DESIGNS.map((item) => ({
    id: `sticker-single-${item.image}-${slugify(item.name)}`,
    productCategory: 'stickers' as const,
    stickerSubCategory: 'single' as const,
    name: item.name,
    image: stickerImage('Single', item.image)
  })),
  ...FULL_WRAP_STICKER_DESIGNS.map((item) => ({
    id: `sticker-full-wrap-${item.image}-${slugify(item.name)}`,
    productCategory: 'stickers' as const,
    stickerSubCategory: 'full-wrap' as const,
    name: item.name,
    image: stickerImage('Full Wrap', item.image)
  }))
];

export const DESIGNS: Design[] = [
  {
    id: 'floral-dream',
    productCategory: 'tumblers',
    name: 'Floral Dream',
    image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cosmic-wave',
    productCategory: 'tumblers',
    name: 'Cosmic Wave',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'minimal-gold',
    productCategory: 'mugs',
    name: 'Minimal Gold',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sunset-brush',
    productCategory: 'mugs',
    name: 'Sunset Brush',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'leaf-pattern',
    productCategory: 'bookmarks',
    name: 'Leaf Pattern',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'moonlit-lines',
    productCategory: 'bookmarks',
    name: 'Moonlit Lines',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'candle-warm-minimal',
    productCategory: 'candles',
    name: 'Warm Minimal',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'candle-festival-bloom',
    productCategory: 'candles',
    name: 'Festival Bloom',
    image: 'https://images.unsplash.com/photo-1608181831718-2501b53fb26c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hamper-gilded-card',
    productCategory: 'gift-hampers',
    name: 'Gilded Card',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hamper-classic-ribbon',
    productCategory: 'gift-hampers',
    name: 'Classic Ribbon',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'accessory-monogram-line',
    productCategory: 'accessories',
    name: 'Monogram Line',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'accessory-pop-art',
    productCategory: 'accessories',
    name: 'Pop Art',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
  },
  ...STICKER_DESIGNS
];
