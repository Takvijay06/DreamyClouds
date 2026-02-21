import { Product } from '../features/order/orderTypes';
import { formatRupee } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const ProductCard = ({ product, selected, onSelect }: ProductCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.id)}
      className={`group w-full overflow-hidden rounded-3xl border text-left transition duration-200 ${
        selected
          ? 'border-lavender-600 bg-lavender-50/70 ring-2 ring-lavender-300'
          : 'border-lavender-200 bg-white hover:-translate-y-1 hover:border-lavender-400 hover:shadow-soft'
      }`}
    >
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
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-lavender-800">{formatRupee(product.basePrice)}</p>
          {selected ? (
            <span className="rounded-full bg-lavender-600 px-2.5 py-1 text-[11px] font-bold text-white">Selected</span>
          ) : null}
        </div>
      </div>
    </button>
  );
};
