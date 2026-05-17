const STEPS = ['Product', 'Design', 'Cart'];

interface StepProgressProps {
  currentStep: number;
  crossedSteps?: number[];
}

export const StepProgress = ({ currentStep, crossedSteps = [] }: StepProgressProps) => {
  return (
    <>
      <div className="rounded-2xl border border-lavender-200/80 bg-white/90 p-3.5 shadow-md shadow-lavender-200/30 backdrop-blur-sm sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lavender-500">Current Step</p>
            <p className="mt-1 font-['Sora'] text-base font-bold text-lavender-900">{STEPS[currentStep - 1]}</p>
          </div>
          <div className="shrink-0 rounded-xl bg-gradient-to-r from-lavender-700 to-lavender-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-lavender-400/35">
            {currentStep}/3
          </div>
        </div>
      </div>

      <div className="hidden grid-cols-3 gap-3 rounded-3xl border border-lavender-200/70 bg-white/90 p-4 shadow-md shadow-lavender-200/25 backdrop-blur-sm sm:grid">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const isActive = currentStep === step;
          const isComplete = currentStep > step;
          const isCrossed = crossedSteps.includes(step);

          return (
            <div
              key={label}
              className={`rounded-2xl border px-3 py-3 text-center transition-[transform,box-shadow] duration-300 sm:py-3.5 ${
                isCrossed
                  ? 'border-red-200 bg-red-50 text-red-500'
                  : isActive
                    ? 'border-lavender-500 bg-gradient-to-br from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-400/40 ring-1 ring-white/25'
                    : isComplete
                      ? 'border-lavender-300 bg-lavender-50/90 text-lavender-800 shadow-sm'
                      : 'border-lavender-200/90 bg-white/80 text-lavender-500 shadow-sm'
              }`}
            >
              <p className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full border border-current text-xs font-bold sm:h-8 sm:w-8 sm:text-sm">
                {isComplete && !isCrossed ? <span aria-hidden="true">{'\u2713'}</span> : step}
              </p>
              <p className={`text-xs font-semibold sm:text-sm ${isCrossed ? 'line-through' : ''}`}>{label}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
