import { Link } from 'react-router-dom';
import { AdminAccessGate } from '../components/AdminAccessGate';

export const AdminDashboardPage = () => {
  return (
    <AdminAccessGate
      title="Admin Dashboard"
      description="Choose the catalog area you want to manage. Each page keeps the same visual language as the storefront while swapping customer actions for preview and update tools."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/admin/products"
          className="rounded-[2rem] border border-lavender-200/80 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:border-lavender-400"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lavender-500">Catalog</p>
          <h2 className="mt-2 font-['Sora'] text-2xl font-bold text-lavender-950">Products</h2>
          <p className="mt-3 text-sm text-lavender-700">
            Browse products in the same category-driven layout as the storefront and use `Preview` and `Update` actions on each card.
          </p>
          <span className="mt-5 inline-flex rounded-2xl bg-lavender-100 px-4 py-2 text-sm font-semibold text-lavender-800">
            Open product manager
          </span>
        </Link>

        <Link
          to="/admin/designs"
          className="rounded-[2rem] border border-lavender-200/80 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:border-lavender-400"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lavender-500">Creative</p>
          <h2 className="mt-2 font-['Sora'] text-2xl font-bold text-lavender-950">Designs</h2>
          <p className="mt-3 text-sm text-lavender-700">
            Review designs in storefront-style groups, preview them at full size, and update live design records without leaving the app.
          </p>
          <span className="mt-5 inline-flex rounded-2xl bg-lavender-100 px-4 py-2 text-sm font-semibold text-lavender-800">
            Open design manager
          </span>
        </Link>
      </div>
    </AdminAccessGate>
  );
};
