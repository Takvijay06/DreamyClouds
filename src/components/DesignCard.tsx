import { Design } from '../features/order/orderTypes';

interface DesignCardProps {
  design: Design;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview?: (design: Design) => void;
}

export const DesignCard = ({ design, selected, onSelect, onPreview }: DesignCardProps) => {
  const isSoldOut = design.availableQuantity === 0;

  const handleSelect = () => {
    if (isSoldOut) {
      return;
    }
    onSelect(design.id);
  };

  return (
    <div
      role="button"
      tabIndex={isSoldOut ? -1 : 0}
      aria-disabled={isSoldOut}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          if (isSoldOut) {
            event.preventDefault();
            return;
          }
          event.preventDefault();
          onSelect(design.id);
        }
      }}
      onClick={handleSelect}
      className={`group overflow-hidden rounded-3xl border text-left transition duration-200 ${
        selected
          ? 'border-lavender-600 bg-lavender-50/70 ring-2 ring-lavender-300'
          : 'border-lavender-200 bg-white hover:-translate-y-1 hover:border-lavender-400 hover:shadow-soft'
      } ${isSoldOut ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      <div className="relative overflow-hidden bg-lavender-50/40">
        <img
          src={design.image}
          alt={design.name}
          className="h-40 w-full object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
          loading="eager"
          decoding="sync"
        />
        {isSoldOut ? (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Sold out
          </span>
        ) : selected ? (
          <span className="absolute right-3 top-3 rounded-full bg-lavender-600 px-2.5 py-1 text-[11px] font-bold text-white">
            Selected
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-['Sora'] text-sm font-semibold text-lavender-900 sm:text-base">{design.name}</h3>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onPreview?.(design);
            }}
            className="btn-secondary px-3 py-2 text-xs"
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};
