import { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open || !product) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 bg-lavender-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-lavender-200 bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-lavender-100 bg-white px-4 py-3">
          <h3 className="font-['Sora'] text-base font-bold text-lavender-900">{product.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-lavender-300 bg-white px-3 py-1 text-sm font-semibold text-lavender-700 transition hover:bg-lavender-100"
          >
            Close
          </button>
        </div>

        <div className="overflow-auto bg-lavender-50">
          <img src={product.image} alt={product.name} className="mx-auto max-h-[75vh] w-full object-contain" />
        </div>
      </div>
    </div>,
    document.body
  );
};
