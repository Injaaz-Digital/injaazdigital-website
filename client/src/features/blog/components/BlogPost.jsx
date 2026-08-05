'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { normalizeMedia, resolveMediaUrl } from '@/lib/strapi';
import { BLOG_COPY } from '@/features/blog/lib/constants';
import HeroAtmosphere from '@/features/cms/components/HeroAtmosphere';
import { CmsImage } from './shared';
import ArticleTaxonomy from './article/ArticleTaxonomy';
import RelatedContent from './article/RelatedContent';
import ShareButtons from './article/ShareButtons';
import ArticleNavigation from './article/ArticleNavigation';

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

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    numberingSystem: 'latn',
  }).format(parsed);
};

function TocBlock({ headings, copy, className = '' }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <section className={`border-t border-b border-[rgba(8,66,153,0.08)] py-6 ${className}`.trim()}>
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#7d8fa8]">{copy.toc}</p>
      <nav className="mt-5 grid gap-2.5">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`text-[0.98rem] leading-7 transition ${
              activeId === heading.id
                ? 'font-semibold text-[#0a2546]'
                : 'text-[#456587] hover:text-[#0b4f8c]'
            }`}
          >
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
  const html = article?.body || '';
  const headings = Array.isArray(article?.headings) ? article.headings : [];
  const authorAvatarUrl = resolveMediaUrl(article?.author?.avatar);
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
        <div className="hero-page-shell hero-top-spacing hero-top-spacing--generous relative isolate flex items-center overflow-hidden pb-[var(--header-offset)] max-sm:pb-[calc(var(--header-offset)-0.9rem)]">
          <HeroAtmosphere />
          <div className="layout-container--hero relative z-10 flex min-w-0 flex-col items-center">
            <h1 className="hero-title-plain mx-auto mt-20 w-full max-w-7xl max-sm:max-w-[calc(100vw-2rem)] text-center sm:mt-24">
              {article.title}
            </h1>
            {article.excerpt ? (
              <p className="hero-lead mx-auto mt-3 max-w-[56ch] text-center lg:mt-6">
                {article.excerpt}
              </p>
            ) : null}

          </div>
        </div>

        {(article.author?.name || updatedLabel) ? (
          <div className="layout-container--hero mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-2 text-sm text-[#5f7896]">
            {article.author?.name ? (
              <div className={`inline-flex items-center gap-3 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                {authorAvatarUrl ? (
                  <CmsImage
                    media={article.author.avatar}
                    src={authorAvatarUrl}
                    alt={article.author.name}
                    width={44}
                    height={44}
                    sizes="44px"
                    className="h-11 w-11 rounded-full corner-squircle border-2 border-white object-cover shadow-[0_4px_12px_rgba(8,41,89,0.15)]"
                  />
                ) : null}
                <div>
                  {article.author.slug ? <Link href={`/${locale}/blog/author/${article.author.slug}`} className="font-medium text-[#0a2546] hover:underline">{article.author.name}</Link> : <p className="font-medium text-[#0a2546]">{article.author.name}</p>}
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

        <ArticleTaxonomy category={article.primaryCategory} tags={article.tags || []} locale={locale} />

        {coverImage?.url ? (
          <div className="layout-container--hero mx-auto mt-8 max-w-[1160px] overflow-hidden rounded-[26px] bg-[#edf4ff] shadow-[0_18px_42px_rgba(8,41,89,0.08)]">
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
      </motion.section>

      <motion.section className="section section--tight" {...SECTION_IN}>
        <div className="layout-container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start lg:justify-between">
            <div className="min-w-0">
              <TocBlock headings={headings} copy={copy} className="mx-auto max-w-[760px] lg:hidden" />

              <article className="blog-body mx-auto mt-10 max-w-[760px] text-[1.03rem] leading-8 sm:text-[1.08rem]" dir={locale === 'ar' ? 'rtl' : 'ltr'} dangerouslySetInnerHTML={{ __html: html }} />

              <div className="mx-auto mt-12 max-w-[760px] border-t border-[rgba(8,66,153,0.08)] pt-6 lg:hidden">
                {article?.articleCta?.headline ? <h2 className="text-xl font-semibold text-[#0a2546]">{article.articleCta.headline}</h2> : null}
                <p className="mt-2 max-w-[38ch] text-sm leading-7 text-[#587392]">{article?.articleCta?.body || copy.endCta}</p>
                <Link
                  href={article?.cta?.url || '/book-call'}
                  className="mt-4 inline-flex rounded-full bg-[#0a2546] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10315a]"
                >
                  {article?.cta?.label || copy.bookCall}
                </Link>
              </div>

              <div className="mx-auto mt-8 max-w-[760px] border-t border-[rgba(8,66,153,0.08)] pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><Link href={`/${locale}/blog`} className="inline-flex items-center text-sm font-medium text-[#0b4f8c] transition hover:underline">{copy.backToBlog}</Link><ShareButtons title={article.title} slug={article.slug} locale={locale} /></div>
              </div>
              <ArticleNavigation previous={article.previousArticle} next={article.nextArticle} locale={locale} />
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-[calc(var(--header-height)+1.75rem)]">
              <TocBlock headings={headings} copy={copy} />
              <div className="mt-6 rounded-[20px] border border-[rgba(8,66,153,0.08)] bg-white px-5 py-5 shadow-[0_12px_28px_rgba(8,41,89,0.06)]">
                {article?.articleCta?.headline ? <h2 className="text-lg font-semibold text-[#0a2546]">{article.articleCta.headline}</h2> : null}
                <p className="mt-2 text-sm leading-7 text-[#587392]">{article?.articleCta?.body || copy.endCta}</p>
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
      <RelatedContent articles={article.relatedPosts || []} service={article.relatedService} locale={locale} />
    </>
  );
}

BlogPost.propTypes = {
  article: PropTypes.object,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
};
