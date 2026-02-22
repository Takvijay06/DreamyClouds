import { ReactNode } from 'react';
import brandLogo from '../data/Logos/Logo_4.jpeg';
import { StepProgress } from './StepProgress';

interface LayoutProps {
  children: ReactNode;
  currentStep: 1 | 2 | 3 | 4;
  crossedSteps?: number[];
}

export const Layout = ({ children, currentStep, crossedSteps }: LayoutProps) => {
  return (
    <main className="page-shell animate-fadeInUp">
      <div className="floating-orb left-[-18px] top-20 h-16 w-16 bg-lavender-200/70" />
      <div className="floating-orb right-6 top-32 h-8 w-8 bg-lavender-300/80" />

      <section className="hero-glow relative overflow-hidden rounded-3xl border border-lavender-200/70 p-5 shadow-soft sm:p-7">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 p-0.5 shadow-sm ring-1 ring-lavender-200">
                <img src={brandLogo} alt="Dreamy Clouds logo" className="h-full w-full rounded-full object-cover" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-lavender-600">Dreamy Clouds By Daisy</p>
            </div>
            <h1 className="mt-2 font-['Sora'] text-2xl font-extrabold leading-tight text-lavender-900 sm:text-3xl">
              Design it. Preview it. Order in minutes.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-lavender-700 sm:max-w-xl">
              Custom UV TF printed tumblers, mugs, and bookmarks with instant WhatsApp checkout.
            </p>
          </div>
          <div className="mx-auto rounded-2xl border border-lavender-300/60 bg-white/85 px-4 py-3 text-center shadow-sm sm:mx-0 sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-lavender-500">Flow</p>
            <p className="font-['Sora'] text-lg font-bold text-lavender-900">4-step quick order</p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <StepProgress currentStep={currentStep} crossedSteps={crossedSteps} />
      </section>

      <section className="mt-6 card p-4 sm:p-6">{children}</section>

      <footer className="mt-8 rounded-2xl border border-lavender-200/70 bg-white/80 px-4 py-3 text-center text-xs text-lavender-700 shadow-soft sm:text-sm">
        © {new Date().getFullYear()} Dreamy Clouds By Daisy. Crafted by Vijay Tak.
      </footer>
    </main>
  );
};
