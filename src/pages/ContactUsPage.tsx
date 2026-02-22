import { Link } from 'react-router-dom';
import brandLogo from '../data/Logos/Logo_4.jpeg';

const BUSINESS_WHATSAPP_NUMBER = '6350422134';
const BUSINESS_EMAIL = 'dreamycloudsbydaisy@gmail.com';

export const ContactUsPage = () => {
  const offerings = [
    {
      title: 'Bulk Order Pricing',
      detail: 'Get better rates for high-quantity orders compared to single-piece pricing.'
    },
    {
      title: 'Corporate Gifting',
      detail: 'Customized gifting support for teams, clients, festive giveaways, and events.'
    },
    {
      title: 'Event Stall Setup',
      detail: 'Stall option for marriages, parties, birthdays, and celebration functions.'
    },
    {
      title: 'Planning Assistance',
      detail: 'Help with quantity, budget, design coordination, and delivery timelines.'
    }
  ];

  return (
    <main className="page-shell animate-fadeInUp">
      <div className="floating-orb left-[-18px] top-20 h-16 w-16 bg-lavender-200/70" />
      <div className="floating-orb right-6 top-32 h-8 w-8 bg-lavender-300/80" />
      <div className="floating-orb left-[28%] top-[7.5rem] h-10 w-10 bg-lavender-300/60" />

      <section className="hero-glow relative overflow-hidden rounded-3xl border border-lavender-200/70 p-4 shadow-soft sm:p-7">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-lavender-300/45 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-lavender-200/55 blur-3xl" />

        <div className="relative z-10 grid gap-4 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
          <div className="rounded-2xl border border-white/65 bg-white/65 p-3.5 backdrop-blur-sm sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 p-0.5 shadow-sm ring-1 ring-lavender-200">
                <img src={brandLogo} alt="Dreamy Clouds logo" className="h-full w-full rounded-full object-cover" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-lavender-600">Dreamy Clouds By Daisy</p>
            </div>

            <h1 className="mt-2.5 font-['Sora'] text-xl font-extrabold leading-tight text-lavender-900 sm:mt-3 sm:text-3xl">
              Let us plan your custom order
            </h1>
            <p className="mt-1.5 text-sm text-lavender-700 sm:mt-2 sm:max-w-xl sm:text-base">
              Bulk gifts, event stalls, and personalized product support with fast response.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              <span className="rounded-full border border-lavender-300/80 bg-white px-3 py-1 text-xs font-semibold text-lavender-700">
                Bulk Friendly
              </span>
              <span className="rounded-full border border-lavender-300/80 bg-white px-3 py-1 text-xs font-semibold text-lavender-700">
                Event Ready
              </span>
              <span className="rounded-full border border-lavender-300/80 bg-white px-3 py-1 text-xs font-semibold text-lavender-700">
                Corporate Gifting
              </span>
            </div>
          </div>

          <div className="card p-3.5 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender-500">Quick Contact</p>
            <a
              className="btn-primary mt-2.5 w-full sm:mt-3"
              href={`https://wa.me/91${BUSINESS_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Now
            </a>
            <a className="btn-secondary mt-1.5 w-full sm:mt-2" href={`mailto:${BUSINESS_EMAIL}`}>
              Email Us
            </a>
            <Link to="/" className="btn-primary mt-1.5 w-full gap-2 sm:mt-2">
              <span aria-hidden="true">←</span>
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-4 sm:mt-6">
        <article className="card p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender-500">What We Offer</p>
            <p className="text-xs font-semibold text-lavender-600">Simple, fast, and customizable</p>
          </div>

          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3">
            {offerings.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-lavender-200/80 bg-gradient-to-br from-white to-lavender-50 p-3.5 shadow-[0_10px_20px_-16px_rgba(97,57,171,0.45)] sm:p-4"
              >
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-lavender-600 px-2 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <h2 className="mt-3 font-['Sora'] text-base font-bold text-lavender-900">{item.title}</h2>
                <p className="mt-1 text-sm text-lavender-700">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
        <article className="card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-lavender-500">WhatsApp</p>
            <span className="rounded-full bg-lavender-100 px-2 py-1 text-[11px] font-semibold text-lavender-700">Fast Reply</span>
          </div>
          <p className="mt-1.5 font-['Sora'] text-base font-bold text-lavender-900 sm:mt-2 sm:text-lg">+91 {BUSINESS_WHATSAPP_NUMBER}</p>
          <p className="mt-1 text-sm text-lavender-700">Best for order booking, price discussion, and quick updates.</p>
          <a className="btn-secondary mt-3 w-full sm:mt-4" href={`https://wa.me/91${BUSINESS_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            Chat on WhatsApp
          </a>
        </article>

        <article className="card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-lavender-500">Email</p>
            <span className="rounded-full bg-lavender-100 px-2 py-1 text-[11px] font-semibold text-lavender-700">Bulk Inquiry</span>
          </div>
          <p className="mt-1.5 break-all font-['Sora'] text-sm font-bold text-lavender-900 sm:mt-2 sm:text-base">{BUSINESS_EMAIL}</p>
          <p className="mt-1 text-sm text-lavender-700">Best for corporate gifting, event stalls, and custom quotations.</p>
          <a className="btn-secondary mt-3 w-full sm:mt-4" href={`mailto:${BUSINESS_EMAIL}`}>
            Send an Email
          </a>
        </article>
      </section>
    </main>
  );
};
