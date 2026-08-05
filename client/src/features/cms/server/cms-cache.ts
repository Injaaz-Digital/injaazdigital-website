import type { CmsLocale } from '../domain/cms.types';

const clean = (value: string) => value.trim().replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9/_-]+/g, '-');

export const cmsCacheTags = {
  siteSettings: () => 'cms:site-settings',
  navigation: (locale: CmsLocale) => `cms:navigation:${locale}`,
  footer: (locale: CmsLocale) => `cms:footer:${locale}`,
  page: (pathname: string, locale: CmsLocale) => `cms:page:${clean(pathname) || 'home'}:${locale}`,
  blogIndex: (locale: CmsLocale) => `cms:blog:index:${locale}`,
  blogPost: (slug: string, locale: CmsLocale) => `cms:blog:post:${clean(slug)}:${locale}`,
  blogCategory: (slug: string, locale: CmsLocale) => `cms:blog:category:${clean(slug)}:${locale}`,
  sitemap: () => 'cms:sitemap',
} as const;
