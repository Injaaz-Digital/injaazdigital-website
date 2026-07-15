import PropTypes from 'prop-types';
import { CmsImage, pickVisual } from './shared';

export default function ProofBlock({ block, locale }) {
  const metrics = Array.isArray(block.trackedMetrics) ? block.trackedMetrics.filter(Boolean) : [];
  const leadMetric = metrics[0] || null;
  const secondaryMetric = metrics[1] || null;

  return (
    <section className="section">
      <div className="layout-content-narrow">
        <div className="section-head" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale === 'ar' ? 'ar' : 'en'}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? (
            <h2 className="section-title">
              {block.heading}
            </h2>
          ) : null}
          {block.evidenceText ? <p className="section-head-lead">{block.evidenceText}</p> : null}
        </div>
      </div>

      <div className="mt-[34px] grid gap-[21px] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <article className="rounded-[36px] corner-squircle border border-[rgba(8,66,153,0.14)] bg-white p-[34px] shadow-[0_16px_36px_rgba(8,41,89,0.07)]">
          <p className="text-sm tracking-[0.14em] text-[#0b4f8c]">★★★★★</p>
          <p className="mt-[13px] text-[1.05rem] leading-8 text-[#24466f]">{block.evidenceText || block.afterLabel || block.beforeLabel}</p>

          <div className="mt-[21px] flex items-center gap-[13px]">
            <CmsImage
              media={block.artifact}
              src={pickVisual([block.artifact], 0, '/media/image2.png')}
              alt="Client"
              width={72}
              height={72}
              className="h-[64px] w-[64px] rounded-xl object-cover"
              sizes="64px"
            />
            <div>
              <strong className="block text-[#0a2546]">{block.afterLabel || 'Client Partner'}</strong>
              <span className="text-sm text-[#5c7696]">{block.beforeLabel || (locale === 'ar' ? 'دراسة حالة' : 'Case Study')}</span>
            </div>
          </div>
        </article>

        <div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-1">
          {[leadMetric, secondaryMetric].filter(Boolean).map((metric, index) => (
            <article
              key={`${metric.label || 'metric'}-${index}`}
              className="rounded-[32px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-white p-[21px] shadow-[0_12px_28px_rgba(8,41,89,0.06)]"
            >
              {metric.value ? <p className="text-2xl tracking-[-0.02em] text-[#0a2546]">{metric.value}</p> : null}
              {metric.label ? <p className="mt-[8px] text-sm text-[#4f6a89]">{metric.label}</p> : null}
              {metric.hint ? <p className="mt-[8px] text-xs text-[#6e84a0]">{metric.hint}</p> : null}
            </article>
          ))}
        </div>
      </div>

      {metrics.slice(2).length > 0 ? (
        <div className="mt-[21px] grid gap-[21px] md:grid-cols-3">
          {metrics.slice(2).map((metric, index) => (
            <article
              key={`${metric.label}-${index}`}
              className="rounded-[30px] corner-squircle border border-[rgba(8,66,153,0.1)] bg-white p-[21px] shadow-[0_10px_24px_rgba(8,41,89,0.05)]"
            >
              <h3 className="text-sm font-medium text-[#0a2546]">{metric.label}</h3>
              <p className="mt-[8px] text-lg text-[#0b4f8c]">{metric.value}</p>
              {metric.hint ? <small className="mt-[8px] block text-xs text-[#6e84a0]">{metric.hint}</small> : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

ProofBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    evidenceText: PropTypes.string,
    afterLabel: PropTypes.string,
    beforeLabel: PropTypes.string,
    trackedMetrics: PropTypes.array,
    artifact: PropTypes.object,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
};
