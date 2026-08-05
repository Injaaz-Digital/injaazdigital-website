'use client';

import { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { CmsImage } from './shared';
import { cn as cx } from '@/lib/utils';
import { asArray, SECTION_CONTAINER, SectionHeader, SectionShell } from './premiumShared';

const PROCESS_TEST_VISUALS = ['/media/image3.png', '/media/image6.png', '/media/image2.png', '/media/image5.png', '/media/image7.png'];

export default function ProcessBlock({ block, locale = 'en' }) {
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

ProcessBlock.propTypes = {
  block: PropTypes.object,
  locale: PropTypes.oneOf(['en', 'ar']),
};
