import PropTypes from 'prop-types';
import { CmsLinkButton } from './shared';

const DEFAULT_STATS = [
  { value: '$48.2K', label: 'Pipeline', hint: '+12% vs last month' },
  { value: '3.84%', label: 'CVR', hint: 'Landing to booked call' },
  { value: '126', label: 'Qualified leads', hint: 'Last 30 days' },
  { value: '19', label: 'Closed deals', hint: 'Tracked in CRM' },
];

const DEFAULT_INSIGHTS = [
  { title: 'Top segment', description: 'Service brands with structured offers are converting the fastest.' },
  { title: 'Best channel', description: 'Founder-led organic traffic produces the strongest close rate.' },
  { title: 'Next move', description: 'Tighten proof near CTA moments and shorten the booking path.' },
];

const CHART_BAR_HEIGHTS = [42, 58, 76, 62, 94, 72, 116, 88, 134, 104, 148, 118];

export default function DashboardShowcaseBlock({ block, locale, onNavigate }) {
  const isArabic = locale === 'ar';
  const stats = Array.isArray(block.stats) && block.stats.length > 0 ? block.stats.filter(Boolean).slice(0, 4) : DEFAULT_STATS;
  const insights =
    Array.isArray(block.insights) && block.insights.length > 0 ? block.insights.filter(Boolean).slice(0, 4) : DEFAULT_INSIGHTS;

  return (
    <section className="section">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
        <div className={isArabic ? 'text-right' : 'text-left'}>
          <div className="section-head" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
            {block.badge ? <p className="section-head-kicker">{block.badge}</p> : null}
            {block.heading ? (
              <h2 className="section-title">
                {block.heading}
              </h2>
            ) : null}
            {block.description ? <p className="section-head-lead">{block.description}</p> : null}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CmsLinkButton link={block.primaryCta} onNavigate={onNavigate} size="lg" />
            <CmsLinkButton link={block.secondaryCta} onNavigate={onNavigate} size="lg" />
          </div>

          {insights.length > 0 ? (
            <div className="mt-8 grid gap-3">
              {insights.map((item, index) => (
                <article
                  key={`${item.title || 'insight'}-${index}`}
                  className="rounded-[30px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-white/88 p-5 shadow-[0_18px_44px_rgba(8,41,89,0.06)] backdrop-blur-sm"
                >
                  {item.title ? <h3 className="text-[0.95rem] font-semibold text-[#0a2546]">{item.title}</h3> : null}
                  {item.description ? <p className="mt-2 text-sm leading-7 text-[#5b7694]">{item.description}</p> : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-x-[14%] top-[7%] h-[76%] rounded-full bg-[radial-gradient(circle,rgba(94,158,255,0.2),rgba(94,158,255,0))] blur-3xl" />

          <div className="relative overflow-hidden rounded-[44px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-[linear-gradient(180deg,#fbfdff_0%,#eef5ff_100%)] p-4 shadow-[0_32px_90px_rgba(8,41,89,0.12)] sm:p-6">
            <div className="flex items-center justify-between rounded-[32px] corner-squircle border border-white/70 bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(8,41,89,0.05)] backdrop-blur-sm">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[#7b92ae]">
                  {block.chartLabel || (isArabic ? 'أداء الإيرادات' : 'Revenue performance')}
                </p>
                <p className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#0a2546]">
                  {block.chartValue || (isArabic ? '١٢٨ ألف دولار' : '$128K')}
                </p>
              </div>
              <div className="rounded-full bg-[#e8f4ff] px-3 py-2 text-sm font-semibold text-[#0b5da8]">
                {block.chartDelta || (isArabic ? '+١٨٪ هذا الشهر' : '+18% this month')}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <article
                  key={`${stat.label || 'stat'}-${index}`}
                  className="rounded-[34px] corner-squircle border border-[rgba(8,66,153,0.1)] bg-white/86 p-4 shadow-[0_14px_30px_rgba(8,41,89,0.06)]"
                >
                  {stat.label ? <p className="text-sm text-[#607b98]">{stat.label}</p> : null}
                  {stat.value ? <p className="mt-2 text-[1.45rem] font-semibold tracking-[-0.03em] text-[#0a2546]">{stat.value}</p> : null}
                  {stat.hint ? <p className="mt-2 text-xs text-[#0b5da8]">{stat.hint}</p> : null}
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-[38px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-[#0d2038] p-5 text-white shadow-[0_26px_50px_rgba(10,28,52,0.3)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-white/58">
                    {isArabic ? 'نظرة القمع' : 'Funnel snapshot'}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                    {isArabic ? 'التدفق يتحسن أسبوعًا بعد أسبوع' : 'Healthy flow across acquisition and close'}
                  </p>
                </div>
                <div className="hidden rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-sm text-white/78 sm:block">
                  {isArabic ? 'آخر 30 يومًا' : 'Last 30 days'}
                </div>
              </div>

              <div className="mt-6 flex h-[180px] items-end gap-2 rounded-[32px] corner-squircle border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-4">
                {CHART_BAR_HEIGHTS.map((height, index) => (
                  <div key={`bar-${index}`} className="flex flex-1 items-end">
                    <div
                      className={`w-full rounded-t-[14px] bg-gradient-to-t ${
                        index >= CHART_BAR_HEIGHTS.length - 3 ? 'from-[#7dd3fc] via-[#5ea0ff] to-[#d9eeff]' : 'from-[#17385c] via-[#316da5] to-[#9ad0ff]'
                      } shadow-[0_10px_28px_rgba(94,160,255,0.24)]`}
                      style={{ height }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-white/54">
                <span>{isArabic ? 'الزيارات' : 'Traffic'}</span>
                <span>{isArabic ? 'التحويلات' : 'Conversions'}</span>
                <span>{isArabic ? 'الإغلاق' : 'Closed deals'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

DashboardShowcaseBlock.propTypes = {
  block: PropTypes.shape({
    badge: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    chartLabel: PropTypes.string,
    chartValue: PropTypes.string,
    chartDelta: PropTypes.string,
    stats: PropTypes.array,
    insights: PropTypes.array,
    primaryCta: PropTypes.object,
    secondaryCta: PropTypes.object,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
  onNavigate: PropTypes.func,
};
