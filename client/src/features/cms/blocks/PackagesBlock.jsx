import PropTypes from 'prop-types';
import { BLOCK_SECTION_IDS, CmsLinkButton } from './shared';

export default function PackagesBlock({ block, locale, onNavigate }) {
  const packages = Array.isArray(block.packages) ? block.packages.filter((item) => item?.name) : [];

  if (packages.length === 0) {
    return null;
  }

  return (
    <section className="section" id={BLOCK_SECTION_IDS['blocks.packages']}>
      <div className="layout-content-narrow">
        <div className="section-head" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale === 'ar' ? 'ar' : 'en'}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? (
            <h2 className="section-title text-center">
              {block.heading}
            </h2>
          ) : null}
          {block.description ? <p className="section-head-lead">{block.description}</p> : null}
        </div>
      </div>

      <div className="mt-[34px] grid gap-[21px] md:grid-cols-3">
        {packages.map((pkg, index) => {
          const packagePoints = [pkg.summary, pkg.outcome, pkg.timeline].filter(Boolean);

          return (
            <article
              key={`${pkg.name}-${index}`}
              className={`rounded-[34px] corner-squircle border p-[21px] shadow-[0_14px_32px_rgba(8,41,89,0.06)] ${
                pkg.recommended
                  ? 'border-[rgba(8,66,153,0.24)] bg-[linear-gradient(160deg,#ffffff,#f3f8ff)]'
                  : 'border-[rgba(8,66,153,0.12)] bg-white'
              }`}
            >
              {pkg.recommended ? (
                <span className="inline-flex rounded-full bg-[#0a2546] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
                  {locale === 'ar' ? 'موصى بها' : 'Recommended'}
                </span>
              ) : null}

              <h3 className="mt-[13px] text-xl tracking-[-0.02em] text-[#0a2546]">{pkg.name}</h3>
              {pkg.priceLabel ? <p className="mt-[8px] text-base font-medium text-[#0b4f8c]">{pkg.priceLabel}</p> : null}

              {packagePoints.length > 0 ? (
                <ul className="mt-[21px] grid gap-[13px] text-sm leading-7 text-[#4f6a89]">
                  {packagePoints.map((point, pointIndex) => (
                    <li key={`${pkg.name}-point-${pointIndex}`} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0b4f8c]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-[21px]">
                <CmsLinkButton link={pkg.cta} onNavigate={onNavigate} className="!h-10" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

PackagesBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    packages: PropTypes.array,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
  onNavigate: PropTypes.func,
};
