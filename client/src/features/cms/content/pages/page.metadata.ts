import type { Metadata } from 'next';
import { normalizeMedia } from '@/lib/strapi';
import { toAbsoluteSiteUrl } from '@/lib/config/site-config';
import type { CmsLocale, CmsSeo } from '../../domain/cms.types';
import { getCmsPage, getSiteSetting } from '../../lib/cms-page';

const DEFAULT_DESCRIPTION = 'Data-driven digital growth systems for ambitious brands.';

const keywords = (value?: string | null) => value?.split(',').map((item) => item.trim()).filter(Boolean);

export const buildCmsMetadata = ({ pathname, locale, siteName = 'Injaaz Digital', pageData, defaultSeo, noIndex = false, localizedPaths }: { pathname: string; locale: CmsLocale; siteName?: string; pageData?: any; defaultSeo?: CmsSeo | null; noIndex?: boolean; localizedPaths?: Partial<Record<CmsLocale, string>> }): Metadata => {
  const seo: CmsSeo | null = pageData?.seo || defaultSeo || null;
  const title = seo?.metaTitle || pageData?.title || siteName;
  const description = seo?.metaDescription || pageData?.description || DEFAULT_DESCRIPTION;
  const localizedPath = (activeLocale: CmsLocale) => `/${activeLocale}${pathname === '/' ? '' : pathname}`;
  const resolvedLocalizedPath = (activeLocale: CmsLocale) => localizedPaths?.[activeLocale] || localizedPath(activeLocale);
  const canonical = toAbsoluteSiteUrl(seo?.canonicalUrl || resolvedLocalizedPath(locale));
  const image = normalizeMedia(seo?.shareImage || pageData?.coverImage, { fallbackAlt: title });
  const index = !(noIndex || seo?.noIndex);
  return {
    title, description, keywords: keywords(seo?.keywords),
    alternates: { canonical, languages: { en: toAbsoluteSiteUrl(resolvedLocalizedPath('en')), ar: toAbsoluteSiteUrl(resolvedLocalizedPath('ar')), 'x-default': toAbsoluteSiteUrl(resolvedLocalizedPath('en')) } },
    robots: { index, follow: index && seo?.noFollow !== true },
    openGraph: { title: seo?.openGraphTitle || title, description: seo?.openGraphDescription || description, url: canonical, siteName, type: pageData?.slug && pathname.startsWith('/blog/') ? 'article' : 'website', images: image?.url ? [{ url: image.url, alt: image.alt || title }] : undefined, locale: locale === 'ar' ? 'ar_MA' : 'en_US', publishedTime: pageData?.publishedAt, modifiedTime: pageData?.updatedAt, authors: pageData?.author?.name ? [pageData.author.name] : undefined, tags: pageData?.tags?.map((tag: any) => tag.name).filter(Boolean) },
    twitter: { card: seo?.twitterCard || (image?.url ? 'summary_large_image' : 'summary'), title, description, images: image?.url ? [image.url] : undefined },
  };
};

export async function getCmsPageMetadata(pathname: string, locale: CmsLocale): Promise<Metadata> {
  const cms = await getCmsPage(pathname, locale);
  const settings = cms.settings || {};
  const isList = cms.data?.type === 'blog-list';
  const isPost = cms.data?.type === 'blog-post';
  const pageData = isList ? cms.data?.page : isPost ? cms.data?.article : cms.data;
  const hasContent = Boolean(pageData?.title || pageData?.description || pageData?.blocks?.length || cms.data?.articles?.length);
  return buildCmsMetadata({ pathname, locale, siteName: settings.siteName, pageData: hasContent ? pageData : { title: locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found' }, defaultSeo: settings.defaultSeo, noIndex: !hasContent || pathname === '/blog/search', localizedPaths: cms.data?.localizedPaths });
}

export async function getCustomPageMetadata(locale: CmsLocale, { pathname, title, description, noIndex = false }: { pathname: string; title: string; description: string; noIndex?: boolean }): Promise<Metadata> {
  const settings = await getSiteSetting(locale);
  return buildCmsMetadata({ pathname, locale, siteName: settings.data?.siteName, pageData: { title, description }, defaultSeo: settings.data?.defaultSeo, noIndex });
}
