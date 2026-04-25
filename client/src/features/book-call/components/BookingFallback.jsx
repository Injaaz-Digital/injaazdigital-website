import Link from 'next/link';

export default function BookingFallback({ copy }) {
  return (
    <section className="rounded-2xl border border-[#d8e3ef] bg-[#f8fbff] p-6 md:p-8">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[#5d7393]">{copy?.meetingName}</p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0a2546]">{copy?.fallbackTitle}</h2>
        <p className="text-base leading-7 text-[#4e6784]">{copy?.fallbackDescription}</p>
        <Link
          href={copy?.fallbackCtaHref || '/'}
          className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] bg-white px-4 text-sm text-[color:var(--ink-2)] shadow-[0_8px_20px_rgba(13,25,46,0.08)] transition hover:border-[var(--line-strong)] hover:bg-white/90"
        >
          {copy?.fallbackCtaLabel}
        </Link>
      </div>
    </section>
  );
}
