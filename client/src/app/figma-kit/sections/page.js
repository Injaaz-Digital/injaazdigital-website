'use client';

import Footer from '@/shared/layout/Footer';
import BookingMeetingBlock from '@/features/cms/blocks/BookingMeetingBlock';
import CtaBannerBlock from '@/features/cms/blocks/CtaBannerBlock';
import ProcessBlock from '@/features/cms/blocks/ProcessBlock';
import ProofBlock from '@/features/cms/blocks/ProofBlock';
import TrustRowBlock from '@/features/cms/blocks/TrustRowBlock';
import {
  PREVIEW_BOOKING_BLOCK,
  PREVIEW_CTA,
  PREVIEW_CTA_BANNER_BLOCK,
  PREVIEW_FOOTER_DATA,
  PREVIEW_NAV_ITEMS,
  PREVIEW_PROCESS_BLOCK,
  PREVIEW_PROOF_BLOCK,
  PREVIEW_TRUST_ROW_BLOCK,
} from '@/features/figma-kit/sampleData';

export default function FigmaKitSectionsPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#edf3fa_0%,#f8fbff_40%,#ffffff_100%)]">
      <div className="px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] border border-[rgba(8,66,153,0.1)] bg-white/86 p-8 shadow-[0_30px_80px_rgba(8,41,89,0.08)] backdrop-blur-sm sm:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6d85a1]">Section Library</p>
            <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.6rem)] tracking-[-0.05em] text-[#0a2546]">
              Reusable content blocks and the live footer pattern.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#536d8a]">
              These examples use the actual section components so you can capture them as clean Figma references for
              future reuse.
            </p>
          </section>

          <div data-figma="trust-row">
            <TrustRowBlock block={PREVIEW_TRUST_ROW_BLOCK} />
          </div>

          <div data-figma="process-block">
            <ProcessBlock block={PREVIEW_PROCESS_BLOCK} locale="en" onNavigate={() => {}} />
          </div>

          <div data-figma="proof-block">
            <ProofBlock block={PREVIEW_PROOF_BLOCK} locale="en" />
          </div>

          <div data-figma="cta-banner">
            <CtaBannerBlock block={PREVIEW_CTA_BANNER_BLOCK} onNavigate={() => {}} />
          </div>

          <div data-figma="booking-block">
            <BookingMeetingBlock block={PREVIEW_BOOKING_BLOCK} locale="en" onNavigate={() => {}} />
          </div>

        </div>
      </div>

      <div data-figma="footer-block">
        <Footer
          locale="en"
          navItems={PREVIEW_NAV_ITEMS}
          cta={PREVIEW_CTA}
          footerData={PREVIEW_FOOTER_DATA}
          onNavigate={() => {}}
        />
      </div>
    </div>
  );
}
