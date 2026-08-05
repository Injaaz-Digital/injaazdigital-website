import Link from 'next/link';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { normalizeMedia } from '@/lib/strapi';
import type { AppLocale } from '@/lib/i18n/routing';
import { CmsImage } from '../shared';
import type { ArticleSummary } from '../../domain/article.types';

function RelatedArticleCard({ article, locale }: { article: ArticleSummary; locale: AppLocale }) {
  const image = normalizeMedia(article.coverImage, { fallbackAlt: article.title });
  const category = article.primaryCategory?.name;
  const readTime = article.readingTimeMinutes || article.readTime;

  return (
    <Link
      href={`/${locale}/blog/${article.slug}`}
      className="group corner-squircle overflow-hidden rounded-[24px] border border-[rgba(8,66,153,0.09)] bg-white p-2 shadow-[0_16px_40px_rgba(8,41,89,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(8,41,89,0.1)]"
    >
      <div className="relative h-40 overflow-hidden rounded-[18px] bg-[linear-gradient(145deg,#f4f9ff,#eaf3fc)]">
        {image?.url ? (
          <CmsImage
            media={article.coverImage}
            src={image.url}
            alt={article.title}
            sizes="(min-width: 768px) 360px, 100vw"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(40,174,195,0.2),transparent_42%)]" aria-hidden="true" />
        )}
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#0a2546] shadow-sm backdrop-blur transition duration-300 group-hover:rotate-6 group-hover:bg-[#0a2546] group-hover:text-white">
          <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </div>
      <div className="px-3 pb-4 pt-4">
        <div className="flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#547594]">
          {category ? <span>{category}</span> : null}
          {readTime ? (
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[#7a8fa7]">
              <Clock3 size={13} aria-hidden="true" />
              {readTime} {locale === 'ar' ? 'دقيقة' : 'min read'}
            </span>
          ) : null}
        </div>
        <strong className="mt-2.5 block text-[1.06rem] font-medium leading-snug tracking-[-0.02em] text-[#0a2546] transition-colors group-hover:text-[#0b5da8]">
          {article.title}
        </strong>
        {article.excerpt ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#587392]">{article.excerpt}</p> : null}
      </div>
    </Link>
  );
}

export default function RelatedContent({ articles, service, locale }: { articles: ArticleSummary[]; service?: any; locale: AppLocale }) {
  if (!articles.length && !service) return null;
  const prefix = `/${locale}`;

  return (
    <section className="layout-container section section--tight" aria-labelledby="related-content-title" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1160px] border-t border-[rgba(8,66,153,0.09)] pt-10 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#547594]">
              {locale === 'ar' ? 'المزيد من الأفكار' : 'More insights'}
            </p>
            <h2 id="related-content-title" className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.035em] text-[#0a2546]">
              {locale === 'ar' ? 'تابع القراءة' : 'Continue exploring'}
            </h2>
          </div>
          <Link href={`${prefix}/blog`} className="text-sm font-semibold text-[#0b5da8] transition hover:text-[#0a2546]">
            {locale === 'ar' ? 'عرض جميع المقالات' : 'View all articles'}
          </Link>
        </div>

        {articles.length ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.slice(0, 4).map((article) => <RelatedArticleCard key={article.slug} article={article} locale={locale} />)}
          </div>
        ) : null}

        {service?.slug ? (
          <Link href={`${prefix}/${service.slug}`} className="group mt-5 flex items-center justify-between gap-4 rounded-[22px] bg-[#0a2546] p-5 text-white transition hover:bg-[#10315a] sm:p-6">
            <span>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/60">{locale === 'ar' ? 'خدمة مرتبطة' : 'Related service'}</span>
              <strong className="mt-1.5 block text-lg font-medium">{service.name}</strong>
            </span>
            <ArrowUpRight className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
