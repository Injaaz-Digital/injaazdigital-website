'use client';

import PropTypes from 'prop-types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { normalizeMedia } from '@/lib/strapi/utils';

const TEAM_ROTATIONS = ['-rotate-[18deg]', '-rotate-[8deg]', '-rotate-[8deg]', 'rotate-[14deg]'];
const ARROW_LEFT = 'https://framerusercontent.com/images/Hddb7FGJrprcMZL6EkXlU.svg?width=40&height=40';
const ARROW_RIGHT = 'https://framerusercontent.com/images/SpTIaJGhdCSnpARS0wLIF3JtUA.svg?width=40&height=40';

const asText = (value) => (typeof value === 'string' ? value.trim() : '');
const asCollection = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value && typeof value === 'object') return [value];
  return [];
};

const normalizeCmsLink = (link) => {
  if (!link || typeof link !== 'object') return null;

  const label = asText(link.label);
  const url = asText(link.url);
  if (!label || !url) return null;

  return {
    ...link,
    label,
    url,
    isExternal: link.isExternal === true || /^https?:\/\//i.test(url),
  };
};

const parsePercentage = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;

  const matched = value.match(/-?\d+(\.\d+)?/);
  if (!matched) return null;

  const parsed = Number.parseFloat(matched[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

const clampPercent = (value) => Math.max(0, Math.min(100, value));

function MetricRing({ value, label, size, index }) {
  const prefersReducedMotion = useReducedMotion();
  const parsedValue = parsePercentage(value);
  const progress = parsedValue === null ? 0 : clampPercent(parsedValue);
  const displayValue = parsedValue === null ? String(value || '') : `${Math.round(progress)}%`;
  if (!label && !displayValue) return null;

  const radius = 47;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <motion.div
      className="grid justify-items-center gap-2"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative grid place-items-center overflow-hidden rounded-full bg-[rgba(8,66,153,0.12)]"
        style={{ width: `clamp(58px, 22vw, ${size}px)`, height: `clamp(58px, 22vw, ${size}px)` }}
      >
        <svg width="100%" height="100%" viewBox="0 0 108 108" className="-rotate-90">
          <circle cx="54" cy="54" r={radius} fill="none" stroke="rgba(8,66,153,0.24)" strokeWidth="6" />
          <motion.circle
            cx="54"
            cy="54"
            r={radius}
            fill="none"
            stroke="#0b5da8"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: prefersReducedMotion ? offset : circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.05, delay: 0.12 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <motion.span
          className="absolute text-[clamp(15px,1.35vw,30px)] font-medium tracking-[-0.01em] text-[#060612]"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.24 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {displayValue}
        </motion.span>
      </div>
      {label ? <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-[#69686e]">{label}</p> : null}
    </motion.div>
  );
}

MetricRing.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string,
  size: PropTypes.number,
  index: PropTypes.number,
};

MetricRing.defaultProps = {
  label: '',
  size: 86,
  index: 0,
};

export default function BrandProofGridBlock({ block, locale, onNavigate }) {
  const prefersReducedMotion = useReducedMotion();
  const isArabic = locale === 'ar';

  const satisfactionPanel = block?.satisfactionPanel && typeof block.satisfactionPanel === 'object' ? block.satisfactionPanel : null;
  const satisfactionTitle = asText(satisfactionPanel?.title);
  const satisfactionDescription = asText(satisfactionPanel?.description);
  const satisfactionRatingLabel = asText(satisfactionPanel?.ratingLabel);
  const reactionIcons = asCollection(satisfactionPanel?.reactionIcons)
    .map((item, index) => {
      const media = normalizeMedia(item, { fallbackAlt: '' });
      if (!media?.url) return null;
      return { id: item?.id || `reaction-icon-${index}`, media };
    })
    .filter(Boolean);

  const strategyCards = asCollection(block?.strategyPanel)
    .map((card, index) => {
      const title = asText(card?.headline || card?.title);
      const description = asText(card?.summary || card?.description);
      const badge = asText(card?.badge);
      const icon = normalizeMedia(card?.icon, { fallbackAlt: title ? `${title} icon` : 'Strategy icon' });
      const artwork = normalizeMedia(card?.coverMedia || card?.artwork, { fallbackAlt: title });

      if (!title && !description && !badge && !icon?.url && !artwork?.url) {
        return null;
      }

      return {
        id: card?.id || `strategy-card-${index}`,
        title,
        description,
        badge,
        icon,
        artwork,
      };
    })
    .filter(Boolean);

  const strategyCardCount = strategyCards.length;
  const [strategyIndex, setStrategyIndex] = useState(0);
  const [strategyDirection, setStrategyDirection] = useState(1);

  useEffect(() => {
    setStrategyIndex(0);
  }, [strategyCardCount]);

  const activeStrategyCard = strategyCards[strategyIndex] || null;
  const activeStrategyImage = activeStrategyCard?.artwork || null;
  const activeStrategyIcon = activeStrategyCard?.icon || null;

  const consultationPanel = block?.consultationPanel && typeof block.consultationPanel === 'object' ? block.consultationPanel : null;
  const consultationHeadline = asText(consultationPanel?.headline || consultationPanel?.title);
  const consultationNote = asText(consultationPanel?.supportingNote || consultationPanel?.note);
  const consultationCta = normalizeCmsLink(consultationPanel?.cta);
  const consultationBackground = normalizeMedia(consultationPanel?.backgroundMedia, { fallbackAlt: consultationHeadline });
  const teamMembers = asCollection(consultationPanel?.teamMembers)
    .map((member, index) => {
      const name = asText(member?.fullName || member?.name);
      const avatar = normalizeMedia(member?.avatar, { fallbackAlt: name });

      if (!name && !avatar?.url) {
        return null;
      }

      return {
        id: member?.id || `team-member-${index}`,
        name,
        avatar,
      };
    })
    .filter(Boolean);

  const performancePanel = block?.performancePanel && typeof block.performancePanel === 'object' ? block.performancePanel : null;
  const performanceHeadline = asText(performancePanel?.headline || performancePanel?.title);
  const performanceSummary = asText(performancePanel?.summary || performancePanel?.description);
  const performanceMetrics = asCollection(performancePanel?.metrics)
    .map((metric, index) => ({
      id: metric?.id || `metric-${index}`,
      label: asText(metric?.label),
      value: asText(metric?.value),
    }))
    .filter((metric) => metric.label || metric.value)
    .slice(0, 3);

  const caseStudyPanel = block?.caseStudyPanel && typeof block.caseStudyPanel === 'object' ? block.caseStudyPanel : null;
  const caseStudyHeadline = asText(caseStudyPanel?.headline || caseStudyPanel?.title);
  const caseStudyResult = asText(caseStudyPanel?.resultLabel || caseStudyPanel?.result);
  const caseStudyLink = normalizeCmsLink(caseStudyPanel?.cta);
  const caseStudyImage = normalizeMedia(caseStudyPanel?.coverMedia, { fallbackAlt: caseStudyHeadline });

  const industriesPanel = block?.industriesPanel && typeof block.industriesPanel === 'object' ? block.industriesPanel : null;
  const industriesHeadline = asText(industriesPanel?.headline || industriesPanel?.title);
  const industries = asCollection(industriesPanel?.items)
    .map((item) => asText(item?.name || item?.title))
    .filter(Boolean);

  const testimonialPanel = block?.testimonialPanel && typeof block.testimonialPanel === 'object' ? block.testimonialPanel : null;
  const testimonialName = asText(testimonialPanel?.clientName || testimonialPanel?.name);
  const testimonialRole = asText(testimonialPanel?.clientRole || testimonialPanel?.role);
  const testimonialQuote = asText(testimonialPanel?.quote);
  const testimonialVideo = normalizeMedia(testimonialPanel?.video, { fallbackAlt: testimonialName });
  const testimonialPoster = normalizeMedia(testimonialPanel?.poster, { fallbackAlt: testimonialName });

  const hasSatisfaction = Boolean(satisfactionTitle || satisfactionDescription || satisfactionRatingLabel || reactionIcons.length > 0);
  const hasStrategy = strategyCardCount > 0;
  const hasConsultation = Boolean(consultationHeadline || consultationCta || consultationNote || teamMembers.length > 0 || consultationBackground?.url);
  const hasPerformance = Boolean(performanceHeadline || performanceSummary || performanceMetrics.length > 0);
  const hasCaseStudy = Boolean(caseStudyHeadline || caseStudyResult || caseStudyImage?.url || caseStudyLink);
  const hasIndustries = Boolean(industriesHeadline || industries.length > 0);
  const hasTestimonial = Boolean(testimonialVideo?.url || testimonialPoster?.url || testimonialName || testimonialRole || testimonialQuote);

  if (!hasSatisfaction && !hasStrategy && !hasConsultation && !hasPerformance && !hasCaseStudy && !hasIndustries && !hasTestimonial) {
    return null;
  }

  const handleLinkClick = (event, link) => {
    if (!link || !onNavigate || link.isExternal) return;
    event.preventDefault();
    onNavigate(link.url);
  };

  const handleStrategyPrev = () => {
    if (strategyCardCount <= 1) return;
    setStrategyDirection(-1);
    setStrategyIndex((previous) => (previous - 1 + strategyCardCount) % strategyCardCount);
  };

  const handleStrategyNext = () => {
    if (strategyCardCount <= 1) return;
    setStrategyDirection(1);
    setStrategyIndex((previous) => (previous + 1) % strategyCardCount);
  };

  const metricSizes = [72, 112, 72];

  return (
    <section className="section about-mosaic-block about-mosaic-shell framer-1y4cdlf" id="brand-proof-grid" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
      <div className="framer-57vhg3 layout-content-wide">
        <div className="framer-yagov1 corner-squircle">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-12 xl:[grid-template-rows:repeat(3,minmax(0,300px))] xl:auto-rows-[300px] xl:items-stretch">
            {hasSatisfaction ? (
              <article className="about-mosaic-panel about-mosaic-reveal corner-squircle min-h-[214px] rounded-[48px] p-4 sm:p-5 md:min-h-[248px] xl:col-span-3 xl:h-full">
                {satisfactionTitle ? <h3 className="text-center text-balance text-[1.16rem] sm:text-[1.42rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#111111]">{satisfactionTitle}</h3> : null}
                {satisfactionDescription ? <p className="mt-2 text-center text-[0.96rem] leading-7 text-[#69686e]">{satisfactionDescription}</p> : null}
                {satisfactionRatingLabel ? (
                  <p className="mt-10 sm:mt-12 xl:mt-16 text-center text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-[#0b5da8]">{satisfactionRatingLabel}</p>
                ) : null}

                {reactionIcons.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {reactionIcons.map((emoji, index) => (
                      <span
                        key={emoji.id}
                        className={`about-mosaic-emoji grid h-9 w-9 place-items-center rounded-full border border-dashed ${
                          index === reactionIcons.length - 1 ? 'border-[#0b5da8] opacity-100' : 'border-transparent opacity-40'
                        }`}
                      >
                        <img src={emoji.media.url} alt={emoji.media.alt || ''} width="22" height="22" className="h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] object-contain" loading="lazy" />
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}

            {hasStrategy ? (
              <article className="about-mosaic-panel about-mosaic-reveal corner-squircle min-h-[214px] overflow-hidden rounded-[48px] md:min-h-[248px] xl:col-span-9 xl:h-full" style={{ animationDelay: '60ms' }}>
                <div className="grid h-full gap-0 lg:grid-cols-[1.03fr_1fr]">
                  {activeStrategyImage?.url ? (
                    <div className="about-mosaic-image-wrap relative min-h-[170px] overflow-hidden sm:min-h-[214px] xl:min-h-0">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.img
                          key={activeStrategyCard?.id || `strategy-image-${strategyIndex}`}
                          src={activeStrategyImage.url}
                          alt={activeStrategyImage.alt || activeStrategyCard?.title || ''}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          initial={prefersReducedMotion ? false : { opacity: 0, x: strategyDirection > 0 ? 22 : -22 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, x: strategyDirection > 0 ? -22 : 22 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </AnimatePresence>
                    </div>
                  ) : null}

                  <div className="flex min-h-[170px] flex-col justify-between p-4 sm:min-h-[214px] md:p-5 xl:min-h-0">
                    <div className="flex items-start justify-between gap-3">
                      <span className="brand-proof-strategy-icon grid h-10 w-10 place-items-center rounded-[18px] border border-[rgba(6,6,18,0.1)] bg-[#f5f4f3]">
                        {activeStrategyIcon?.url ? (
                          <img src={activeStrategyIcon.url} alt={activeStrategyIcon.alt || 'Strategy icon'} className="h-5 w-5 object-contain" loading="lazy" />
                        ) : null}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleStrategyPrev}
                          className="about-mosaic-switch-btn brand-proof-switch-btn grid h-8 w-8 place-items-center rounded-[16px] bg-[#ececea]"
                          disabled={strategyCardCount <= 1}
                          aria-label="Previous strategy"
                        >
                          <img src={ARROW_LEFT} alt="" aria-hidden="true" className="h-4 w-4 object-contain" loading="lazy" />
                        </button>
                        <button
                          type="button"
                          onClick={handleStrategyNext}
                          className="about-mosaic-switch-btn brand-proof-switch-btn grid h-8 w-8 place-items-center rounded-[16px] bg-[#ececea]"
                          disabled={strategyCardCount <= 1}
                          aria-label="Next strategy"
                        >
                          <img src={ARROW_RIGHT} alt="" aria-hidden="true" className="h-4 w-4 object-contain" loading="lazy" />
                        </button>
                      </div>
                    </div>

                    <div className="relative mt-4" aria-live={strategyCardCount > 1 ? 'polite' : undefined}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={activeStrategyCard?.id || `strategy-copy-${strategyIndex}`}
                          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {activeStrategyCard?.badge ? (
                            <p className="text-[0.74rem] sm:text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#0b5da8]">{activeStrategyCard.badge}</p>
                          ) : null}
                          {activeStrategyCard?.title ? <h3 className="text-balance text-[1.16rem] sm:text-[1.42rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#111111]">{activeStrategyCard.title}</h3> : null}
                          {activeStrategyCard?.description ? <p className="mt-2 text-[0.95rem] leading-7 text-[#69686e]">{activeStrategyCard.description}</p> : null}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </article>
            ) : null}

            {hasConsultation ? (
              <article
                className="about-mosaic-panel about-mosaic-reveal corner-squircle relative min-h-[270px] overflow-hidden rounded-[48px] p-5 sm:min-h-[262px] sm:p-6 md:p-7 xl:col-span-6 xl:h-full"
                style={{ animationDelay: '100ms' }}
              >
                {consultationBackground?.url ? (
                  <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-16" style={{ backgroundImage: `url("${consultationBackground.url}")` }} />
                ) : null}

                <div className="relative">
                  {consultationHeadline ? <h3 className="text-center text-balance text-[1.16rem] sm:text-[1.42rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#111111]">{consultationHeadline}</h3> : null}

                  {consultationCta ? (
                    <div className="mt-4 sm:mt-5 flex justify-center">
                      <a
                        href={consultationCta.url}
                        onClick={(event) => handleLinkClick(event, consultationCta)}
                        target={consultationCta.isExternal ? '_blank' : undefined}
                        rel={consultationCta.isExternal ? 'noopener noreferrer' : undefined}
                        className="about-mosaic-cta inline-flex h-11 items-center justify-center rounded-full corner-squircle border border-[#0a4f8c] bg-[#084299] px-6 text-sm font-normal tracking-[0.01em] text-white"
                      >
                        {consultationCta.label}
                      </a>
                    </div>
                  ) : null}

                  {consultationNote ? <p className="mt-2 sm:mt-3 text-center text-[0.98rem] sm:text-[1.04rem] font-medium text-[rgba(6,6,18,0.46)]">{consultationNote}</p> : null}

                  {teamMembers.length > 0 ? (
                    <div className="mt-5 sm:mt-7 flex items-end justify-center">
                      {teamMembers.map((member, index) => (
                        <figure
                          key={member.id}
                          className={`about-mosaic-team-card relative h-[92px] w-[68px] overflow-hidden rounded-[19px] border-4 border-white sm:h-[118px] sm:w-[88px] md:h-[130px] md:w-[96px] ${TEAM_ROTATIONS[index % TEAM_ROTATIONS.length]} max-[430px]:rotate-0`}
                          style={{ marginInlineStart: index === 0 ? 0 : '-10px', animationDelay: `${index * 90}ms` }}
                        >
                          {member.avatar?.url ? <img src={member.avatar.url} alt={member.avatar.alt || member.name} className="h-full w-full object-cover object-top" loading="lazy" /> : null}
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ) : null}

            {hasPerformance ? (
              <article className="about-mosaic-panel about-mosaic-reveal corner-squircle min-h-[250px] rounded-[48px] p-5 sm:min-h-[262px] sm:p-6 md:p-7 xl:col-span-6 xl:h-full" style={{ animationDelay: '140ms' }}>
                {performanceHeadline ? <h3 className="text-center text-balance text-[1.16rem] sm:text-[1.42rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#111111]">{performanceHeadline}</h3> : null}
                {performanceSummary ? <p className="mx-auto mt-2 max-w-[42ch] text-center text-[0.95rem] leading-7 text-[rgba(6,6,18,0.5)]">{performanceSummary}</p> : null}

                {performanceMetrics.length > 0 ? (
                  <div className="mt-4 sm:mt-5 flex items-end justify-center gap-2 sm:gap-4 md:gap-6 max-[430px]:gap-1">
                    {performanceMetrics.map((metric, index) => (
                      <MetricRing key={metric.id} label={metric.label} value={metric.value} size={metricSizes[index] || 86} index={index} />
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}

            {hasCaseStudy ? (
              caseStudyLink ? (
                <a
                  href={caseStudyLink.url}
                  onClick={(event) => handleLinkClick(event, caseStudyLink)}
                  target={caseStudyLink.isExternal ? '_blank' : undefined}
                  rel={caseStudyLink.isExternal ? 'noopener noreferrer' : undefined}
                  className="about-mosaic-panel about-mosaic-case about-mosaic-reveal corner-squircle flex min-h-[208px] flex-col overflow-hidden rounded-[48px] p-4 xl:col-span-3 xl:h-full"
                  style={{ animationDelay: '180ms' }}
                >
                  <div>
                    {caseStudyHeadline ? <p className="text-balance text-[1.16rem] sm:text-[1.42rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#111111]">{caseStudyHeadline}</p> : null}
                    {caseStudyResult ? <p className="mt-2 text-sm text-[#69686e]">{caseStudyResult}</p> : null}
                  </div>
                  {caseStudyImage?.url ? (
                    <img
                      src={caseStudyImage.url}
                      alt={caseStudyImage.alt || ''}
                      className="about-mosaic-case-image mt-auto pt-4 w-full aspect-[2/1] max-h-[148px] min-h-[94px] rounded-[18px] object-cover object-center"
                      loading="lazy"
                    />
                  ) : null}
                </a>
              ) : (
                <article className="about-mosaic-panel about-mosaic-case about-mosaic-reveal corner-squircle flex min-h-[208px] flex-col overflow-hidden rounded-[48px] p-4 xl:col-span-3 xl:h-full" style={{ animationDelay: '180ms' }}>
                  <div>
                    {caseStudyHeadline ? <p className="text-balance text-[1.16rem] sm:text-[1.42rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#111111]">{caseStudyHeadline}</p> : null}
                    {caseStudyResult ? <p className="mt-2 text-sm text-[#69686e]">{caseStudyResult}</p> : null}
                  </div>
                  {caseStudyImage?.url ? (
                    <img
                      src={caseStudyImage.url}
                      alt={caseStudyImage.alt || ''}
                      className="about-mosaic-case-image mt-auto pt-4 w-full aspect-[2/1] max-h-[148px] min-h-[94px] rounded-[18px] object-cover object-center"
                      loading="lazy"
                    />
                  ) : null}
                </article>
              )
            ) : null}

            {hasIndustries ? (
              <article className="about-mosaic-panel about-mosaic-reveal corner-squircle flex min-h-[208px] flex-col rounded-[48px] p-4 xl:col-span-6 xl:h-full" style={{ animationDelay: '220ms' }}>
                {industriesHeadline ? <h3 className="text-center text-balance text-[1.16rem] sm:text-[1.42rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#111111]">{industriesHeadline}</h3> : null}
                {industries.length > 0 ? (
                  <div className="about-mosaic-industries mt-3 flex-1 min-h-0">
                    <ul role="group" className="about-mosaic-industries-track grid gap-2" draggable="false">
                      {[...industries, ...industries].map((industry, index) => (
                        <li
                          key={`${industry}-${index}`}
                          className="flex items-center justify-center gap-2 border-b border-[rgba(8,66,153,0.18)] border-dashed py-2 text-center text-[0.82rem] sm:text-[0.88rem] font-medium tracking-[0.01em] text-[#0b5da8]"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0b5da8]" />
                          <span>{industry}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0b5da8]" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ) : null}

            {hasTestimonial ? (
              <article className="about-mosaic-panel about-mosaic-reveal corner-squircle relative min-h-[208px] overflow-hidden rounded-[48px] xl:col-span-3 xl:h-full" style={{ animationDelay: '260ms' }}>
                {testimonialVideo?.url ? (
                  <video
                    src={testimonialVideo.url}
                    poster={testimonialPoster?.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                  />
                ) : testimonialPoster?.url ? (
                  <img src={testimonialPoster.url} alt={testimonialPoster.alt || testimonialName} className="h-full w-full object-cover" loading="lazy" />
                ) : null}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgba(6,6,18,0.72)] to-transparent" />
                <div className={`absolute bottom-4 z-10 text-white ${isArabic ? 'right-4 text-right' : 'left-4 text-left'}`}>
                  {testimonialName ? <p className="text-[1.2rem] font-medium">{testimonialName}</p> : null}
                  {testimonialRole ? <p className="mt-1 text-sm uppercase tracking-[0.13em] opacity-90">{testimonialRole}</p> : null}
                  {testimonialQuote ? <p className="mt-2 max-w-[24ch] text-[0.88rem] leading-5 opacity-95">{testimonialQuote}</p> : null}
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

BrandProofGridBlock.propTypes = {
  block: PropTypes.shape({
    satisfactionPanel: PropTypes.object,
    strategyPanel: PropTypes.array,
    consultationPanel: PropTypes.object,
    performancePanel: PropTypes.object,
    caseStudyPanel: PropTypes.object,
    industriesPanel: PropTypes.object,
    testimonialPanel: PropTypes.object,
  }),
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
  onNavigate: PropTypes.func,
};

BrandProofGridBlock.defaultProps = {
  block: {},
  onNavigate: null,
};
