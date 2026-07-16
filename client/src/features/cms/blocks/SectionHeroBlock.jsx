import PropTypes from 'prop-types';
import HeroAtmosphere from '@/features/home/components/HeroAtmosphere';
import { asText, CtaLink, HeroTitle } from './premiumShared';

export default function SectionHeroBlock({ block, onNavigate }) {
  const keyword = asText(block?.imageKeyword) || 'premium-digital-studio';

  if (block?.variant === 'editorial') {
    return (
      <section className="hero-top-spacing relative isolate flex min-h-[88svh] items-end overflow-hidden bg-[#f6f9fb] pb-16 pt-36 text-[#0a2546] sm:pb-20 sm:pt-44 lg:min-h-screen lg:pb-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(40,174,195,0.13),transparent_30%),radial-gradient(circle_at_12%_20%,rgba(8,66,153,0.1),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[#cfdce5]" />
          <div className="absolute end-[8%] top-[18%] h-40 w-40 rounded-full border border-[#bad0de]/60 sm:h-64 sm:w-64" />
          <div className="absolute end-[14%] top-[26%] h-16 w-16 rounded-full bg-[#28aec3]/10 sm:h-24 sm:w-24" />
        </div>
        <div className="layout-container relative z-10">
          {block?.eyebrow ? <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#35628f]">{block.eyebrow}</p> : null}
          <h1 className="premium-geist mt-6 max-w-[17ch] text-[clamp(3rem,7.1vw,7.8rem)] font-medium leading-[0.94] tracking-[-0.055em] text-[#0b1728]">{block?.title}</h1>
          <div className="mt-10 grid gap-7 border-t border-[#cdd9e2] pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
            {block?.description ? <p className="max-w-[62ch] text-base leading-7 text-[#4f6479] sm:text-lg sm:leading-8">{block.description}</p> : null}
            <div className="flex flex-col gap-3 sm:flex-row"><CtaLink cta={block?.primaryCta} onNavigate={onNavigate} /><CtaLink cta={block?.secondaryCta} onNavigate={onNavigate} /></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <section className="hero-top-spacing hero-top-spacing--generous relative isolate flex min-h-screen items-center overflow-hidden pb-[var(--header-offset)] text-[#0a2546] max-sm:pb-[calc(var(--header-offset)-0.9rem)]">
        <HeroAtmosphere />
        <div className="layout-container--hero relative z-10 flex min-w-0 flex-col items-center">
          <HeroTitle title={block?.title} imageKeyword={keyword} />
          {block?.description ? (
            <p className="hero-lead mx-auto mt-3 max-w-[56ch] text-center lg:mt-6">{block.description}</p>
          ) : null}
          <div className="hero-cta-row mt-5 lg:mt-8">
            <CtaLink cta={block?.primaryCta} onNavigate={onNavigate} />
            <CtaLink cta={block?.secondaryCta} onNavigate={onNavigate} />
          </div>
        </div>
      </section>
    </div>
  );
}

SectionHeroBlock.propTypes = {
  block: PropTypes.object,
  onNavigate: PropTypes.func,
};

