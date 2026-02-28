import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DesignCard } from '../components/DesignCard';
import { Layout } from '../components/Layout';
import {
  setCustomDesignImageName,
  setDesignCustomerName,
  setDesign,
  setPlacementPreference,
  setStickerFromGallery
} from '../features/order/orderSlice';
import {
  selectFilteredDesigns,
  selectOrder,
  selectSelectedProduct
} from '../features/order/selectors';

export const DesignSelectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const product = useAppSelector(selectSelectedProduct);
  const filteredDesigns = useAppSelector(selectFilteredDesigns);
  const canProceedToPreview =
    (order.stickerFromGallery === 'yes' && !!order.designId) ||
    (order.stickerFromGallery === 'no' &&
      (order.placementPreference === 'decide-by-daisy' ||
        (order.placementPreference === 'design-yourself' && !!order.customDesignImageName)));

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

        <section className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
          <h2 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">Design Options</h2>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-lavender-800">Select Sticker From Gallery</span>
            <select
              className="input"
              value={order.stickerFromGallery}
              onChange={(event) => dispatch(setStickerFromGallery(event.target.value as '' | 'yes' | 'no'))}
            >
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>

          {order.stickerFromGallery === 'no' ? (
            <>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-lavender-800">Select Placement</span>
                <select
                  className="input"
                  value={order.placementPreference}
                  onChange={(event) => dispatch(setPlacementPreference(event.target.value as 'design-yourself' | 'decide-by-daisy'))}
                >
                  <option value="design-yourself">Design Yourself</option>
                  <option value="decide-by-daisy">Decide By Daisy</option>
                </select>
              </label>

              {order.placementPreference === 'design-yourself' ? (
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-lavender-800">Upload Image</span>
                  <input
                    className="input file:mr-3 file:rounded-xl file:border-0 file:bg-lavender-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-lavender-700"
                    type="file"
                    accept="image/*"
                    onChange={(event) => dispatch(setCustomDesignImageName(event.target.files?.[0]?.name ?? ''))}
                  />
                  {order.customDesignImageName ? (
                    <p className="text-xs text-lavender-600">Selected: {order.customDesignImageName}</p>
                  ) : null}
                </label>
              ) : null}

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-lavender-800">Name</span>
                <input
                  className="input"
                  type="text"
                  value={order.designCustomerName}
                  onChange={(event) => dispatch(setDesignCustomerName(event.target.value))}
                  placeholder="Enter your name"
                />
              </label>
            </>
          ) : null}
        </section>

        {order.stickerFromGallery === 'yes' ? (
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
        ) : null}

        <div className="flex justify-between gap-3">
          <button className="btn-secondary" type="button" onClick={() => navigate('/')}>
            Back
          </button>
          <button className="btn-primary" type="button" disabled={!canProceedToPreview} onClick={() => navigate('/preview')}>
            Next: Preview
          </button>
        </div>
      </div>
    </Layout>
  );
};
