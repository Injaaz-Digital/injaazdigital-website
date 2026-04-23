'use client';

import { startTransition, useMemo, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BLOG_COPY } from '@/features/blog/lib/constants';
import HeroAtmosphere from '@/features/home/components/HeroAtmosphere';
import { normalizeMedia } from '@/lib/strapi';
import { CmsImage } from './shared';

const SECTION_IN = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
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

function getCategoryLabel(category, copy) {
  return copy.categories[category] || category || copy.all;
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-[#0a2546] text-white shadow-[0_10px_22px_rgba(8,41,89,0.12)]'
          : 'bg-[#f3f7fc] text-[#5b7493] hover:bg-[#eaf2fb] hover:text-[#0a2546]'
      }`}
    >
      {label}
    </button>
  );
}

FilterChip.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

function BlogCard({ article, copy, locale }) {
  const articleImage = normalizeMedia(article.coverImage, { fallbackAlt: article.title || '' });
  const categoryLabel = getCategoryLabel(article.category, copy);
  const publishedLabel = formatDate(article.publishedAt || article.updatedAt, locale);

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex h-full flex-col rounded-[22px] p-2 transition duration-300 hover:-translate-y-0.5"
    >
      <div className="overflow-hidden rounded-[18px] bg-[linear-gradient(145deg,#f7fbff,#edf4ff)]">
        {articleImage?.url ? (
          <CmsImage
            media={article.coverImage}
            src={articleImage.url}
            alt={article.title}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 48vw, 100vw"
            className="h-[196px] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[220px]"
          />
        ) : (
          <div className="flex h-[196px] items-end bg-[linear-gradient(145deg,#f7fbff,#eaf2fb)] p-5 sm:h-[220px]">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#0b4f8c]">{categoryLabel}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0b4f8c]">{categoryLabel}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6d839d]">
          {publishedLabel ? <span>{publishedLabel}</span> : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} />
            {article.readTime || 5} {copy.readTime}
          </span>
        </div>

        <h3 className="mt-3 text-[1.07rem] leading-[1.22] tracking-[-0.02em] text-[#0a2546] transition-colors duration-300 group-hover:text-[#0b4f8c] sm:text-[1.2rem]">
          {article.title}
        </h3>

        {article.excerpt ? <p className="mt-2.5 line-clamp-2 text-[0.94rem] leading-7 text-[#587392] sm:line-clamp-3">{article.excerpt}</p> : null}
      </div>
    </Link>
  );
}

BlogCard.propTypes = {
  article: PropTypes.object.isRequired,
  copy: PropTypes.object.isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
};

export default function BlogList({ articles, locale }) {
  const copy = BLOG_COPY[locale] || BLOG_COPY.en;
  const isArabic = locale === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(
    () => ['all', ...Object.keys(copy.categories || {})],
    [copy.categories],
  );

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  return (
    <section className="relative">
      <div className="relative isolate overflow-hidden pb-7 pt-[calc(var(--header-offset)-0.35rem)] sm:pb-10 sm:pt-[var(--header-offset)]">
        <HeroAtmosphere />

        <div className="layout-container relative z-10 flex min-h-[170px] items-center justify-center py-2 sm:min-h-[280px] sm:py-0 lg:min-h-[320px]">
          <div className="mx-auto flex w-full max-w-[26rem] flex-col items-center px-2 text-center sm:max-w-[44rem] lg:max-w-[56rem]">
            <p className="mx-auto inline-flex items-center rounded-full border border-[rgba(8,66,153,0.16)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(236,245,255,0.8))] px-4 py-1.5 text-center text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#6e83a0] shadow-[0_8px_18px_rgba(8,41,89,0.06)]">
              {copy.blogTitle}
            </p>
            <h1 className="hero-title-plain mx-auto mt-3 max-w-[32ch] text-center sm:mt-4">
              {copy.blogDescription}
            </h1>
          </div>
        </div>
      </div>

      <section className="layout-container mt-7 sm:mt-12">
        <div className="mx-auto w-full max-w-[980px]">
          <p className="mb-3 text-center text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-[#7d8fa8]">{copy.filterByCategory}</p>
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:overflow-visible md:px-0">
            <div className="flex w-max gap-2 md:w-full md:flex-wrap md:justify-center md:gap-3">
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={category === 'all' ? copy.all : getCategoryLabel(category, copy)}
                  active={activeCategory === category}
                  onClick={() => {
                    startTransition(() => setActiveCategory(category));
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="layout-container mt-12 sm:mt-16">
        {filteredArticles.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-10 text-center shadow-[0_18px_42px_rgba(8,41,89,0.05)] sm:px-8">
            <h2 className="text-2xl text-[#0a2546]">{copy.emptyTitle}</h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-[#587392]">{copy.emptyBody}</p>
          </div>
        ) : (
          <div>
            <p className="mb-5 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-[#7d8fa8]">{copy.recentPosts}</p>

            <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-8 xl:grid-cols-3 [content-visibility:auto]">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.14 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.16), ease: [0.22, 1, 0.36, 1] }}
                >
                  <BlogCard article={article} copy={copy} locale={locale} />
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-[28px] border border-[rgba(8,66,153,0.12)] bg-[linear-gradient(140deg,#ffffff,#f1f7ff)] px-5 py-6 shadow-[0_16px_36px_rgba(8,41,89,0.07)] sm:mt-12 sm:px-8 sm:py-8">
              <div
                className={`mx-auto flex max-w-[920px] flex-col gap-4 sm:items-center sm:justify-between ${
                  isArabic ? 'text-right sm:flex-row-reverse sm:text-right' : 'text-left sm:flex-row sm:text-left'
                }`}
              >
                <p className="max-w-[58ch] text-[0.98rem] leading-7 text-[#4f6a89]">{copy.endCta}</p>
                <Link
                  href="/book-call"
                  className="inline-flex w-fit rounded-full bg-[#0a2546] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10315a]"
                >
                  {copy.bookCall}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

BlogList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
};
