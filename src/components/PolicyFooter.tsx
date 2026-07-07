import { Link } from 'react-router-dom';
import { BUSINESS_OWNER_NAME, BUSINESS_REGISTERED_ADDRESS } from '../config/business';
import { POLICIES } from '../constants/policies';

export const PolicyFooter = () => (
  <>
    <section
      aria-label="Our Policy"
      className="mt-8 rounded-2xl border border-lavender-200/70 bg-white/85 px-4 py-5 shadow-soft backdrop-blur-sm sm:px-6 sm:py-6"
    >
      <h2 className="text-center font-['Sora'] text-sm font-bold uppercase tracking-[0.18em] text-lavender-600 sm:text-base">
        Our Policy
      </h2>
      <nav
        aria-label="Policy links"
        className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:gap-x-5 sm:text-sm"
      >
        {POLICIES.map((policy) => (
          <Link
            key={policy.slug}
            to={policy.path}
            className="font-semibold text-lavender-800 underline decoration-lavender-300 underline-offset-2 transition hover:text-lavender-950 hover:decoration-lavender-500"
          >
            {policy.title}
          </Link>
        ))}
      </nav>
    </section>

    <section
      aria-label="Business identity"
      className="mt-4 rounded-2xl border border-lavender-200/70 bg-white/85 px-4 py-4 text-center shadow-soft backdrop-blur-sm sm:px-6 sm:py-5"
    >
      <p className="font-['Sora'] text-sm font-bold text-lavender-900 sm:text-base">{BUSINESS_OWNER_NAME}</p>
      <p className="mt-2 text-xs leading-relaxed text-lavender-700 sm:text-sm">
        Registered address. {BUSINESS_REGISTERED_ADDRESS}
      </p>
    </section>
  </>
);
