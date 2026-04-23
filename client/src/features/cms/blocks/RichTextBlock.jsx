import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef } from 'react';
import { CmsLinkButton } from './shared';

const richTextToTokens = (html = '') => {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|blockquote|ul|ol)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t\r\f\v]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();

  if (!text) return [];

  const lines = text.split('\n');
  const tokens = [];

  lines.forEach((line, lineIndex) => {
    const words = line.split(' ').filter(Boolean);
    words.forEach((word) => {
      tokens.push({ type: 'word', value: word });
    });

    if (lineIndex < lines.length - 1) {
      tokens.push({ type: 'break' });
    }
  });

  return tokens;
};

export default function RichTextBlock({ block, locale, onNavigate }) {
  const isArabic = locale === 'ar';
  const body = block.body || '';
  const textRef = useRef(null);
  const tokens = useMemo(() => richTextToTokens(body), [body]);
  const wordCount = useMemo(() => tokens.reduce((count, token) => (token.type === 'word' ? count + 1 : count), 0), [tokens]);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return undefined;

    let isMounted = true;
    let gsapContext = null;

    const runGsap = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (!isMounted || !textRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      gsapContext = gsap.context(() => {
        const wordNodes = textRef.current?.querySelectorAll('.rich-text-word');
        if (!wordNodes || wordNodes.length === 0) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
          gsap.set(wordNodes, { opacity: 1, y: 0, filter: 'blur(0px)' });
          return;
        }

        const revealDuration = wordNodes.length <= 28 ? 1.25 : 1.1;
        const staggerEach = wordNodes.length <= 28 ? 0.11 : wordNodes.length <= 56 ? 0.09 : 0.07;

        gsap.set(wordNodes, { opacity: 0.08, y: 38, filter: 'blur(6px)' });
        gsap.to(wordNodes, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: revealDuration,
          ease: 'power3.out',
          stagger: staggerEach,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 82%',
            end: 'top 38%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
      }, textRef);
    };

    runGsap();

    return () => {
      isMounted = false;
      if (gsapContext) {
        gsapContext.revert();
      }
    };
  }, [wordCount]);

  if (wordCount === 0) {
    return null;
  }

  return (
    <section className="section section--tight py-20">
      <div className="w-full" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
        <p
          ref={textRef}
          className={`rich-text-word-flow ${isArabic ? 'is-rtl' : ''}`}
          style={{ unicodeBidi: 'plaintext' }}
        >
          {tokens.map((token, index) => (
            token.type === 'break' ? (
              <span key={`break-${index}`} className="rich-text-line-break" aria-hidden="true" />
            ) : (
              <span key={`${token.value}-${index}`} className="rich-text-word">
                {token.value}
              </span>
            )
          ))}
        </p>

        {block.primaryCta ? (
          <div className="mt-[34px] text-center">
            <CmsLinkButton link={block.primaryCta} onNavigate={onNavigate} className="!h-10" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

RichTextBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    body: PropTypes.string,
    primaryCta: PropTypes.object,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
  onNavigate: PropTypes.func,
};
