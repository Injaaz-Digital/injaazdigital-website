import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BLOCK_SECTION_IDS, CmsLinkButton } from './shared';

const STEP_SPLITTER = /[\n|]+/;
const CHIP_TEXT_MAX_LENGTH = 44;

const toText = (value) => (typeof value === 'string' ? value.trim() : '');

const toStepNumber = (index) => String(index + 1).padStart(2, '0');

const parseStepHighlights = (value) => {
  const text = toText(value);
  if (!text) return [];

  const delimiterTokens = text
    .split(STEP_SPLITTER)
    .map((item) => item.trim())
    .filter(Boolean);

  if (delimiterTokens.length > 1) {
    return delimiterTokens;
  }

  const commaTokens = text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (commaTokens.length > 1 && commaTokens.every((item) => item.length <= CHIP_TEXT_MAX_LENGTH)) {
    return commaTokens;
  }

  return [text];
};

const isChipRow = (items) => {
  if (!Array.isArray(items) || items.length === 0) return false;
  if (items.length > 1) return true;
  return items[0].length <= CHIP_TEXT_MAX_LENGTH;
};

export default function ProcessBlock({ block, locale, onNavigate }) {
  const sectionId = BLOCK_SECTION_IDS[block.__component] || BLOCK_SECTION_IDS['blocks.process-timeline'];
  const steps = Array.isArray(block.steps) ? block.steps.filter(Boolean) : [];
  const triggerRefs = useRef([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const clampedActiveStepIndex = Math.min(Math.max(activeStepIndex, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[clampedActiveStepIndex] || null;
  const activeHighlights = useMemo(() => parseStepHighlights(activeStep?.successCriteria), [activeStep?.successCriteria]);
  const activeHasChipRow = isChipRow(activeHighlights);
  const progressPercent = steps.length ? Math.round(((clampedActiveStepIndex + 1) / steps.length) * 100) : 0;
  const stepLabel = locale === 'ar' ? 'المرحلة' : 'Phase';

  useEffect(() => {
    setActiveStepIndex((current) => Math.min(current, Math.max(steps.length - 1, 0)));
    triggerRefs.current = triggerRefs.current.slice(0, steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (steps.length <= 1 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const targets = triggerRefs.current.filter(Boolean);
    if (targets.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const stepIndex = Number.parseInt(entry.target.getAttribute('data-step-index') || '', 10);
          if (Number.isFinite(stepIndex)) {
            setActiveStepIndex(stepIndex);
          }
        });
      },
      {
        threshold: 0.58,
        rootMargin: '-32% 0px -32% 0px',
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [steps.length]);

  const jumpToStep = (index) => {
    const boundedIndex = Math.min(Math.max(index, 0), steps.length - 1);
    setActiveStepIndex(boundedIndex);

    const target = triggerRefs.current[boundedIndex];
    if (target?.scrollIntoView) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="section section--process-scroll" id={sectionId}>
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

      <div className={`layout-content-flow mt-8.5 process-scroll-shell ${steps.length === 1 ? 'process-scroll-shell--single' : ''}`}>
        <article className="process-scroll-stage" aria-live="polite">
          <div className="process-scroll-stage__step-top">
            <div className="process-scroll-stage__step-chip">{toStepNumber(clampedActiveStepIndex)}</div>
            <p className="process-scroll-stage__step-label">{stepLabel}</p>
          </div>

          {activeStep?.stepTitle ? <h3 className="process-scroll-stage__title">{activeStep.stepTitle}</h3> : null}
          {activeStep?.deliverables ? <p className="process-scroll-stage__lead">{activeStep.deliverables}</p> : null}

          {activeHighlights.length > 0 ? (
            activeHasChipRow ? (
              <div className="process-scroll-stage__chips" role="list" aria-label={locale === 'ar' ? 'تفاصيل المرحلة' : 'Step highlights'}>
                {activeHighlights.map((item, index) => (
                  <span key={`active-highlight-${index}-${item}`} className="process-scroll-stage__chip" role="listitem">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="process-scroll-stage__note">{activeHighlights[0]}</p>
            )
          ) : null}

          {block.primaryCta ? (
            <CmsLinkButton
              link={block.primaryCta}
              onNavigate={onNavigate}
              className="process-scroll-stage__cta h-12 rounded-[28px] px-8 text-sm bg-brand-gradient border-transparent text-white shadow-[0_22px_42px_rgba(16,88,203,0.22)] font-semibold"
            />
          ) : null}

          <div className="process-scroll-stage__footer">
            <div className="process-scroll-stage__progress" aria-hidden="true">
              <div className="process-scroll-stage__progress-track">
                <span className="process-scroll-stage__progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="process-scroll-stage__counter">
                {toStepNumber(clampedActiveStepIndex)} / {toStepNumber(steps.length)}
              </p>
            </div>

            <div className="process-scroll-stage__dots" role="group" aria-label={locale === 'ar' ? 'التنقل بين المراحل' : 'Step navigation'}>
              {steps.map((step, index) => {
                const isActive = index === clampedActiveStepIndex;

                return (
                  <button
                    key={`${step.stepTitle || 'step-dot'}-${index}`}
                    type="button"
                    className={`process-scroll-stage__dot ${isActive ? 'is-active' : ''}`}
                    aria-label={`${locale === 'ar' ? 'انتقل إلى المرحلة' : 'Go to step'} ${toStepNumber(index)}`}
                    aria-pressed={isActive}
                    onClick={() => jumpToStep(index)}
                  />
                );
              })}
            </div>
          </div>
        </article>

        {steps.length > 1 ? (
          <div className="process-scroll-observers" aria-hidden="true">
            {steps.map((step, index) => (
              <div
                key={`${step.stepTitle || 'observer-step'}-${index}`}
                ref={(node) => {
                  triggerRefs.current[index] = node;
                }}
                data-step-index={index}
                className={`process-scroll-trigger ${index === clampedActiveStepIndex ? 'is-active' : ''}`}
              >
                <span className="process-scroll-trigger__line" />
                <span className="process-scroll-trigger__dot" />
                <span className="process-scroll-trigger__index">{toStepNumber(index)}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="process-scroll-mobile">
          {steps.map((step, index) => {
            const highlights = parseStepHighlights(step.successCriteria);
            const showChipRow = isChipRow(highlights);

            return (
              <article
                key={`${step.stepTitle || 'mobile-step'}-${index}`}
                className="process-scroll-mobile__card"
              >
                <div className="process-scroll-mobile__header">
                  <p className="process-scroll-mobile__index">{toStepNumber(index)}</p>
                  {step.timeframe ? <p className="process-scroll-mobile__timeframe">{step.timeframe}</p> : null}
                </div>

                {step.stepTitle ? <h3 className="process-scroll-mobile__title">{step.stepTitle}</h3> : null}
                {step.deliverables ? <p className="process-scroll-mobile__lead">{step.deliverables}</p> : null}

                {highlights.length > 0 ? (
                  showChipRow ? (
                    <div className="process-scroll-mobile__chips" role="list" aria-label={locale === 'ar' ? 'تفاصيل المرحلة' : 'Step highlights'}>
                      {highlights.map((item, highlightIndex) => (
                        <span key={`${item}-${highlightIndex}`} className="process-scroll-mobile__chip" role="listitem">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="process-scroll-mobile__note">{highlights[0]}</p>
                  )
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

ProcessBlock.propTypes = {
  block: PropTypes.shape({
    __component: PropTypes.string,
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    steps: PropTypes.array,
    primaryCta: PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
      style: PropTypes.string,
      isExternal: PropTypes.bool,
    }),
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
  onNavigate: PropTypes.func,
};
