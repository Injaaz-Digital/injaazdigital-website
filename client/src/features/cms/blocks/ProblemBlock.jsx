import PropTypes from 'prop-types';
import { BLOCK_SECTION_IDS } from './shared';

export default function ProblemBlock({ block, locale }) {
  const bullets = Array.isArray(block.bullets) ? block.bullets.filter((item) => item?.title) : [];
  const isArabic = locale === 'ar';

  if (!block.heading && bullets.length === 0 && !block.insight) {
    return null;
  }

  return (
    <section className="section" id={BLOCK_SECTION_IDS['blocks.problem']}>
      <div className="layout-content-narrow">
        <div className="section-head" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? (
            <h2 className="section-title text-center">
              {block.heading}
            </h2>
          ) : null}
          {block.description ? <p className="section-head-lead">{block.description}</p> : null}
        </div>
      </div>

      {bullets.length > 0 ? (
        <div className="mt-[34px] grid gap-[21px] md:grid-cols-2 lg:grid-cols-3">
          {bullets.map((bullet, index) => (
            <article
              key={`${bullet.title}-${index}`}
              className="rounded-[22px] border border-[rgba(8,66,153,0.12)] bg-white p-[21px] shadow-[0_12px_26px_rgba(8,41,89,0.05)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d85a1]">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-[13px] text-lg tracking-[-0.02em] text-[#0a2546]">{bullet.title}</h3>
              {bullet.description ? <p className="mt-[13px] text-sm leading-7 text-[#4f6a89]">{bullet.description}</p> : null}
            </article>
          ))}
        </div>
      ) : null}

      {block.insight ? (
        <div className="layout-content-narrow mt-[34px] rounded-[22px] border border-[rgba(8,66,153,0.12)] bg-[#f5f9ff] px-[21px] py-[13px] text-sm leading-7 text-[#24466f]">
          {block.insight}
        </div>
      ) : null}
    </section>
  );
}

ProblemBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    insight: PropTypes.string,
    bullets: PropTypes.array,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
};
