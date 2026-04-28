import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ADMIN_PASSWORD, clearAdminAuthenticated, isAdminAuthenticated, setAdminAuthenticated } from '../features/admin/auth';
import faviconDd from '../data/Logos/favicon_dd.png';
import { FormInput } from './FormInput';

interface AdminAccessGateProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const AdminAccessGate = ({ title, description, children }: AdminAccessGateProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setPasswordError('Incorrect password. Please try again.');
      return;
    }

    setAdminAuthenticated();
    setIsAuthenticated(true);
    setPassword('');
    setPasswordError('');
  };

  const handleLogout = () => {
    clearAdminAuthenticated();
    setIsAuthenticated(false);
    setPassword('');
    setPasswordError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="page-shell">
        <div className="mx-auto max-w-md rounded-[2rem] border border-lavender-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-md sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <img src={faviconDd} alt="Dreamy Clouds By Daisy" className="h-14 w-14 rounded-2xl object-cover shadow-soft" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lavender-500">Protected Area</p>
              <h1 className="mt-1 font-['Sora'] text-2xl font-bold text-lavender-950">{title}</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-lavender-700">{description}</p>

          <form className="mt-6 space-y-4" onSubmit={handleAuthSubmit}>
            <FormInput
              id="admin-password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              error={passwordError}
              placeholder="Enter admin password"
              required
            />
            <button className="btn-primary w-full" type="submit">
              Unlock Admin
            </button>
          </form>

          <Link to="/" className="btn-secondary mt-3 w-full">
            Back to storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-6 rounded-[2rem] border border-lavender-200/80 bg-white/88 p-5 shadow-soft backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lavender-500">Dreamy Clouds Admin</p>
            <h1 className="mt-2 font-['Sora'] text-2xl font-bold text-lavender-950">{title}</h1>
            <p className="mt-2 text-sm text-lavender-700">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="btn-secondary">
              View Storefront
            </Link>
            <button className="btn-secondary" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-lavender-600 bg-gradient-to-r from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-300/50'
                  : 'border-lavender-300 bg-white text-lavender-700 hover:border-lavender-500 hover:bg-lavender-50'
              }`
            }
          >
            Admin Home
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-lavender-600 bg-gradient-to-r from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-300/50'
                  : 'border-lavender-300 bg-white text-lavender-700 hover:border-lavender-500 hover:bg-lavender-50'
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/designs"
            className={({ isActive }) =>
              `rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-lavender-600 bg-gradient-to-r from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-300/50'
                  : 'border-lavender-300 bg-white text-lavender-700 hover:border-lavender-500 hover:bg-lavender-50'
              }`
            }
          >
            Designs
          </NavLink>
        </div>
      </div>

      {children}
    </div>
  );
};
