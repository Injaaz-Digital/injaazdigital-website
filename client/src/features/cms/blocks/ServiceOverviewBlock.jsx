import PropTypes from 'prop-types';
import { ArrowRight, MonitorSmartphone, Rocket } from 'lucide-react';
import { asArray, asText, SECTION_CONTAINER, SectionHeader, SectionShell } from './premiumShared';

const SERVICE_PRESENTATION = Object.freeze({
  'website-build': { href: '/website-development', Icon: MonitorSmartphone, stage: 'website' },
  'growth-dashboard': { href: '/growth-system', Icon: Rocket, stage: 'growth' },
});
const SERVICE_STAGE_LABELS = Object.freeze({
  en: Object.freeze({ growth: 'Attention → Opportunity', website: 'Value → Action' }),
  ar: Object.freeze({ growth: 'الانتباه ← الفرصة', website: 'القيمة ← الإجراء' }),
});

const resolveServicePresentation = (item) => {
  const key = asText(item?.iconKey || item?.icon);
  return key ? SERVICE_PRESENTATION[key] || null : null;
};

const resolveServiceHref = (item, fallbackHref) => asText(item?.primaryCtaHref || item?.url) || fallbackHref;

export default function ServiceOverviewBlock({ block, locale = 'en' }) {
  const services = asArray(block?.services)
    .filter((item) => item?.isActive !== false)
    .sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0));
  const stageLabels = SERVICE_STAGE_LABELS[locale] || SERVICE_STAGE_LABELS.en;

  return (
    <SectionShell id="services">
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'What we build'} heading={block?.heading} description={block?.description} />
          <div className="space-y-4">
            {services.map((item, index) => {
              const presentation = resolveServicePresentation(item);
              const href = resolveServiceHref(item, asText(item?.url));
              const Container = href ? 'a' : 'div';
              return (
                <Container
                  key={`${item.slug || item.title || item.name}-${index}`}
                  {...(href ? { href } : {})}
                  className="group grid gap-5 rounded-[24px] corner-squircle border border-[#d9e1e8] p-5 transition-all duration-200 hover:border-[#c0cbd8] hover:shadow-[0_4px_20px_rgba(8,52,106,0.06)] sm:grid-cols-[48px_1fr_auto] sm:p-6"
                >
                  {presentation?.Icon ? (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-[#cddbe8] bg-[#f4f8fb] text-[#084299]" aria-hidden="true">
                      <presentation.Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    {presentation?.stage ? <p className="mb-2 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-[#6d85a1]">{stageLabels[presentation.stage]}</p> : null}
                    <h3 className="premium-geist text-lg font-semibold tracking-[-0.018em] text-[#111820] sm:text-xl">{item.title || item.name}</h3>
                    {(item.description || item.shortDescription) ? <p className="mt-2 max-w-[58ch] text-sm leading-6 text-[#5a6b7b] sm:text-[0.94rem]">{item.description || item.shortDescription}</p> : null}
                    {item.outcome ? <p className="mt-3 text-sm font-semibold text-[#084299]">{locale === 'ar' ? 'النتيجة' : 'Outcome'}: {item.outcome}</p> : null}
                  </div>
                  {href ? (
                    <span className="hidden h-9 w-9 shrink-0 place-items-center self-center rounded-full border border-[#d5dee7] text-[#084299] transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-[#084299] group-hover:text-white sm:grid">
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    </span>
                  ) : null}
                </Container>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

ServiceOverviewBlock.propTypes = {
  block: PropTypes.object,
  locale: PropTypes.oneOf(['en', 'ar']),
};
