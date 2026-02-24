import { Design } from '../features/order/orderTypes';

interface DesignCardProps {
  design: Design;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const DesignCard = ({ design, selected, onSelect }: DesignCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(design.id)}
      className={`group overflow-hidden rounded-3xl border text-left transition duration-200 ${
        selected
          ? 'border-lavender-600 bg-lavender-50/70 ring-2 ring-lavender-300'
          : 'border-lavender-200 bg-white hover:-translate-y-1 hover:border-lavender-400 hover:shadow-soft'
      }`}
    >
      <div className="relative overflow-hidden bg-lavender-50/40">
        <img
          src={design.image}
          alt={design.name}
          className="h-40 w-full object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {selected ? (
          <span className="absolute right-3 top-3 rounded-full bg-lavender-600 px-2.5 py-1 text-[11px] font-bold text-white">
            Selected
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-['Sora'] text-sm font-semibold text-lavender-900 sm:text-base">{design.name}</h3>
      </div>
    </button>
  );
};
