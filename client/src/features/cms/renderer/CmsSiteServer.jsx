import { SearchX } from 'lucide-react';
import SiteHeaderClient from '@/shared/layout/SiteHeaderClient';
import Footer from '@/shared/layout/Footer';
import CmsBlocksRenderer from './CmsBlocksRenderer';
import BlogList from '@/features/blog/components/BlogList';
import BlogPost from '@/features/blog/components/BlogPost';
import StructuredData from '@/features/cms/seo/StructuredData';

const BLOG_INTRO_BLOCKS = ['blocks.hero-minimal'];
const BLOG_OUTRO_BLOCKS = ['blocks.final-cta'];
const NON_PAGE_URL = /^\/(?:uploads|api|_next)(?:\/|$)/;

const shouldLocalizeUrl = (url) =>
  url.startsWith('/')
  && !url.startsWith('//')
  && !NON_PAGE_URL.test(url)
  && !/^\/(?:en|ar)(?=\/|$)/.test(url);

const localizeInternalUrls = (value, locale) => {
  if (Array.isArray(value)) return value.map((item) => localizeInternalUrls(item, locale));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => {
    if (key === 'url' && typeof item === 'string' && shouldLocalizeUrl(item)) {
      return [key, `/${locale}${item === '/' ? '' : item}`];
    }
    return [key, localizeInternalUrls(item, locale)];
  }));
};

export default function CmsSiteServer({ route = '/', initialLang = 'en', cmsData = null, cmsFallback = false, children = null, mainClassName = 'pt-0', showFooter = true }) {
  const locale = initialLang === 'ar' ? 'ar' : 'en';
  const usesLocalizedUrls = /^\/(en|ar)(?=\/|$)/.test(route);
  const resolvedData = usesLocalizedUrls ? localizeInternalUrls(cmsData, locale) : cmsData;
  const headerData = resolvedData?.header;
  const footerData = resolvedData?.footer;
  const blocks = Array.isArray(resolvedData?.blocks) ? resolvedData.blocks : [];
  const blogBlocks = resolvedData?.type === 'blog-list' && Array.isArray(resolvedData?.page?.blocks) ? resolvedData.page.blocks : [];
  const blogIntroBlocks = blogBlocks.filter((block) => BLOG_INTRO_BLOCKS.includes(block?.__component));
  const blogOutroBlocks = resolvedData?.type === 'blog-list' && resolvedData?.page?.finalCta
    ? [{ ...resolvedData.page.finalCta, __component: 'blocks.final-cta' }]
    : [];
  const isBlogPage = resolvedData?.type === 'blog-list' || resolvedData?.type === 'blog-post';
  const hasContent = blocks.length > 0 || blogBlocks.length > 0 || isBlogPage || Boolean(children);
  const localizedPaths = resolvedData?.localizedPaths || null;

  return (
    <div className="app-shell flex min-h-screen flex-col bg-[#f8fbff]">
      <StructuredData route={route} data={resolvedData} />
      <SiteHeaderClient initialLocale={locale} activePath={route} headerData={headerData} localizedPaths={localizedPaths} />
      <main className={`flex-1 ${mainClassName}`}>
        {cmsFallback ? <div className="layout-container--narrow mt-4 rounded-xl border border-[rgba(8,66,153,0.14)] bg-[#edf6ff] px-4 py-2 text-sm text-[#27446e]">{locale === 'ar' ? 'يتم عرض النسخة الإنجليزية مؤقتاً إلى أن يتوفر محتوى عربي لهذا المسار.' : 'Showing English fallback while Arabic content is not available for this route.'}</div> : null}
        {blocks.length ? <CmsBlocksRenderer blocks={blocks} locale={locale} route={route} /> : null}
        {blogIntroBlocks.length ? <CmsBlocksRenderer blocks={blogIntroBlocks} locale={locale} route={route} allowedComponents={BLOG_INTRO_BLOCKS} /> : null}
        {resolvedData?.type === 'blog-list' ? <BlogList articles={resolvedData.articles || []} locale={locale} title={resolvedData?.page?.title} description={resolvedData?.page?.description} /> : null}
        {blogOutroBlocks.length ? <CmsBlocksRenderer blocks={blogOutroBlocks} locale={locale} route={route} allowedComponents={BLOG_OUTRO_BLOCKS} /> : null}
        {resolvedData?.type === 'blog-post' ? <BlogPost article={resolvedData.article} locale={locale} /> : null}
        {children}
        {!hasContent ? <section className="layout-container grid min-h-[calc(100vh-var(--header-height)-7rem)] place-items-center py-12"><div className="w-full max-w-[620px] px-6 py-10 text-center"><SearchX className="mx-auto mb-4 text-[#0b5da8]" size={30} /><h1 className="text-3xl font-bold text-slate-900">{locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}</h1><p className="mx-auto mt-2 max-w-[50ch] text-slate-600">{locale === 'ar' ? 'الصفحة المطلوبة غير منشورة حالياً أو تم نقلها.' : 'The requested page is not published yet or has moved.'}</p></div></section> : null}
      </main>
      {showFooter ? <Footer locale={locale} navItems={headerData?.navLinks || []} footerData={footerData} /> : null}
    </div>
  );
}
