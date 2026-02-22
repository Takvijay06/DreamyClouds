import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DesignCard } from '../components/DesignCard';
import { Layout } from '../components/Layout';
import { setDesign } from '../features/order/orderSlice';
import {
  selectFilteredDesigns,
  selectOrder,
  selectSelectedDesign,
  selectSelectedProduct
} from '../features/order/selectors';

export const DesignSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const selectedDesign = useAppSelector(selectSelectedDesign);
  const filteredDesigns = useAppSelector(selectFilteredDesigns);

  useEffect(() => {
    if (!product) {
      navigate('/');
      return;
    }

    if (product.category === 'bookmarks') {
      navigate('/preview');
    }
  }, [product, navigate]);

  if (!product || product.category === 'bookmarks') {
    return null;
  }

  return (
    <Layout currentStep={2}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-lavender-200/80 bg-lavender-50/80 p-4">
          <p className="text-sm text-lavender-700">
            Selected product: <span className="font-semibold text-lavender-900">{product.name}</span>
          </p>
          <p className="mt-1 text-xs text-lavender-600 sm:text-sm">Pick a design that best matches your style.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {filteredDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              selected={order.designId === design.id}
              onSelect={(id) => dispatch(setDesign(id))}
            />
          ))}
        </div>

        <div className="flex justify-between gap-3">
          <button className="btn-secondary" type="button" onClick={() => navigate('/')}>
            Back
          </button>
          <button
            className="btn-primary"
            type="button"
            disabled={!selectedDesign}
            onClick={() => navigate('/preview')}
          >
            Next: Preview
          </button>
        </div>
      </div>
    </Layout>
  );
};
