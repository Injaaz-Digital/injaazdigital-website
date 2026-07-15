'use client';

import { Fragment, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from '@/lib/utils/cx';

const SIZE_CLASS = {
  medium: 'text-[clamp(1.8rem,4vw,3.6rem)]',
  large: 'text-[clamp(2.25rem,5.4vw,5.4rem)]',
  display: 'text-[clamp(2.7rem,6.4vw,6.5rem)]',
};

const normalizeText = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');

function splitWords(text, highlightedText) {
  const highlight = normalizeText(highlightedText).toLocaleLowerCase();
  const words = text.split(' ');
  const highlightedWords = highlight ? highlight.split(' ') : [];
  const highlightStart = highlightedWords.length > 0
    ? words.findIndex((_, index) => words.slice(index, index + highlightedWords.length).join(' ').toLocaleLowerCase() === highlight)
    : -1;

  return words.map((word, index) => ({
    word,
    highlighted: highlightStart >= 0 && index >= highlightStart && index < highlightStart + highlightedWords.length,
  }));
}

export default function AnimatedTextBlock({ block, locale = 'en' }) {
  const sectionRef = useRef(null);
  const text = normalizeText(block?.text);
  const words = useMemo(() => splitWords(text, block?.highlightedText), [text, block?.highlightedText]);
  const isArabic = locale === 'ar';

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !text) return undefined;

    let active = true;
    let context;
    let media;

    async function setup() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (!active || !sectionRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const nodes = gsap.utils.toArray('[data-animated-word]');
        media = gsap.matchMedia();

        media.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set(nodes, { clearProps: 'all' });
        });

        media.add('(prefers-reduced-motion: no-preference)', () => {
          const style = block?.animationStyle || 'progressive-opacity';
          const from = style === 'word-reveal'
            ? { opacity: 0.12, yPercent: 45 }
            : style === 'line-reveal'
              ? { opacity: 0.16, yPercent: 24 }
              : { opacity: 0.14 };

          gsap.fromTo(nodes, from, {
            opacity: 1,
            yPercent: 0,
            duration: 0.26,
            stagger: {
              each: 0.12,
              from: 'start',
            },
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: block?.sticky ? 'bottom 38%' : 'bottom 56%',
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          });
        });
      }, section);
    }

    setup();
    return () => {
      active = false;
      media?.revert();
      context?.revert();
    };
  }, [block?.animationStyle, block?.sticky, text]);

  if (!text) return null;

  const contrast = block?.theme === 'contrast';
  return (
    <section
      ref={sectionRef}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={cx(
        'relative isolate px-4 py-28 sm:px-6 sm:py-36 lg:py-44',
        block?.sticky && 'min-h-[125vh]',
        block?.theme === 'muted' && 'bg-[#f2f6f9]',
        contrast && 'bg-[#07182c] text-white'
      )}
    >
      <div className={cx('mx-auto max-w-[1120px]', block?.sticky && 'lg:sticky lg:top-[24vh]')}>
        {block?.eyebrow ? (
          <p className={cx('mb-8 text-xs font-semibold uppercase tracking-[0.18em] sm:mb-10', contrast ? 'text-[#9eb9d5]' : 'text-[#35628f]')}>
            {block.eyebrow}
          </p>
        ) : null}
        <p
          aria-label={text}
          className={cx(
            'animated-text-statement max-w-[22ch]',
            SIZE_CLASS[block?.size] || SIZE_CLASS.large,
            block?.alignment === 'center' && 'mx-auto text-center'
          )}
        >
          <span aria-hidden="true">
            {words.map(({ word, highlighted }, index) => (
              <Fragment key={`${word}-${index}`}>
                <span
                  data-animated-word
                  className={cx('inline-block will-change-transform', highlighted && (contrast ? 'text-[#7fc5ff]' : 'text-[#084299]'))}
                >
                  {word}
                </span>
                {index < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}

AnimatedTextBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    text: PropTypes.string.isRequired,
    highlightedText: PropTypes.string,
    alignment: PropTypes.oneOf(['left', 'center']),
    size: PropTypes.oneOf(['medium', 'large', 'display']),
    animationStyle: PropTypes.oneOf(['word-reveal', 'line-reveal', 'progressive-opacity']),
    sticky: PropTypes.bool,
    theme: PropTypes.oneOf(['default', 'muted', 'contrast']),
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
};
