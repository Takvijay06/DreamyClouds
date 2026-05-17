import { useCallback, useEffect, useState } from 'react';

const OFFER_SLIDES = [
  {
    id: 'candle-shipping',
    text: 'Free shipping on candle orders over ₹1000 (candle total before delivery).'
  },
  {
    id: 'cart-shipping',
    text: 'Free shipping on your whole cart when order total before delivery is over ₹2000.'
  },
  {
    id: 'bookmark-pair',
    text: 'Buy 2 bookmarks for ₹149 in the same order (~25% off vs two × ₹99; you save ₹49 per pair).'
  }
] as const;

const ROTATE_MS = 6000;

export const FestivalBanner = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % OFFER_SLIDES.length);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) {
      return undefined;
    }
    const id = window.setInterval(goNext, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [goNext, reduceMotion, paused, index]);

  const slide = OFFER_SLIDES[index];

  return (
    <section
      className="relative mt-5 overflow-hidden rounded-[1.35rem] border border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50/90 to-teal-50/80 shadow-[0_24px_48px_-32px_rgba(13,148,136,0.45),0_0_0_1px_rgba(255,255,255,0.65)_inset] backdrop-blur-xl sm:rounded-3xl"
      aria-label="Offers"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="festival-offers-ambient pointer-events-none absolute inset-0 opacity-70 motion-reduce:opacity-50"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(120% 80% at 95% -10%, rgba(45, 212, 191, 0.32), transparent 45%), radial-gradient(100% 70% at -5% 110%, rgba(16, 185, 129, 0.22), transparent 48%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(6, 182, 212, 0.12), transparent 55%)'
        }}
      />

      <div
        className="festival-offer-shimmer pointer-events-none absolute inset-x-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent opacity-90 sm:inset-x-10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-gradient-to-br from-teal-300/25 to-cyan-200/15 blur-3xl motion-reduce:opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-12 bottom-0 h-40 w-52 rounded-full bg-emerald-200/25 blur-3xl motion-reduce:opacity-60"
        aria-hidden="true"
      />

      <div className="relative z-10 p-4 sm:p-6">
        <div className="inline-flex items-center rounded-full border border-emerald-200/70 bg-white/75 px-3 py-1.5 shadow-[0_4px_20px_-8px_rgba(5,150,105,0.35)] backdrop-blur-md">
          <p className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-800 bg-clip-text font-['Sora'] text-[10px] font-extrabold uppercase tracking-[0.35em] text-transparent sm:text-[11px]">
            Offers
          </p>
        </div>

        <div
          className="relative mt-4 overflow-hidden rounded-2xl border border-white/90 bg-white/55 p-4 shadow-[0_8px_30px_-18px_rgba(15,118,110,0.28)] backdrop-blur-md sm:mt-5 sm:p-5"
          aria-live="polite"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-teal-50/30"
            aria-hidden="true"
          />
          <p
            key={index}
            id={`offer-slide-${slide.id}`}
            className="festival-slide-enter relative z-[1] min-w-0 max-w-3xl font-['Sora'] text-[0.98rem] font-semibold leading-relaxed text-emerald-950 antialiased sm:text-[1.05rem] sm:leading-relaxed"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.85)' }}
          >
            {slide.text}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2.5 sm:mt-6 sm:gap-3">
          {OFFER_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`relative h-2.5 rounded-full transition-[width,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-50/80 ${
                i === index
                  ? 'w-10 scale-100 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 shadow-[0_4px_16px_-4px_rgba(13,148,136,0.55)]'
                  : 'w-2.5 scale-95 bg-emerald-300/80 hover:scale-100 hover:bg-emerald-400 active:scale-95'
              }`}
              aria-label={`Show offer ${i + 1}`}
              aria-controls={`offer-slide-${s.id}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
