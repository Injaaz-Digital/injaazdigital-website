import PropTypes from 'prop-types';
import BlinkingSquares from '@/shared/ui/BlinkingSquares';
import cx from '@/lib/utils/cx';
import { CtaLink, SECTION_CONTAINER, SectionShell } from './premiumShared';

const CTA_PIXEL_CELLS = Array.from({ length: 9 }, (_, index) => index);

export default function FinalCtaBlock({ block, onNavigate }) {
  return (
    <SectionShell className="py-10 sm:py-14 lg:py-16">
      <div className={SECTION_CONTAINER}>
        <div className="corner-squircle relative isolate flex min-h-[440px] overflow-hidden rounded-[46px] bg-white/0 px-5 py-14 shadow-[0_28px_80px_rgba(8,66,153,0.08)] sm:min-h-[480px] sm:rounded-[54px] sm:px-10 sm:py-16 lg:min-h-[520px]">
          <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
            <BlinkingSquares
              direction="bottom"
              gridSize={8}
              squareSize={0.4}
              fadeStart={0.06}
              fadeEnd={1}
              falloff={0.72}
              minBrightness={0.42}
              twinkleSpeed={0.18}
              twinkleStrength={0.72}
              intensity={0.9}
              opacity={0.72}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-x-[-10%] bottom-[-54%] h-[96%] bg-[radial-gradient(ellipse_at_center,rgba(40,174,195,0.26)_0%,rgba(8,66,153,0.13)_38%,rgba(248,251,253,0)_72%)] blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-52 w-[72%] -translate-x-1/2 rounded-b-[50%] bg-white/90 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 m-auto flex w-full max-w-[48rem] flex-col items-center text-center" dir="auto">
            <div className="corner-squircle grid h-11 w-11 grid-cols-3 gap-[3px] rounded-[14px] border border-[#b9dfe8] bg-white/80 p-[11px] shadow-[inset_0_1px_0_white,0_12px_30px_rgba(8,66,153,0.12)] backdrop-blur-xl sm:h-12 sm:w-12 sm:p-3" aria-hidden="true">
              {CTA_PIXEL_CELLS.map((cell) => (
                <span
                  key={cell}
                  className={cx(
                    'rounded-[2px] bg-[#1689ae]',
                    cell === 4 ? 'opacity-100' : cell % 2 === 0 ? 'opacity-70' : 'opacity-30'
                  )}
                />
              ))}
            </div>

            <p className="premium-geist mt-5 text-center text-[0.68rem] font-semibold uppercase tracking-[0.17em] text-[#35628f] sm:mt-6">Start with clarity</p>
            <h2 className="section-title section-title--center mt-4 !mx-auto !max-w-[22ch] !text-center !text-[clamp(2rem,4.35vw,3.9rem)] !font-medium !leading-[1.04] !tracking-[-0.03em] !text-[#0b1728] sm:mt-5">
              {block?.heading}
            </h2>
            {block?.description ? (
              <p className="premium-geist mx-auto mt-5 max-w-[56ch] text-center text-[0.92rem] leading-6 text-[#53677c] sm:mt-6 sm:text-base sm:leading-7">
                {block.description}
              </p>
            ) : null}

            <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center">
              <CtaLink cta={block?.primaryCta} onNavigate={onNavigate} />
              <CtaLink cta={block?.secondaryCta} onNavigate={onNavigate} />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

FinalCtaBlock.propTypes = {
  block: PropTypes.object,
  onNavigate: PropTypes.func,
};

