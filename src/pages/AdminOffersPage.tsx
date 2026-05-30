import { useCallback, useEffect, useState } from 'react';
import { AdminAccessGate } from '../components/AdminAccessGate';
import {
  fetchAllOffersFromApi,
  Offer,
  updateOfferVisibilityInApi
} from '../features/offers/offersApi';
import { loadScreamOfferVisibility } from '../utils/tumblerScreamOffer';

const formatCreatedAt = (value?: string): string => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

export const AdminOffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadOffers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await fetchAllOffersFromApi();
      setOffers(rows);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load offers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOffers();
  }, [loadOffers]);

  const handleToggleVisibility = async (offer: Offer) => {
    const nextVisible = !offer.isOfferVisible;
    setUpdatingId(offer.id);
    setStatusMessage('');
    setError('');

    try {
      const updated = await updateOfferVisibilityInApi(offer.id, nextVisible);
      setOffers((current) => current.map((row) => (row.id === updated.id ? updated : row)));
      await loadScreamOfferVisibility();
      setStatusMessage(
        `${updated.offer_name} is now ${updated.isOfferVisible ? 'visible' : 'hidden'} on the storefront.`
      );
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update offer visibility.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminAccessGate
      title="Offers"
      description="Control which promotional offers appear on the storefront. Toggle visibility to show or hide each offer instantly."
    >
      <div className="space-y-4">
        {statusMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {statusMessage}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {error}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-lavender-200/80 bg-white/90 p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-['Sora'] text-xl font-bold text-lavender-950">All offers</h2>
              <p className="mt-1 text-sm text-lavender-700">
                {offers.length} offer{offers.length === 1 ? '' : 's'} in the catalog
              </p>
            </div>
            <button type="button" className="btn-secondary" onClick={() => void loadOffers()} disabled={loading}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-lavender-600">Loading offers…</p>
          ) : offers.length === 0 ? (
            <p className="mt-6 text-sm text-lavender-600">No offers found in the offers table.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {offers.map((offer) => {
                const isUpdating = updatingId === offer.id;
                return (
                  <div
                    key={offer.id}
                    className="flex flex-col gap-4 rounded-2xl border border-lavender-200/80 bg-gradient-to-r from-white to-lavender-50/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-['Sora'] text-lg font-bold text-lavender-950">{offer.offer_name}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                            offer.isOfferVisible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {offer.isOfferVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-lavender-600">Created {formatCreatedAt(offer.created_at)}</p>
                    </div>

                    <button
                      type="button"
                      className={`min-w-[9.5rem] px-4 py-2 text-sm ${
                        offer.isOfferVisible ? 'btn-secondary' : 'btn-primary'
                      }`}
                      disabled={isUpdating}
                      onClick={() => void handleToggleVisibility(offer)}
                    >
                      {isUpdating ? 'Updating…' : offer.isOfferVisible ? 'Hide offer' : 'Show offer'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminAccessGate>
  );
};
