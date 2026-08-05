export default function ProgressBar({ currentStep, totalSteps }) {
  const progress = totalSteps > 0 ? Math.min(100, Math.round((currentStep / totalSteps) * 100)) : 0;

  return (
    <div className="space-y-1.5" aria-label={`${progress}% complete`}>
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b8099]">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#dde7f4]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#0b5da8_0%,#30a2c3_100%)] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
