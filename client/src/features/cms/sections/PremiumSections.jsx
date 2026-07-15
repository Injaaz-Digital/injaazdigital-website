'use client';

import { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, Check, Layers3, MonitorSmartphone, Plus, Rocket, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import Button from '@/shared/ui/Button';
import BlinkingSquares from '@/shared/ui/BlinkingSquares';
import HeroAtmosphere from '@/features/home/components/HeroAtmosphere';
import { CmsImage } from '@/features/cms/blocks/shared';
import cx from '@/lib/utils/cx';

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const asText = (value) => (typeof value === 'string' ? value.trim() : '');
const imageUrl = (keyword = 'premium-digital-studio') =>
  `https://picsum.photos/seed/${encodeURIComponent(keyword)}/1920/1080`;

const SECTION_CONTAINER = 'mx-auto w-[min(1120px,calc(100%_-_2rem))] sm:w-[min(1120px,calc(100%_-_3rem))]';
const PROCESS_TEST_VISUALS = ['/media/image3.png', '/media/image6.png', '/media/image2.png', '/media/image5.png', '/media/image7.png'];
const CTA_PIXEL_CELLS = Array.from({ length: 9 }, (_, index) => index);
const SERVICE_PRESENTATION = Object.freeze({
  'website-build': { href: '/website-development', Icon: MonitorSmartphone, stage: 'website' },
  'growth-dashboard': { href: '/growth-system', Icon: Rocket, stage: 'growth' },
});
const SERVICE_STAGE_LABELS = Object.freeze({
  en: Object.freeze({ growth: 'Attention → Opportunity', website: 'Value → Action' }),
  ar: Object.freeze({ growth: 'الانتباه ← الفرصة', website: 'القيمة ← الإجراء' }),
});

const resolveServicePresentation = (item, index) => {
  const configured = SERVICE_PRESENTATION[asText(item?.iconKey || item?.icon)];
  if (configured) return configured;

  return index === 0
    ? SERVICE_PRESENTATION['website-build']
    : index === 1
      ? SERVICE_PRESENTATION['growth-dashboard']
      : SERVICE_PRESENTATION['website-build'];
};

const resolveServiceHref = (item, fallbackHref) => asText(item?.primaryCtaHref || item?.url) || fallbackHref;

function SectionShell({ children, className = '', tone = 'plain', id }) {
  return (
    <section
      id={id}
      className={cx(
        'relative isolate overflow-hidden py-12 sm:py-16 lg:py-20',
        tone === 'blue' && 'bg-[#0b1728] text-white',
        className
      )}
    >
      {children}
    </section>
  );
}

SectionShell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tone: PropTypes.oneOf(['plain', 'soft', 'blue']),
  id: PropTypes.string,
};

function CtaLink({ cta, onNavigate }) {
  const href = asText(cta?.url);
  const label = asText(cta?.label);

  if (!href || !label) return null;

  const handleClick = () => {
    if (cta?.isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (onNavigate) {
      onNavigate(href);
      return;
    }

    window.location.assign(href);
  };

  return (
    <Button variant={cta?.style === 'secondary' ? 'outline' : 'primary'} size="lg" onClick={handleClick}>
      {label}
    </Button>
  );
}

CtaLink.propTypes = {
  cta: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
    style: PropTypes.string,
    isExternal: PropTypes.bool,
  }),
  onNavigate: PropTypes.func,
};

function SectionHeader({ heading, description, align = 'left', inverse = false, eyebrow }) {
  return (
    <div className={cx('max-w-[48rem]', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? (
        <p className={cx('mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em]', inverse ? 'text-[#c8d3df]' : 'text-[#35628f]')}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cx(
          'section-title max-w-[25ch] !text-[clamp(1.75rem,3vw,2.75rem)] !leading-[1.08] !tracking-[-0.024em]',
          align === 'center' && 'section-title--center mx-auto',
          inverse && '!text-[#f6f8fa]'
        )}
      >
        {heading}
      </h2>
      {description ? (
        <p className={cx('mt-4 max-w-[58ch] text-[0.95rem] leading-7 sm:text-base', align === 'center' && 'mx-auto', inverse ? 'text-[#c8d3df]' : 'text-[#53677c]')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

SectionHeader.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
  inverse: PropTypes.bool,
  eyebrow: PropTypes.string,
};

function HeroTitle({ title, imageKeyword }) {
  const words = asText(title).split(' ').filter(Boolean);
  const insertAt = Math.min(3, Math.max(1, Math.floor(words.length / 3)));

  if (!words.length) return null;

  return (
    <h1 className="hero-title-plain mx-auto mt-3 w-full max-w-7xl max-sm:max-w-[calc(100vw-2rem)] text-center lg:mt-5">
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index === insertAt ? (
            <span
              className="mx-2 inline-block h-[0.58em] w-[1.32em] overflow-hidden rounded-full align-middle shadow-[0_0_0_1px_rgba(8,66,153,0.14)] max-sm:hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(6,10,13,0.04),rgba(6,10,13,0.28)),url(${imageUrl(imageKeyword)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(0.2) contrast(1.18)',
              }}
              aria-hidden="true"
            />
          ) : null}
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  );
}

HeroTitle.propTypes = {
  title: PropTypes.string,
  imageKeyword: PropTypes.string,
};

export function SectionHero({ block, onNavigate }) {
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

SectionHero.propTypes = {
  block: PropTypes.object,
  onNavigate: PropTypes.func,
};

export function ServiceOverviewSection({ block, locale = 'en', onNavigate }) {
  const services = asArray(block?.services)
    .filter((item) => item?.isActive !== false && item?.featuredOnHomepage !== false)
    .sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0));
  const stageLabels = SERVICE_STAGE_LABELS[locale] || SERVICE_STAGE_LABELS.en;

  return (
    <SectionShell id="services">
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'What we build'} heading={block?.heading} description={block?.description} />
          <div className="overflow-hidden rounded-[20px] border border-[#d9e1e8] bg-white/78">
            {services.map((item, index) => {
              const { href: fallbackHref, Icon, stage } = resolveServicePresentation(item, index);
              const href = resolveServiceHref(item, fallbackHref);
              return (
                <a
                  key={`${item.slug || item.title || item.name}-${index}`}
                  href={href}
                  onClick={(event) => {
                    if (!onNavigate) return;
                    event.preventDefault();
                    onNavigate(href);
                  }}
                  className="group grid gap-5 border-b border-[#d9e1e8] p-5 transition-colors duration-200 last:border-b-0 hover:bg-[#f7fafc] sm:grid-cols-[48px_1fr_auto] sm:items-start sm:p-6"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] border border-[#cddbe8] bg-[#f4f8fb] text-[#084299]" aria-hidden="true">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="mb-2 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-[#6d85a1]">{stageLabels[stage]}</p>
                    <h3 className="premium-geist text-lg font-semibold tracking-[-0.018em] text-[#111820] sm:text-xl">{item.title || item.name}</h3>
                    {(item.description || item.shortDescription) ? <p className="mt-2 max-w-[58ch] text-sm leading-6 text-[#5a6b7b] sm:text-[0.94rem]">{item.description || item.shortDescription}</p> : null}
                    {item.positioningLine ? <p className="mt-3 max-w-[60ch] text-sm leading-6 text-[#334f6d]">{item.positioningLine}</p> : null}
                    {item.outcome ? <p className="mt-3 text-sm font-semibold text-[#173b66]">{locale === 'ar' ? 'النتيجة' : 'Outcome'}: {item.outcome}</p> : null}
                    {Array.isArray(item.flowSteps) && item.flowSteps.length ? <p className="mt-3 text-xs font-medium leading-5 text-[#1685a1]">{item.flowSteps.map((entry) => entry.stepTitle).join(' → ')}</p> : null}
                    {item.capabilities && !Array.isArray(item.capabilities) ? <p className="mt-2 text-xs leading-5 text-[#718196]">{item.capabilities}</p> : null}
                    {(item.ctaLabel || item.primaryCtaLabel) ? <span className="sr-only">{item.ctaLabel || item.primaryCtaLabel}</span> : null}
                  </div>
                  <span className="hidden h-9 w-9 place-items-center rounded-full border border-[#d5dee7] text-[#084299] transition-[background-color,color,transform] duration-200 group-hover:translate-x-0.5 group-hover:bg-[#084299] group-hover:text-white sm:grid">
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

ServiceOverviewSection.propTypes = {
  block: PropTypes.object,
  locale: PropTypes.oneOf(['en', 'ar']),
  onNavigate: PropTypes.func,
};

export function ProblemSection({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell tone="soft">
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'Where momentum gets lost'} heading={block?.heading} description={block?.description} />
          <div className="border-t border-[#cfd9e2]">
            {items.map((item, index) => (
              <article key={`${item.title}-${index}`} className="grid gap-2 border-b border-[#dce3e9] py-5 sm:grid-cols-[0.68fr_1.32fr] sm:gap-8 sm:py-6">
                <h3 className="premium-geist text-base font-semibold tracking-[-0.012em] text-[#111820] sm:text-lg">{item.title}</h3>
                {item.description ? <p className="text-sm leading-6 text-[#596a7a] sm:text-[0.94rem]">{item.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

ProblemSection.propTypes = { block: PropTypes.object };

export function FeatureListSection({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell>
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'Built into the system'} heading={block?.heading} description={block?.description} />
          <div className="grid gap-x-8 border-t border-[#cfd9e2] sm:grid-cols-2">
          {items.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border-b border-[#dce3e9] py-5 sm:py-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#edf4f8] text-[#084299]">
                  {index % 3 === 0 ? <Layers3 className="h-4 w-4" aria-hidden="true" /> : index % 3 === 1 ? <Sparkles className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
                </span>
                <div>
                  <h3 className="premium-geist text-base font-semibold tracking-[-0.012em] text-[#111820] sm:text-lg">{item.title}</h3>
                  {item.description ? <p className="mt-2 text-sm leading-6 text-[#596a7a]">{item.description}</p> : null}
                </div>
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

FeatureListSection.propTypes = { block: PropTypes.object };

export function ProcessSection({ block, locale = 'en' }) {
  const steps = asArray(block?.steps);
  const [activeIndex, setActiveIndex] = useState(0);
  const processId = useId();
  const panelRef = useRef(null);
  const copyRef = useRef(null);
  const imageRef = useRef(null);
  const imageFrameRef = useRef(null);
  const isArabic = locale === 'ar';
  const safeActiveIndex = Math.min(activeIndex, Math.max(steps.length - 1, 0));
  const activeStep = steps[safeActiveIndex];
  const fallbackVisual = PROCESS_TEST_VISUALS[safeActiveIndex % PROCESS_TEST_VISUALS.length];
  const tabId = (index) => `${processId}-tab-${index}`;
  const panelId = (index) => `${processId}-panel-${index}`;
  const localizedUiFont = isArabic
    ? '[font-family:var(--font-rtl)] tracking-normal'
    : 'premium-geist';

  const activateStep = (nextIndex) => {
    if (nextIndex === safeActiveIndex || nextIndex < 0 || nextIndex >= steps.length) return;
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    const panel = panelRef.current;
    const copy = copyRef.current;
    const image = imageRef.current;
    const frame = imageFrameRef.current;
    if (!panel || !copy || !image || !frame) return undefined;

    const copyChildren = Array.from(copy.children);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([...copyChildren, image, frame], { clearProps: 'all' });
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
      timeline
        .fromTo(
          copyChildren,
          { opacity: 0, y: 28, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.72, stagger: 0.07 },
          0.08
        )
        .fromTo(
          image,
          { opacity: 0, scale: 1.1, xPercent: isArabic ? -4 : 4, rotate: isArabic ? -0.35 : 0.35 },
          { opacity: 1, scale: 1, xPercent: 0, rotate: 0, duration: 1.05 },
          0
        )
        .fromTo(frame, { opacity: 0, scale: 0.965 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.14);
    }, panel);

    return () => context.revert();
  }, [isArabic, safeActiveIndex]);

  if (block?.variant === 'editorial') {
    return (
      <SectionShell tone="soft" id="process" className="!py-20 sm:!py-28 lg:!py-32">
        <div className={SECTION_CONTAINER}>
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <SectionHeader eyebrow={block?.eyebrow || 'How the work moves'} heading={block?.heading} description={block?.description} />
            <ol className="border-t border-[#c9d6df]">
              {steps.map((entry, index) => (
                <li key={`${entry.stepTitle}-${index}`} className="grid gap-3 border-b border-[#d5dfe6] py-5 sm:grid-cols-[2.5rem_0.7fr_1.3fr] sm:gap-6 sm:py-6">
                  <span className="text-xs font-semibold text-[#1685a1]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className={cx('premium-geist text-lg font-semibold tracking-[-0.018em] text-[#13263d]', isArabic && '[font-family:var(--font-rtl)]')}>{entry.stepTitle}</h3>
                  <p className="text-sm leading-6 text-[#596b7c]">{entry.deliverables}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </SectionShell>
    );
  }

  const selectAdjacentStep = (event, index) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = steps.length - 1;
    if (event.key === 'ArrowDown' || (event.key === 'ArrowRight' && !isArabic) || (event.key === 'ArrowLeft' && isArabic)) {
      nextIndex = (index + 1) % steps.length;
    }
    if (event.key === 'ArrowUp' || (event.key === 'ArrowLeft' && !isArabic) || (event.key === 'ArrowRight' && isArabic)) {
      nextIndex = (index - 1 + steps.length) % steps.length;
    }
    activateStep(nextIndex);
  };

  if (!activeStep) return null;

  return (
    <SectionShell tone="soft" id="process">
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-10">
          <SectionHeader eyebrow={block?.eyebrow || 'How the work moves'} heading={block?.heading} />
          {block?.description ? <p className="max-w-[54ch] text-[0.95rem] leading-6 text-[#53677c] lg:justify-self-end">{block.description}</p> : null}
        </div>

        <div className="corner-squircle mt-6 overflow-hidden rounded-[30px] border border-[rgba(8,66,153,0.08)] bg-white/88 p-2 shadow-[0_18px_48px_rgba(15,51,96,0.07)] sm:mt-7 sm:p-3 lg:mt-8">
          <div className="grid gap-2 lg:grid-cols-[210px_minmax(0,1fr)]">
            <div
              className="corner-squircle flex gap-1.5 overflow-x-auto rounded-[24px] border border-[rgba(15,51,96,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(243,248,255,0.88))] p-1.5 lg:flex-col lg:overflow-visible"
              role="tablist"
              aria-label={isArabic ? 'خطوات العملية' : 'Process steps'}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {steps.map((step, index) => {
                const isActive = index === safeActiveIndex;
                return (
                  <button
                    key={`${step.stepTitle}-${index}`}
                    type="button"
                    role="tab"
                    id={tabId(index)}
                    aria-selected={isActive}
                    aria-controls={panelId(index)}
                    tabIndex={isActive ? 0 : -1}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') activateStep(index);
                    }}
                    onPointerDown={(event) => {
                      if (event.pointerType !== 'mouse') activateStep(index);
                    }}
                    onFocus={() => activateStep(index)}
                    onKeyDown={(event) => selectAdjacentStep(event, index)}
                    className={cx(
                      'corner-squircle group relative min-w-[144px] overflow-hidden rounded-[19px] border px-4 py-3 text-start transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28aec3]/35 focus-visible:ring-offset-1 lg:min-w-0',
                      isActive
                        ? 'border-[rgba(8,66,153,0.12)] bg-white text-[#0f3360] shadow-[0_8px_20px_rgba(15,51,96,0.08)]'
                        : 'border-transparent text-[#6d85a1] hover:-translate-y-px hover:border-[rgba(8,66,153,0.1)] hover:bg-white/82 hover:text-[#0f3360] lg:hover:translate-x-0.5 lg:rtl:hover:-translate-x-0.5'
                    )}
                  >
                    <span
                      className={cx(
                        'absolute inset-y-3 start-0 w-0.5 rounded-full bg-[#28aec3] transition-opacity duration-200',
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                      )}
                      aria-hidden="true"
                    />
                    <span className={cx('block text-[0.63rem] font-semibold uppercase text-current/65', isArabic ? 'tracking-normal' : 'tracking-[0.14em]')}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={cx('mt-1.5 block text-sm font-semibold leading-5 sm:text-[0.95rem]', localizedUiFont)}>{step.stepTitle}</span>
                  </button>
                );
              })}
            </div>

            <div
              ref={panelRef}
              className="corner-squircle relative min-h-[440px] overflow-hidden rounded-[26px] border border-[rgba(15,51,96,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(243,248,255,0.9))] sm:min-h-[410px]"
            >
                <div
                  id={panelId(safeActiveIndex)}
                  role="tabpanel"
                  aria-labelledby={tabId(safeActiveIndex)}
                  className="absolute inset-0 grid lg:grid-cols-[0.82fr_1.18fr]"
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  <div ref={copyRef} className="relative z-10 flex flex-col justify-between bg-white/64 p-6 text-[#0f3360] sm:p-7 lg:p-8">
                    <div>
                      <span className={cx('text-[0.67rem] font-semibold uppercase text-[#6d85a1]', isArabic ? '[font-family:var(--font-rtl)] tracking-normal' : 'tracking-[0.16em]')}>
                        {activeStep.timeframe || (isArabic ? `الخطوة ${safeActiveIndex + 1}` : `Step ${safeActiveIndex + 1}`)}
                      </span>
                      <h3 className={cx('mt-3 max-w-[18ch] text-[1.75rem] font-semibold leading-[1.08] sm:text-[2.15rem]', isArabic ? '[font-family:var(--font-rtl)] tracking-normal' : 'premium-geist tracking-[-0.03em]')}>
                        {activeStep.stepTitle}
                      </h3>
                      {activeStep.deliverables ? <p className={cx('mt-3 max-w-[40ch] text-sm leading-6 text-[#4f6a89] sm:text-[0.95rem]', isArabic && '[font-family:var(--font-rtl)]')}>{activeStep.deliverables}</p> : null}
                    </div>
                    {activeStep.successCriteria ? (
                      <p className={cx('mt-6 border-t border-[rgba(8,66,153,0.09)] pt-4 text-xs font-semibold uppercase text-[#1685a1]', isArabic ? '[font-family:var(--font-rtl)] tracking-normal' : 'tracking-[0.1em]')}>
                        {activeStep.successCriteria}
                      </p>
                    ) : null}
                  </div>

                  <div className="relative min-h-[220px] overflow-hidden lg:min-h-0">
                    <div ref={imageRef} className="absolute inset-0">
                      <CmsImage
                        media={activeStep.visual || activeStep.media || activeStep.image}
                        src={fallbackVisual}
                        alt={activeStep.stepTitle || 'Process stage'}
                        width={960}
                        height={720}
                        sizes="(min-width: 1024px) 52vw, 100vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div
                      className={cx(
                        'pointer-events-none absolute inset-0',
                        isArabic
                          ? 'bg-[linear-gradient(270deg,rgba(243,248,255,0.96)_0%,rgba(243,248,255,0.3)_38%,rgba(243,248,255,0.02)_100%)]'
                          : 'bg-[linear-gradient(90deg,rgba(243,248,255,0.96)_0%,rgba(243,248,255,0.3)_38%,rgba(243,248,255,0.02)_100%)]'
                      )}
                      aria-hidden="true"
                    />
                    <div ref={imageFrameRef} className="corner-squircle pointer-events-none absolute inset-3 rounded-[24px] border border-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" aria-hidden="true" />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

ProcessSection.propTypes = {
  block: PropTypes.object,
  locale: PropTypes.oneOf(['en', 'ar']),
};

export function OutcomesSection({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell>
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'What changes'} heading={block?.heading} description={block?.description} />
          <div className="overflow-hidden rounded-[20px] border border-[#d5dee6] bg-white/72 md:grid md:grid-cols-3">
            {items.map((item, index) => (
              <article key={`${item.label}-${index}`} className="border-b border-[#dce3e9] p-5 last:border-b-0 sm:p-6 md:min-h-[190px] md:border-b-0 md:border-r md:last:border-r-0">
                <p className="premium-geist text-2xl font-semibold leading-none tracking-[-0.03em] text-[#111820] sm:text-3xl">{item.value}</p>
                <h3 className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#35628f]">{item.label}</h3>
                {item.hint ? <p className="mt-3 max-w-[30ch] text-sm leading-6 text-[#5b6c7c]">{item.hint}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

OutcomesSection.propTypes = { block: PropTypes.object };

export function FaqSection({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell tone="soft">
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'Questions, answered'} heading={block?.heading} description={block?.description} />
          <div className="border-t border-[#cfd9e2]">
            {items.map((item, index) => (
              <details key={`${item.question}-${index}`} className="group border-b border-[#dce3e9] py-5 sm:py-6">
                <summary className="premium-geist flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold tracking-[-0.012em] text-[#111820] [&::-webkit-details-marker]:hidden sm:text-lg">
                  <span>{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d5dee7] text-[#084299]">
                    <Plus className="h-4 w-4 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                  </span>
                </summary>
                <p className="mt-3 max-w-[64ch] pb-1 text-sm leading-6 text-[#5b6c7c] sm:text-[0.94rem]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

FaqSection.propTypes = { block: PropTypes.object };

export function FinalCtaSection({ block, onNavigate }) {
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

FinalCtaSection.propTypes = {
  block: PropTypes.object,
  onNavigate: PropTypes.func,
};

export function UnknownSection() {
  return null;
}
