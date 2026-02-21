import { useEffect } from 'react';
import { Product } from '../features/order/orderTypes';

interface ProductPreviewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const ProductPreviewModal = ({ product, open, onClose }: ProductPreviewModalProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || !product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 bg-lavender-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-lavender-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-lavender-100 px-4 py-3">
          <h3 className="font-['Sora'] text-base font-bold text-lavender-900">{product.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-lavender-300 bg-white px-3 py-1 text-sm font-semibold text-lavender-700 transition hover:bg-lavender-100"
          >
            Close
          </button>
        </div>

        <img src={product.image} alt={product.name} className="h-[70vh] w-full object-contain bg-lavender-50" />
      </div>
    </div>
  );
};
