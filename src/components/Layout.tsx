import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ANALYTICS_EVENTS } from '../constants/analyticsEvents';
import brandLogo from '../data/Logos/Logo_4.jpeg';
import { resetCurrentSelection } from '../features/order/orderSlice';
import { selectCartItemCount } from '../features/order/selectors';
import { trackNamedEvent, trackUserJourneyFunnel } from '../services/analytics';
import { FestivalBanner } from './FestivalBanner';
import { PolicyFooter } from './PolicyFooter';
import { StepProgress } from './StepProgress';
import { TumblerScreamOffer } from './TumblerScreamOffer';

const VIJAY_TAK_PORTFOLIO_URL = 'https://portifilo-page.vercel.app';

interface LayoutProps {
  children: ReactNode;
  currentStep: 1 | 2 | 3;
  crossedSteps?: number[];
}

export const Layout = ({ children, currentStep, crossedSteps }: LayoutProps) => {
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const location = useLocation();
  const isCartPage = location.pathname === '/preview';

  return (
    <main className="page-shell animate-fadeInUp">
      <div className="floating-orb left-[-18px] top-20 h-16 w-16 bg-lavender-200/70" />
      <div className="floating-orb right-6 top-32 h-8 w-8 bg-lavender-300/80" />

      <section className="hero-glow relative overflow-hidden rounded-3xl border border-lavender-200/70 p-5 shadow-soft ring-1 ring-white/50 sm:p-7">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 p-0.5 shadow-md ring-2 ring-lavender-100/90">
                <img src={brandLogo} alt="Dreamy Clouds logo" className="h-full w-full rounded-full object-cover" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-lavender-600">Dreamy Clouds By Daisy</p>
            </div>
            <h1 className="mt-3 font-['Sora'] text-2xl font-extrabold leading-tight tracking-tight text-lavender-900 sm:text-3xl">
              Design it. Preview it. Order in minutes.
            </h1>
            <p className="mt-2 text-sm font-semibold text-lavender-800/95">Customised gifts with Dreamy Touch</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lavender-700 sm:max-w-xl">
              Custom UV TF printed tumblers, mugs, and bookmarks with instant WhatsApp checkout.
            </p>
          </div>

          <div className="mx-auto flex flex-col gap-2 sm:mx-0 sm:items-end">
            <div className="rounded-2xl border border-lavender-200/70 bg-white/90 px-4 py-3 text-center shadow-md shadow-lavender-200/40 ring-1 ring-white/80 backdrop-blur-sm sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lavender-500">Flow</p>
              <p className="mt-0.5 font-['Sora'] text-lg font-bold text-lavender-900">3-step quick order</p>
            </div>
          </div>
        </div>
      </section>

      <FestivalBanner />

      <TumblerScreamOffer />

      <section className="mt-5">
        <StepProgress currentStep={currentStep} crossedSteps={crossedSteps} />
      </section>

      <section
        className={`card card-interactive mt-6 p-4 sm:p-6 ${isCartPage ? 'pb-24 sm:pb-28' : ''}`}
      >
        {children}
      </section>

      <PolicyFooter />

      <footer className="mt-4 rounded-2xl border border-lavender-200/70 bg-white/85 px-4 py-4 text-center text-xs leading-relaxed text-lavender-700 shadow-soft backdrop-blur-sm sm:py-3.5 sm:text-sm">
        © {new Date().getFullYear()} Dreamy Clouds By Daisy. Crafted by{' '}
        <a
          href={VIJAY_TAK_PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-lavender-800 underline decoration-lavender-300 underline-offset-2 transition hover:text-lavender-950 hover:decoration-lavender-500"
        >
          Vijay Tak
        </a>
        .
      </footer>

      <div className="contact-fab" aria-label="Contact">
        <Link
          to="/contact-us"
          className="contact-fab-icon"
          aria-label="Go to Contact Us page"
          onClick={() => {
            trackNamedEvent(ANALYTICS_EVENTS.QUOTE_REQUEST, { cta: 'contact_fab' });
            trackUserJourneyFunnel('contact_us_click', 1);
          }}
        >
          <span aria-hidden="true">{'\u{1F964}'}</span>
        </Link>
        <span className="contact-fab-text">Contact Us</span>
      </div>

      {isCartPage ? (
        <div className="cart-fab" aria-label="Continue shopping">
          <Link
            to="/"
            className="cart-fab-icon"
            aria-label="Continue shopping"
            onClick={() => {
              dispatch(resetCurrentSelection());
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              trackUserJourneyFunnel('continue_shopping', 2);
            }}
          >
            <span aria-hidden="true">{'\u{1F6CD}'}</span>
          </Link>
          <span className="cart-fab-text">Continue Shopping</span>
        </div>
      ) : (
        <div className="cart-fab" aria-label="Cart">
          <Link
            to="/preview"
            className="cart-fab-icon"
            aria-label="Go to cart page"
            onClick={() => trackUserJourneyFunnel('cart_open', 3)}
          >
            <span aria-hidden="true">{'\u{1F6D2}'}</span>
            {cartItemCount > 0 ? <span className="cart-fab-badge">{cartItemCount}</span> : null}
          </Link>
          <span className="cart-fab-text">Cart</span>
        </div>
      )}
    </main>
  );
};
