'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { normalizeMedia } from '@/lib/strapi';
import { BLOG_COPY } from '@/features/blog/lib/constants';
import { decorateRichText } from '@/features/blog/lib/helpers';
import HeroAtmosphere from '@/features/home/components/HeroAtmosphere';
import { CmsImage } from './shared';

const SECTION_IN = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
};

const formatDate = (value, locale) => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(parsed);
};

function TocBlock({ headings, copy, className = '' }) {
  if (!headings.length) return null;

  return (
    <section className={`border-t border-b border-[rgba(8,66,153,0.08)] py-6 ${className}`.trim()}>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#7d8fa8]">{copy.toc}</p>
      <nav className="mt-5 grid gap-2.5">
        {headings.map((heading) => (
          <a key={heading.id} href={`#${heading.id}`} className="text-[0.98rem] leading-7 text-[#456587] transition hover:text-[#0b4f8c]">
            {heading.title}
          </a>
        ))}
      </nav>
    </section>
  );
}

TocBlock.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.object).isRequired,
  copy: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default function BlogPost({ article, locale }) {
  const copy = BLOG_COPY[locale] || BLOG_COPY.en;
  const coverImage = normalizeMedia(article?.coverImage, { fallbackAlt: article?.title || '' });
  const authorAvatar = normalizeMedia(article?.author?.avatar, { fallbackAlt: article?.author?.name || '' });
  const { html, headings } = useMemo(() => decorateRichText(article?.body), [article?.body]);
  const categoryLabel = copy.categories[article?.category] || article?.category || copy.all;
  const publishedLabel = formatDate(article?.publishedAt, locale);
  const updatedLabel = formatDate(article?.updatedAt, locale);

  if (!article) {
    return (
      <section className="section pt-[var(--header-offset)]">
        <div className="layout-container--reading py-12 text-center">
          <h1 className="text-[clamp(2rem,4vw,3.2rem)] leading-[0.94] tracking-[-0.05em] text-[#0a2546]">
            {copy.notFoundTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-[54ch] text-[1rem] leading-8 text-[#587392]">{copy.notFoundBody}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <motion.section className="relative" {...SECTION_IN}>
        <div className="relative isolate overflow-hidden pb-8 pt-[calc(var(--header-offset)-0.35rem)] sm:pb-10 sm:pt-[var(--header-offset)]">
          <HeroAtmosphere />

          <div className="layout-container relative z-10 py-2 sm:py-0">
            <div className="mx-auto flex min-h-[170px] w-full max-w-[26rem] flex-col items-center justify-center px-2 text-center sm:min-h-[280px] sm:max-w-[44rem] lg:min-h-[320px] lg:max-w-[56rem]">
              <p className="mx-auto inline-flex items-center rounded-full border border-[rgba(8,66,153,0.16)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(236,245,255,0.8))] px-4 py-1.5 text-center text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#6e83a0] shadow-[0_8px_18px_rgba(8,41,89,0.06)]">
                {categoryLabel}
              </p>
              <h1 className="hero-title-plain mx-auto mt-3 max-w-[32ch] text-center sm:mt-4">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="mx-auto mt-5 max-w-[54rem] text-[1.02rem] leading-8 text-[#587392] sm:text-[1.08rem]">{article.excerpt}</p>
              ) : null}
            </div>

            {(article.author?.name || updatedLabel) ? (
              <div className="mx-auto mt-6 flex w-full max-w-[760px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-2 text-sm text-[#5f7896]">
                {article.author?.name ? (
                  <div className={`inline-flex items-center gap-3 ${locale === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    {authorAvatar?.url ? (
                      <CmsImage
                        media={article.author.avatar}
                        src={authorAvatar.url}
                        alt={article.author.name}
                        width={44}
                        height={44}
                        sizes="44px"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-[#edf4ff] text-sm font-semibold text-[#0a2546]">
                        {article.author.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#0a2546]">{article.author.name}</p>
                      {publishedLabel ? (
                        <p className={`text-xs text-[#6c819b] ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                          {locale === 'ar' ? `نُشر في ${publishedLabel}` : `Published ${publishedLabel}`}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {updatedLabel && updatedLabel !== publishedLabel ? (
                  <span>{locale === 'ar' ? `تم التحديث في ${updatedLabel}` : `Updated on ${updatedLabel}`}</span>
                ) : null}
              </div>
            ) : null}

            {coverImage?.url ? (
              <div className="mx-auto mt-10 max-w-[1160px] overflow-hidden rounded-[26px] bg-[#edf4ff] shadow-[0_18px_42px_rgba(8,41,89,0.08)]">
                <CmsImage
                  media={article.coverImage}
                  src={coverImage.url}
                  alt={article.title}
                  priority
                  sizes="(min-width: 1280px) 72vw, 100vw"
                  className="max-h-[500px] w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </motion.section>

      <motion.section className="section section--tight" {...SECTION_IN}>
        <div className="layout-container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start lg:justify-between">
            <div className="min-w-0">
              <TocBlock headings={headings} copy={copy} className="mx-auto max-w-[760px] lg:hidden" />

              <article className="blog-body mx-auto mt-10 max-w-[760px] text-[1.03rem] leading-8 sm:text-[1.08rem]" dangerouslySetInnerHTML={{ __html: html }} />

              <div className="mx-auto mt-12 max-w-[760px] border-t border-[rgba(8,66,153,0.08)] pt-6 lg:hidden">
                <p className="max-w-[38ch] text-sm leading-7 text-[#587392]">{copy.endCta}</p>
                <Link
                  href={article?.cta?.url || '/book-call'}
                  className="mt-4 inline-flex rounded-full bg-[#0a2546] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10315a]"
                >
                  {article?.cta?.label || copy.bookCall}
                </Link>
              </div>

              <div className="mx-auto mt-8 max-w-[760px] border-t border-[rgba(8,66,153,0.08)] pt-6">
                <Link href="/blog" className="inline-flex items-center text-sm font-medium text-[#0b4f8c] transition hover:underline">
                  {copy.backToBlog}
                </Link>
              </div>
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-[calc(var(--header-height)+1.75rem)]">
              <TocBlock headings={headings} copy={copy} />
              <div className="mt-6 rounded-[20px] border border-[rgba(8,66,153,0.08)] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(8,41,89,0.06)]">
                <p className="text-sm leading-7 text-[#587392]">{copy.endCta}</p>
                <Link
                  href={article?.cta?.url || '/book-call'}
                  className="mt-4 inline-flex rounded-full bg-[#0a2546] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10315a]"
                >
                  {article?.cta?.label || copy.bookCall}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </motion.section>
    </>
  );
}

BlogPost.propTypes = {
  article: PropTypes.object,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
};
