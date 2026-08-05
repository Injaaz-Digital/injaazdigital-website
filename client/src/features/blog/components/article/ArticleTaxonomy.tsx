import Link from 'next/link';
import type { AppLocale } from '@/lib/i18n/routing';
import type { ArticleTaxonomy } from '../../domain/article.types';

export default function ArticleTaxonomy({ category, tags, locale }: { category?: ArticleTaxonomy | null; tags: ArticleTaxonomy[]; locale: AppLocale }) {
  const prefix = `/${locale}/blog`;
  if (!category && tags.length === 0) return null;
  return <nav aria-label={locale === 'ar' ? 'تصنيفات المقال' : 'Article taxonomy'} className="mx-auto mt-6 flex max-w-[760px] flex-wrap gap-2">
    {category ? <Link href={`${prefix}/category/${category.slug}`} className="rounded-full bg-[#0a2546] px-3 py-1.5 text-xs font-semibold text-white">{category.name}</Link> : null}
    {tags.map((tag) => <Link key={tag.slug} href={`${prefix}/tag/${tag.slug}`} className="rounded-full bg-[#edf4fb] px-3 py-1.5 text-xs text-[#355884]">#{tag.name}</Link>)}
  </nav>;
}
