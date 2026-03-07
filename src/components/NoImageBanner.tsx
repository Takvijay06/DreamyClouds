import { ProductCategory } from '../features/order/orderTypes';

interface NoImageBannerProps {
  category: ProductCategory;
  className?: string;
}

const CATEGORY_THEME: Record<ProductCategory, string> = {
  tumblers: 'from-[#c4b5fd] via-[#e9d5ff] to-[#ddd6fe]',
  mugs: 'from-[#fbcfe8] via-[#f9a8d4] to-[#fce7f3]',
  bookmarks: 'from-[#fde68a] via-[#fef3c7] to-[#fef9c3]',
  candles: 'from-[#fdba74] via-[#fed7aa] to-[#ffedd5]',
  'gift-hampers': 'from-[#86efac] via-[#bbf7d0] to-[#dcfce7]',
  accessories: 'from-[#93c5fd] via-[#bfdbfe] to-[#dbeafe]',
  stickers: 'from-[#f9a8d4] via-[#fbcfe8] to-[#fde2f3]'
};

export const NoImageBanner = ({ category, className = '' }: NoImageBannerProps) => (
  <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${CATEGORY_THEME[category]} ${className}`}>
    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-center shadow-sm backdrop-blur-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-lavender-700">Dreamy Clouds</p>
      <p className="mt-1 text-sm font-bold text-lavender-900">No Image Available</p>
      <p className="text-xs font-medium capitalize text-lavender-700">{category.replace('-', ' ')}</p>
    </div>
  </div>
);
