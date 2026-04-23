'use client';

import { useEffect } from 'react';
import Header from '@/shared/layout/Header';
import { PREVIEW_CTA, PREVIEW_NAV_ITEMS } from '@/features/figma-kit/sampleData';

const fillerCards = [
  'Positioning and trust hierarchy',
  'Service architecture and offer clarity',
  'Lead flow, CRM, and automation touchpoints',
  'Editorial content rhythm and proof placement',
];

export default function HeaderPreviewClient({ state = 'default' }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (state === 'scrolled') {
      const timer = window.setTimeout(() => {
        window.scrollTo({ top: 180, behavior: 'auto' });
      }, 450);

      return () => window.clearTimeout(timer);
    }

    if (state === 'mobile-open' || state === 'language-open') {
      const timer = window.setTimeout(() => {
        const label = state === 'language-open' ? 'Switch language' : 'Toggle menu';
        const button = document.querySelector(`[aria-label="${label}"]`);

        if (button instanceof HTMLButtonElement) {
          button.click();
        }
      }, 900);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [state]);

  return (
    <div
      data-figma="header-preview"
      className="min-h-[1400px] bg-[linear-gradient(180deg,#eff5fb_0%,#f8fbff_42%,#ffffff_100%)]"
    >
      <Header
        locale="en"
        activePath="/"
        navItems={PREVIEW_NAV_ITEMS}
        cta={PREVIEW_CTA}
        onNavigate={() => {}}
        onPrefetch={() => {}}
        onLocaleChange={() => {}}
      />

      <main className="px-6 pb-20 pt-32">
        <section className="mx-auto max-w-6xl rounded-[36px] border border-[rgba(8,66,153,0.1)] bg-white/82 p-8 shadow-[0_30px_80px_rgba(8,41,89,0.08)] backdrop-blur-sm sm:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6d85a1]">Header Preview</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.6rem,5vw,5rem)] tracking-[-0.05em] text-[#0a2546]">
            Navigation that stays polished across desktop, mobile, and scrolled states.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#516b89]">
            This route exists only to push the real header behavior into Figma. Use `state=scrolled`,
            `state=mobile-open`, or `state=language-open` when you want specific captures.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2">
          {fillerCards.map((item, index) => (
            <article
              key={item}
              className="rounded-[28px] border border-[rgba(8,66,153,0.1)] bg-white p-8 shadow-[0_18px_40px_rgba(8,41,89,0.06)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b91ab]">
                Panel {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-4 text-2xl tracking-[-0.03em] text-[#0a2546]">{item}</h2>
              <p className="mt-4 text-sm leading-7 text-[#5c7696]">
                Background structure is intentionally simple here. The focus is the live header behavior rather than the
                marketing content underneath it.
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
