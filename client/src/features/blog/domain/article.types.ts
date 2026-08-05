import type { AppLocale } from '@/lib/i18n/routing';

export type ArticleTaxonomy = { name: string; slug: string; description?: string; seo?: unknown };
export type ArticleCta = { headline?: string; body?: string; label: string; url: string; style?: 'primary' | 'secondary' | 'tertiary'; isExternal?: boolean; trackingId?: string };
export type ArticleSummary = { title: string; slug: string; excerpt?: string; publishedAt?: string; readTime?: number; readingTimeMinutes?: number; coverImage?: unknown; primaryCategory?: ArticleTaxonomy | null };
export type NormalizedArticle = ArticleSummary & {
  locale: AppLocale;
  body: string;
  headings: Array<{ id: string; title: string; level: number }>;
  author?: { name: string; slug?: string; role?: string; bio?: string; avatar?: unknown } | null;
  tags: ArticleTaxonomy[];
  primaryCategory?: ArticleTaxonomy | null;
  articleCta?: ArticleCta | null;
  relatedPosts: ArticleSummary[];
  relatedService?: Record<string, unknown> | null;
  previousArticle?: ArticleSummary | null;
  nextArticle?: ArticleSummary | null;
  readingTimeMinutes: number;
  seo?: Record<string, unknown> | null;
};
