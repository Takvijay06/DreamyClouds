import { Product } from '../features/order/orderTypes';
import { formatRupee } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (product: Product) => void;
}

export const ProductCard = ({ product, selected, onSelect, onPreview }: ProductCardProps) => {
  return (
    <div
      className={`group w-full overflow-hidden rounded-3xl border text-left transition duration-200 ${
        selected
          ? 'border-lavender-600 bg-lavender-50/70 ring-2 ring-lavender-300'
          : 'border-lavender-200 bg-white hover:-translate-y-1 hover:border-lavender-400 hover:shadow-soft'
      }`}
    >
      <button type="button" onClick={() => onSelect(product.id)} className="w-full text-left">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-lavender-700">
            {product.category}
          </span>
        </div>

        <div className="space-y-2.5 p-4">
          <h3 className="font-['Sora'] text-base font-bold text-lavender-900">{product.name}</h3>
          <p className="text-sm text-lavender-700">{product.description}</p>
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-lavender-100 px-4 pb-4 pt-3">
        <p className="text-base font-bold text-lavender-800">{formatRupee(product.basePrice)}</p>
        <div className="flex items-center gap-2">
          {selected ? (
            <span className="rounded-full bg-lavender-600 px-2.5 py-1 text-[11px] font-bold text-white">Selected</span>
          ) : null}
          <button
            type="button"
            className="rounded-xl border border-lavender-300 bg-white px-3 py-1.5 text-xs font-semibold text-lavender-700 transition hover:bg-lavender-100"
            onClick={() => onPreview(product)}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};
