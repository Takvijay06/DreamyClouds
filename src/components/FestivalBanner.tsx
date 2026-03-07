import { useEffect, useMemo, useState } from 'react';

interface FestivalSlide {
  title: string;
  subtitle: string;
  details: string;
  gradient: string;
  chip: string;
}

const FESTIVAL_SLIDES: FestivalSlide[] = [
  {
    title: 'Launch Offer',
    subtitle: 'Free Shipping on First 100 Orders',
    details: 'Use coupon code FIRST100 at checkout to claim shipping offer.',
    gradient: 'from-[#ff9f45] via-[#ff6b6b] to-[#ff2e63]',
    chip: 'FIRST100'
  },
  {
    title: 'Full Wrap Offer',
    subtitle: 'Placement Option Deal',
    details: 'Full wrap on tumblers is INR 299, now available at INR 199.',
    gradient: 'from-[#20bf55] via-[#01baef] to-[#0b4f6c]',
    chip: 'Limited Offer'
  },
  {
    title: 'Customisation',
    subtitle: 'Starts at Just INR 10',
    details: 'Personalize your products with names, designs, and custom details.',
    gradient: 'from-[#7b2ff7] via-[#f107a3] to-[#ff4d4d]',
    chip: 'Start at 10'
  }
];

const AUTO_ROTATE_MS = 3200;

export const FestivalBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = useMemo(() => FESTIVAL_SLIDES[activeIndex], [activeIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FESTIVAL_SLIDES.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className={`relative mt-4 overflow-hidden rounded-2xl border border-lavender-300/70 bg-gradient-to-r ${activeSlide.gradient} px-4 py-3 shadow-soft transition-all duration-700`}
    >
      <div className="pointer-events-none absolute -left-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-white/20 blur-md" />
      <div className="pointer-events-none absolute -right-8 top-1/3 h-24 w-24 rounded-full bg-white/20 blur-md" />

      <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex rounded-full border border-white/35 bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            {activeSlide.chip}
          </p>
          <h3 className="mt-1 font-['Sora'] text-lg font-extrabold uppercase tracking-[0.16em] text-white sm:text-xl">
            {activeSlide.title}
          </h3>
          <p className="text-sm font-semibold text-white/95">{activeSlide.subtitle}</p>
          <p className="text-xs text-white/85 sm:text-sm">{activeSlide.details}</p>
        </div>

        <div className="flex items-center gap-1.5">
          {FESTIVAL_SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

