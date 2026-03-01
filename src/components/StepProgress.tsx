const STEPS = ['Product', 'Design', 'Cart'];

interface StepProgressProps {
  currentStep: number;
  crossedSteps?: number[];
}

export const StepProgress = ({ currentStep, crossedSteps = [] }: StepProgressProps) => {
  return (
    <>
      <div className="rounded-2xl border border-lavender-200/80 bg-white/90 p-3 shadow-soft sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lavender-500">Current Step</p>
            <p className="mt-1 font-['Sora'] text-base font-bold text-lavender-900">{STEPS[currentStep - 1]}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-lavender-700 to-lavender-500 px-3 py-2 text-xs font-bold text-white">
            {currentStep}/3
          </div>
        </div>
      </div>

      <div className="hidden grid-cols-3 gap-3 rounded-3xl border border-lavender-200/70 bg-white/85 p-4 shadow-soft sm:grid">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const isActive = currentStep === step;
          const isComplete = currentStep > step;
          const isCrossed = crossedSteps.includes(step);

          return (
            <div
              key={label}
              className={`rounded-2xl border px-3 py-3 text-center transition sm:py-3.5 ${
                isCrossed
                  ? 'border-red-200 bg-red-50 text-red-500'
                  : isActive
                  ? 'border-lavender-600 bg-gradient-to-r from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-300/50'
                  : isComplete
                    ? 'border-lavender-300 bg-lavender-100 text-lavender-800'
                    : 'border-lavender-200 bg-white text-lavender-500'
              }`}
            >
              <p className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-current text-[11px] font-bold sm:h-7 sm:w-7 sm:text-xs">
                {step}
              </p>
              <p className={`text-xs font-semibold sm:text-sm ${isCrossed ? 'line-through' : ''}`}>{label}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
