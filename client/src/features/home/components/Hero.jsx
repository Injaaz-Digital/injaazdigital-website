import { memo } from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/ui/Button';
import HeroAtmosphere from './HeroAtmosphere';
import HeroCubeStage from './HeroCubeStage';

function HeroSignalCanvas() {
  return (
    <div className="relative mx-auto flex w-full justify-center overflow-visible max-sm:max-w-[250px]">
      <HeroCubeStage />
    </div>
  );
}

export function CmsHero({ block = {}, locale = 'en', onNavigate }) {
  const title = block.title || block.headline;
  const subtitle = block.subtitle || block.subheadline;
  const isCentered = block.align === 'center';
  const isArabic = locale === 'ar';
  const fallbackCtas = isArabic
    ? {
        primary: { label: 'احجز مكالمة', url: '/book-call', isExternal: false },
        secondary: { label: 'شاهد كيف نعمل', url: '/growth-engine', isExternal: false },
      }
    : {
        primary: { label: 'Book a Call', url: '/book-call', isExternal: false },
        secondary: { label: 'See How It Works', url: '/growth-engine', isExternal: false },
      };
  const primaryCta = block.primaryCta?.label
    ? block.primaryCta
    : fallbackCtas.primary;
  const secondaryCta = block.secondaryCta?.label
    ? block.secondaryCta
    : fallbackCtas.secondary;

  const handleHeroCtaClick = (link) => {
    if (!link?.url) return;
    if (link.isExternal) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (onNavigate) {
      onNavigate(link.url);
      return;
    }
    window.location.assign(link.url);
  };

  return (
    <section className="relative isolate overflow-hidden pb-14 pt-[var(--header-offset)] max-sm:pb-6 max-sm:pt-[calc(var(--header-offset)-0.9rem)] sm:pb-16 lg:pb-20">
      <HeroAtmosphere />

      <div className="layout-container--hero relative">
        <div
          className={
            isCentered
              ? 'mx-auto grid max-w-5xl gap-8 text-center max-sm:gap-2'
              : 'grid gap-10 max-sm:gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.94fr)] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.92fr)] xl:gap-14'
          }
        >
          <div className={`${isCentered ? '' : 'max-w-[42rem] max-lg:mx-auto'} order-2 text-center lg:order-1 lg:text-start`}>
            {title ? (
              <h1
                className={`hero-title-plain mx-auto mt-3 max-w-[13ch] text-center sm:max-w-[14ch] lg:mt-5 ${
                  isCentered ? 'lg:mx-auto lg:max-w-[14ch] xl:max-w-[15ch]' : 'lg:mx-0 lg:max-w-[13ch] xl:max-w-[14ch] lg:text-start'
                }`}
              >
                {title}
              </h1>
            ) : null}

            {subtitle ? (
              <p
                className={`hero-lead mx-auto mt-3 max-w-[56ch] text-center lg:mt-6 ${
                  isCentered ? 'lg:mx-auto lg:text-center' : 'lg:mx-0 lg:text-start'
                }`}
              >
                {subtitle}
              </p>
            ) : null}

            <div
              className={`mt-5 flex flex-wrap justify-center gap-3 max-sm:flex-col max-sm:[&>button]:w-full sm:[&>button]:w-auto lg:mt-8 ${
                isCentered ? 'lg:justify-center' : 'lg:justify-start'
              }`}
            >
              {primaryCta?.label ? (
                <Button variant="primary" size="lg" onClick={() => handleHeroCtaClick(primaryCta)}>
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta?.label ? (
                <Button variant="outline" size="lg" onClick={() => handleHeroCtaClick(secondaryCta)}>
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </div>

          <div
            className={`relative order-1 lg:order-2 ${
              isCentered
                ? 'mx-auto mt-0 w-full max-w-[250px] sm:mt-4 sm:max-w-[680px] lg:mt-10 lg:max-w-[880px]'
                : 'mx-auto w-full max-w-[250px] sm:max-w-[560px] lg:mx-auto lg:max-w-[820px] lg:justify-self-center'
            }`}
          >
            <HeroSignalCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}

CmsHero.propTypes = {
  block: PropTypes.shape({
    title: PropTypes.string,
    headline: PropTypes.string,
    subtitle: PropTypes.string,
    subheadline: PropTypes.string,
    eyebrow: PropTypes.string,
    badge: PropTypes.string,
    availability: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center']),
    visual: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    kpis: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
        hint: PropTypes.string,
      })
    ),
    primaryCta: PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
      style: PropTypes.string,
      isExternal: PropTypes.bool,
    }),
    secondaryCta: PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
      style: PropTypes.string,
      isExternal: PropTypes.bool,
    }),
  }),
  locale: PropTypes.oneOf(['en', 'ar']),
  onNavigate: PropTypes.func,
};

export default memo(CmsHero);
