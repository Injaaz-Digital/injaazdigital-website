import { cache } from 'react';
import { fetchContentIndex } from '@/lib/strapi';
import { STATIC_SITE_PATHS, normalizeCmsUrl, toAbsoluteSiteUrl } from '@/lib/config/site-config';
import { cmsLogger } from '../../server/cms-logger';
import type { CmsLocale } from '../../domain/cms.types';

type SitemapEntity = { documentId?: unknown; slug?: unknown; updatedAt?: unknown };
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const date = (value: unknown) => { const parsed = value ? new Date(String(value)) : new Date(); return Number.isNaN(parsed.getTime()) ? new Date() : parsed; };
const localizedPath = (locale: CmsLocale, pathname: string) => `/${locale}${pathname === '/' ? '' : pathname}`;
const entry = (locale: CmsLocale, pathname: string, updatedAt?: unknown, localizedPaths?: Partial<Record<CmsLocale, string>>) => ({
  url: toAbsoluteSiteUrl(localizedPath(locale, pathname)),
  lastModified: date(updatedAt),
  alternates: { languages: {
    en: toAbsoluteSiteUrl(localizedPaths?.en || localizedPath('en', pathname)),
    ar: toAbsoluteSiteUrl(localizedPaths?.ar || localizedPath('ar', pathname)),
  } },
});

const fetchPublished = (contentType: string, locale: CmsLocale) => fetchContentIndex(contentType, locale, {
  _sitemap: true,
  fields: ['slug', 'documentId', 'updatedAt', 'publishedAt'],
  filters: { publishedAt: { $notNull: true } },
  pagination: { pageSize: 1000 },
});

export const getSitemapEntries = cache(async () => {
  try {
    const [enArticles, arArticles, enPages, arPages, enAuthors, arAuthors, enCategories, arCategories, enTags, arTags] = await Promise.all([
      fetchPublished('articles', 'en'), fetchPublished('articles', 'ar'), fetchPublished('pages', 'en'), fetchPublished('pages', 'ar'),
      fetchPublished('authors', 'en'), fetchPublished('authors', 'ar'), fetchPublished('categories', 'en'), fetchPublished('categories', 'ar'),
      fetchPublished('tags', 'en'), fetchPublished('tags', 'ar'),
    ]);
    const entries = new Map<string, ReturnType<typeof entry>>();
    for (const locale of ['en', 'ar'] as const) {
      STATIC_SITE_PATHS.forEach((pathname) => entries.set(localizedPath(locale, pathname), entry(locale, pathname)));
    }
    const byDocumentId = (entities: SitemapEntity[]) => {
      const indexed = new Map<string, SitemapEntity>();
      entities.forEach((entity) => {
        const documentId = text(entity.documentId);
        if (documentId) indexed.set(documentId, entity);
      });
      return indexed;
    };
    const enArticleByDocument = byDocumentId(enArticles as SitemapEntity[]);
    const arArticleByDocument = byDocumentId(arArticles as SitemapEntity[]);
    const enPageByDocument = byDocumentId(enPages as SitemapEntity[]);
    const arPageByDocument = byDocumentId(arPages as SitemapEntity[]);
    const addEntities = (entities: SitemapEntity[], locale: CmsLocale, counterparts: Map<string, SitemapEntity>, prefix = '') => entities.forEach((entity) => {
      const slug = text(entity.slug);
      if (!slug) return;
      const pathname = normalizeCmsUrl(`/${prefix}${slug}`);
      const alternateLocale: CmsLocale = locale === 'ar' ? 'en' : 'ar';
      const alternateSlug = text(counterparts.get(text(entity.documentId))?.slug) || slug;
      const alternatePathname = normalizeCmsUrl(`/${prefix}${alternateSlug}`);
      const localizedPaths = {
        [locale]: localizedPath(locale, pathname),
        [alternateLocale]: localizedPath(alternateLocale, alternatePathname),
      };
      entries.set(localizedPath(locale, pathname), entry(locale, pathname, entity.updatedAt, localizedPaths));
    });
    addEntities(enArticles as SitemapEntity[], 'en', arArticleByDocument, 'blog/');
    addEntities(arArticles as SitemapEntity[], 'ar', enArticleByDocument, 'blog/');
    addEntities((enPages as SitemapEntity[]).filter((page) => !['home', 'about'].includes(text(page.slug))), 'en', arPageByDocument);
    addEntities((arPages as SitemapEntity[]).filter((page) => !['home', 'about'].includes(text(page.slug))), 'ar', enPageByDocument);
    const addTaxonomyPair = (english: SitemapEntity[], arabic: SitemapEntity[], prefix: string) => {
      const englishIndex = byDocumentId(english); const arabicIndex = byDocumentId(arabic);
      addEntities(english, 'en', arabicIndex, `blog/${prefix}/`); addEntities(arabic, 'ar', englishIndex, `blog/${prefix}/`);
    };
    addTaxonomyPair(enAuthors as SitemapEntity[], arAuthors as SitemapEntity[], 'author');
    addTaxonomyPair(enCategories as SitemapEntity[], arCategories as SitemapEntity[], 'category');
    addTaxonomyPair(enTags as SitemapEntity[], arTags as SitemapEntity[], 'tag');
    return [...entries.values()];
  } catch (error) {
    const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : 'SITEMAP_CMS_UNAVAILABLE';
    cmsLogger.error('Sitemap generation failed; serving stable localized entries.', { operation: 'cms.sitemap.generate', errorCode });
    return (['en', 'ar'] as const).flatMap((locale) => STATIC_SITE_PATHS.map((pathname) => entry(locale, pathname)));
  }
});
