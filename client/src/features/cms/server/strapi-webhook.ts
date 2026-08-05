import { z } from 'zod';
import { cmsCacheTags } from './cms-cache';
import type { CmsLocale } from '../domain/cms.types';

const entrySchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  documentId: z.string().optional(),
  locale: z.enum(['en', 'ar']).optional(),
  slug: z.string().optional().nullable(),
  oldSlug: z.string().optional().nullable(),
  previousSlug: z.string().optional().nullable(),
  path: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
}).passthrough();

export const strapiWebhookSchema = z.object({
  event: z.string().min(1),
  model: z.union([z.string(), z.object({ uid: z.string().optional(), singularName: z.string().optional() })]),
  entry: entrySchema.optional().default({}),
}).passthrough();

const modelName = (model: z.infer<typeof strapiWebhookSchema>['model']) =>
  typeof model === 'string' ? model : model.uid || model.singularName || '';
const locales = (locale?: CmsLocale): CmsLocale[] => locale ? [locale] : ['en', 'ar'];

export const cacheTagsForStrapiWebhook = (payload: z.infer<typeof strapiWebhookSchema>): string[] => {
  const model = modelName(payload.model).toLowerCase();
  const entry = payload.entry;
  const tags = new Set<string>();
  const affectedLocales = locales(entry.locale);
  const slugs = [entry.slug, entry.oldSlug, entry.previousSlug].filter((slug): slug is string => Boolean(slug));

  if (model.includes('site-setting')) {
    tags.add(cmsCacheTags.siteSettings());
    affectedLocales.forEach((locale) => { tags.add(cmsCacheTags.navigation(locale)); tags.add(cmsCacheTags.footer(locale)); });
  } else if (model.includes('article')) {
    affectedLocales.forEach((locale) => {
      tags.add(cmsCacheTags.blogIndex(locale));
      slugs.forEach((slug) => tags.add(cmsCacheTags.blogPost(slug, locale)));
    });
    tags.add(cmsCacheTags.sitemap());
  } else if (model.includes('blog-page')) {
    affectedLocales.forEach((locale) => tags.add(cmsCacheTags.blogIndex(locale)));
  } else if (['author', 'category', 'tag'].some((name) => model.includes(name))) {
    affectedLocales.forEach((locale) => {
      tags.add(cmsCacheTags.blogIndex(locale));
      if (model.includes('category')) slugs.forEach((slug) => tags.add(cmsCacheTags.blogCategory(slug, locale)));
    });
    tags.add(cmsCacheTags.sitemap());
  } else if (model.includes('home-page') || model.includes('about-page')) {
    const path = model.includes('home-page') ? '/' : '/about';
    affectedLocales.forEach((locale) => tags.add(cmsCacheTags.page(path, locale)));
    tags.add(cmsCacheTags.sitemap());
  } else if (model.includes('page') || model.includes('offer')) {
    affectedLocales.forEach((locale) => {
      const paths = [entry.path, ...slugs.map((slug) => `/${slug}`)].filter((path): path is string => Boolean(path));
      paths.forEach((path) => tags.add(cmsCacheTags.page(path, locale)));
    });
    tags.add(cmsCacheTags.sitemap());
  }

  return [...tags];
};
