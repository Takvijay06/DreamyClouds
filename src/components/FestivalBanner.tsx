import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { SCREAM_OFFER_BANNER, getScreamOfferSnapshot, isScreamOfferBannerVisible, subscribeScreamOffer } from '../utils/tumblerScreamOffer';

type OfferSlide = {
  id: string;
  text: string;
  bar: string;
  chip: string;
  chipText: string;
  dotActive: string;
};

const OFFER_SLIDES = [
  {
    id: 'candle-shipping',
    text: "Free shipping on candle's orders over ₹1000.",
    bar: 'from-amber-400 via-orange-500 to-rose-500',
    chip: 'from-amber-500/20 to-orange-500/15',
    chipText: 'text-amber-900',
    dotActive: 'from-amber-500 via-orange-500 to-rose-500'
  },
  {
    id: 'cart-shipping',
    text: 'Free shipping on tumbler & mug orders over ₹2000.',
    bar: 'from-violet-500 via-fuchsia-500 to-pink-500',
    chip: 'from-violet-500/20 to-fuchsia-500/15',
    chipText: 'text-violet-950',
    dotActive: 'from-violet-500 via-fuchsia-600 to-pink-500'
  },
  {
    id: 'bookmark-pair',
    text: 'You can save 25% when you buy two bookmarks.',
    bar: 'from-emerald-400 via-teal-500 to-cyan-500',
    chip: 'from-emerald-500/20 to-cyan-500/15',
    chipText: 'text-emerald-950',
    dotActive: 'from-emerald-500 via-teal-500 to-cyan-500'
  }
] as const satisfies readonly OfferSlide[];

const OfferSlideProgressTrack = ({
  placement,
  slide,
  index,
  resumeCycle,
  paused,
  reduceMotion,
  rotateMs
}: {
  placement: 'top' | 'bottom';
  slide: OfferSlide;
  index: number;
  resumeCycle: number;
  paused: boolean;
  reduceMotion: boolean;
  rotateMs: number;
}) => (
  <div
    className={`absolute ${placement === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-[2] h-1.5 overflow-hidden bg-slate-900/[0.07] motion-reduce:hidden sm:h-2 ${reduceMotion ? 'hidden' : ''}`}
    aria-hidden="true"
  >
    <div
      key={`${slide.id}-${index}-${resumeCycle}-${placement}`}
      className={`festival-offer-progress h-full w-full origin-left bg-gradient-to-r shadow-[0_0_12px_-2px_rgba(139,92,246,0.5)] ${slide.dotActive} ${
        paused ? 'festival-offer-progress-paused' : ''
      }`}
      style={{ animationDuration: `${rotateMs}ms` }}
    />
  </div>
);

const ROTATE_MS = 6000;

export const FestivalBanner = () => {
  const screamSnapshot = useSyncExternalStore(subscribeScreamOffer, getScreamOfferSnapshot, getScreamOfferSnapshot);
  const offerSlides = useMemo(
    () => (isScreamOfferBannerVisible() ? [...OFFER_SLIDES, SCREAM_OFFER_BANNER] : [...OFFER_SLIDES]),
    [screamSnapshot.isOfferVisible, screamSnapshot.isWeekend, screamSnapshot.isActive, screamSnapshot.awaitingActivation, screamSnapshot.remainingMs]
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [resumeCycle, setResumeCycle] = useState(0);
  const wasPausedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (wasPausedRef.current && !paused && !reduceMotion) {
      setResumeCycle((c) => c + 1);
    }
    wasPausedRef.current = paused;
  }, [paused, reduceMotion]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % offerSlides.length);
  }, [offerSlides.length]);

  useEffect(() => {
    setIndex((current) => (current >= offerSlides.length ? 0 : current));
  }, [offerSlides.length]);

  useEffect(() => {
    if (reduceMotion || paused) {
      return undefined;
    }
    const id = window.setInterval(goNext, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [goNext, reduceMotion, paused, index, resumeCycle]);

  const slide = offerSlides[index];

  return (
    <div className="relative mt-5 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-emerald-500 p-[2.5px] shadow-[0_20px_50px_-20px_rgba(139,92,246,0.55),0_16px_40px_-24px_rgba(16,185,129,0.4)] sm:rounded-[1.65rem]">
      <section
        className="relative overflow-hidden rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-white via-fuchsia-50/40 to-emerald-50/50 backdrop-blur-xl sm:rounded-[calc(1.65rem-2px)]"
        aria-label="Offers"
        aria-roledescription="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="festival-offers-ambient pointer-events-none absolute inset-0 opacity-80 motion-reduce:opacity-60"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 100% 0%, rgba(217, 70, 239, 0.22), transparent 50%), radial-gradient(ellipse 90% 70% at 0% 100%, rgba(16, 185, 129, 0.2), transparent 48%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(99, 102, 241, 0.12), transparent 60%)'
          }}
        />

        <div
          className="festival-banner-dots pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
          aria-hidden="true"
        />

        <div
          className="festival-banner-blob pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-400/50 via-violet-400/35 to-transparent blur-3xl"
          aria-hidden="true"
        />
        <div
          className="festival-banner-blob-delayed pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-400/45 via-teal-300/30 to-transparent blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-200/20 via-pink-200/15 to-cyan-200/20 blur-3xl motion-reduce:opacity-70"
          aria-hidden="true"
        />

        <div
          className="festival-offer-shimmer pointer-events-none absolute inset-x-4 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-fuchsia-400 via-amber-400 via-emerald-400 to-transparent opacity-95 sm:inset-x-10"
          aria-hidden="true"
        />

        <div className="relative z-10 p-4 sm:p-6">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-white/90 bg-gradient-to-r ${slide.chip} px-3 py-1.5 shadow-lg shadow-violet-500/10 backdrop-blur-md`}
          >
            <span
              className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-emerald-500 shadow-[0_0_10px_rgba(217,70,239,0.7)] motion-safe:animate-pulse"
              aria-hidden="true"
            />
            <p
              className={`bg-gradient-to-r from-violet-700 via-fuchsia-700 to-emerald-700 bg-clip-text font-['Sora'] text-[10px] font-extrabold uppercase tracking-[0.32em] text-transparent sm:text-[11px]`}
            >
              Offers
            </p>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${slide.chipText} bg-white/70 sm:text-[10px]`}
            >
              Save
            </span>
          </div>

          <div className="relative mt-4 sm:mt-5" aria-live="polite">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-[0_12px_40px_-20px_rgba(91,33,182,0.25)] backdrop-blur-md"
            >
              <div
                className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${slide.bar} sm:w-2`}
                aria-hidden="true"
              />
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-[0.12] ${slide.chip}`}
                aria-hidden="true"
              />
              <OfferSlideProgressTrack
                placement="top"
                slide={slide}
                index={index}
                resumeCycle={resumeCycle}
                paused={paused}
                reduceMotion={reduceMotion}
                rotateMs={ROTATE_MS}
              />
              <p
                key={index}
                id={`offer-slide-${slide.id}`}
                className="festival-slide-enter relative z-[1] min-w-0 max-w-3xl px-4 pb-5 pt-5 pl-5 font-['Sora'] text-[0.98rem] font-semibold leading-relaxed sm:px-6 sm:pb-6 sm:pt-6 sm:pl-7 sm:text-[1.06rem] sm:leading-relaxed"
                style={{
                  color: '#0f172a',
                  textShadow: '0 1px 0 rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.5)'
                }}
              >
                {slide.text}
              </p>

              <OfferSlideProgressTrack
                placement="bottom"
                slide={slide}
                index={index}
                resumeCycle={resumeCycle}
                paused={paused}
                reduceMotion={reduceMotion}
                rotateMs={ROTATE_MS}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2.5 sm:mt-6 sm:gap-3">
            {offerSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`relative h-2.5 rounded-full transition-[width,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-fuchsia-50/90 ${
                  i === index
                    ? `w-11 scale-100 bg-gradient-to-r ${s.dotActive} shadow-[0_4px_20px_-4px_rgba(139,92,246,0.65)]`
                    : 'w-2.5 scale-95 bg-violet-200/90 hover:scale-100 hover:bg-fuchsia-300 active:scale-95'
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
    </div>
  );
};
