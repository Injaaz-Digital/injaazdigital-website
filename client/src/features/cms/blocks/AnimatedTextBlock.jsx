'use client';

import { Fragment, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn as cx } from '@/lib/utils';

const TEXT_CLASS =
  '![font-family:var(--font-domaine),Iowan_Old_Style,Times_New_Roman,serif] font-medium leading-[1.08] tracking-[-0.016em] text-[clamp(1.65rem,4.2vw,3rem)] text-black';
const TEXT_CLASS_RTL =
  '![font-family:var(--font-ibm-arabic),sans-serif] font-semibold leading-[1.14] tracking-normal text-[clamp(1.65rem,4.2vw,3rem)] text-black';

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
            ? { opacity: 0.1, filter: 'blur(5px)', yPercent: 18 }
            : style === 'line-reveal'
              ? { opacity: 0.1, filter: 'blur(4px)', yPercent: 10 }
              : { opacity: 0.1, filter: 'blur(4px)' };

          gsap.fromTo(nodes, from, {
            opacity: 1,
            filter: 'blur(0px)',
            yPercent: 0,
            duration: 0.2,
            stagger: {
              each: 0.1,
              from: 'start',
            },
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: block?.sticky ? 'top 75%' : 'top 75%',
              end: block?.sticky ? 'bottom bottom' : 'bottom 25%',
              scrub: 0.45,
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

  return (
    <section
      ref={sectionRef}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={cx(
        'py-16 sm:py-24',
        block?.sticky && 'min-h-[80svh] py-0'
      )}
    >
      <div
        className={cx(
          'mx-auto max-w-[1120px]',
          block?.sticky && 'sticky top-0 flex min-h-[50svh] flex-col justify-center py-6 sm:py-10'
        )}
      >
        {block?.eyebrow ? (
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#35628f]">
            {block.eyebrow}
          </p>
        ) : null}
        <p
          aria-label={text}
          className={cx(
            'max-w-[40ch] sm:max-w-[50ch]',
            isArabic ? TEXT_CLASS_RTL : TEXT_CLASS,
            block?.alignment === 'center' && 'mx-auto text-center'
          )}
        >
          <span aria-hidden="true">
            {words.map(({ word, highlighted }, index) => (
              <Fragment key={`${word}-${index}`}>
                <span
                  data-animated-word
                  className={cx(
                    'inline-block will-change-[filter,opacity,transform] [transition:filter_0.2s_ease-out,opacity_0.2s_ease-out]',
                    highlighted && 'text-[#084299]'
                  )}
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
    animationStyle: PropTypes.oneOf(['word-reveal', 'line-reveal', 'progressive-opacity']),
    sticky: PropTypes.bool,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
};
