import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { AppLocale } from '@/lib/i18n/routing';
import type { ArticleSummary } from '../../domain/article.types';

const formatDate = (value: string | undefined, locale: AppLocale) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

function NavigationCard({
  article,
  direction,
  locale,
}: {
  article: ArticleSummary;
  direction: 'previous' | 'next';
  locale: AppLocale;
}) {
  const isArabic = locale === 'ar';
  const isPrevious = direction === 'previous';
  const label = isPrevious
    ? (isArabic ? 'المقال السابق' : 'Previous article')
    : (isArabic ? 'المقال التالي' : 'Next article');
  const publishedAt = formatDate(article.publishedAt, locale);
  const Arrow = (isPrevious !== isArabic) ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={`/${locale}/blog/${article.slug}`}
      rel={direction === 'previous' ? 'prev' : 'next'}
      className="group corner-squircle relative flex min-h-[168px] flex-col overflow-hidden rounded-[24px] border border-[rgba(8,66,153,0.1)] bg-white p-5 shadow-[0_16px_40px_rgba(8,41,89,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(8,66,153,0.2)] hover:shadow-[0_22px_50px_rgba(8,41,89,0.1)] sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(40,174,195,0.13),transparent_68%)] transition duration-500 group-hover:scale-125" aria-hidden="true" />
      <span className="relative flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.17em] text-[#47708f]">
        <Arrow size={15} strokeWidth={1.8} aria-hidden="true" />
        {label}
      </span>
      <strong className="relative mt-5 text-[1.08rem] font-medium leading-snug tracking-[-0.02em] text-[#0a2546] transition-colors group-hover:text-[#0b5da8] sm:text-[1.18rem]">
        {article.title}
      </strong>
      {publishedAt ? <span className="relative mt-auto pt-4 text-xs text-[#7a8fa7]">{publishedAt}</span> : null}
    </Link>
  );
}

export default function ArticleNavigation({ previous, next, locale }: { previous?: ArticleSummary | null; next?: ArticleSummary | null; locale: AppLocale }) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={locale === 'ar' ? 'التنقل بين المقالات' : 'Article navigation'}
      className="mx-auto mt-10 grid max-w-[760px] gap-4 sm:grid-cols-2"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {previous ? <NavigationCard article={previous} direction="previous" locale={locale} /> : <span className="hidden sm:block" aria-hidden="true" />}
      {next ? <NavigationCard article={next} direction="next" locale={locale} /> : null}
    </nav>
  );
}
