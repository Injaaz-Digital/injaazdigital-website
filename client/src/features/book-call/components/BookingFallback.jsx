import Button from '@/shared/ui/Button';

export default function BookingFallback({ result, onRestart }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(241,247,255,0.92)_100%)] p-6 shadow-[0_28px_80px_rgba(8,41,89,0.14)] md:p-8">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[#5d7393]">Qualification Result</p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0a2546]">We need a little more context before booking.</h2>
        <p className="text-base leading-7 text-[#4e6784]">
          Your answers were saved successfully, but this request does not meet the current booking threshold yet. You can still reach out and we will review the details manually.
        </p>
        <div className="rounded-2xl border border-[#d8e4f0] bg-white/80 px-5 py-4 text-sm text-[#17314d]">
          <p>Current score: <strong>{result?.score ?? 0}</strong></p>
          <p>Status: <strong>{result?.status || 'unqualified'}</strong></p>
        </div>
        <Button variant="outline" onClick={onRestart}>Start again</Button>
      </div>
    </section>
  );
}
