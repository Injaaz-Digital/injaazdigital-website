import PropTypes from 'prop-types';
import { CmsLinkButton } from './shared';

export default function CtaBannerBlock({ block, locale, onNavigate }) {
  const isArabic = locale === 'ar';

  if (!block.heading && !block.description) {
    return null;
  }

  return (
    <section className="section section--tight">
      <div className="relative overflow-hidden rounded-[30px] border border-[rgba(103,190,255,0.28)] bg-[linear-gradient(144deg,#071a35_0%,#0a3164_50%,#0f5ea8_100%)] px-[21px] py-[34px] text-white shadow-[0_24px_60px_rgba(8,41,89,0.35)] sm:px-[34px] sm:py-[55px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-[28%] -top-[198px] h-[386px] w-[86%] rotate-[-15deg] rounded-[999px] bg-[linear-gradient(120deg,rgba(109,133,255,0.95)_0%,rgba(34,38,150,0.92)_36%,rgba(6,13,88,0.96)_100%)] shadow-[inset_0_18px_36px_rgba(198,208,255,0.36),inset_0_-24px_42px_rgba(4,7,45,0.74)]" />
          <div className="absolute -right-[24%] -top-[156px] h-[352px] w-[78%] rotate-[20deg] rounded-[999px] bg-[linear-gradient(138deg,rgba(90,170,230,0.92)_0%,rgba(18,63,132,0.9)_44%,rgba(4,19,80,0.96)_100%)] shadow-[inset_0_16px_34px_rgba(187,230,255,0.25),inset_0_-26px_42px_rgba(4,14,56,0.72)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_52%,rgba(8,24,52,0.22)_0%,rgba(8,23,50,0.56)_58%,rgba(5,16,38,0.74)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(144,234,255,0.22),transparent_36%),radial-gradient(circle_at_84%_86%,rgba(62,195,230,0.26),transparent_42%)]" />
        </div>

        <div className="layout-content-reading relative z-[1]">
          <div className="section-head section-head--inverse" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
            {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
            {block.heading ? (
              <h2 className="section-title section-title--center section-title--inverse !text-white">
                {block.heading}
              </h2>
            ) : null}
            {block.description ? <p className="section-head-lead">{block.description}</p> : null}
          </div>

          <div className="mt-[34px] flex flex-wrap items-center justify-center gap-[13px]">
            <CmsLinkButton link={block.primaryCta} onNavigate={onNavigate} className="!h-10" />
            <CmsLinkButton link={block.secondaryCta} onNavigate={onNavigate} className="!h-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

CtaBannerBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    primaryCta: PropTypes.object,
    secondaryCta: PropTypes.object,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
  onNavigate: PropTypes.func,
};
