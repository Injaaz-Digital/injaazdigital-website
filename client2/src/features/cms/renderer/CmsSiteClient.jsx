'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SearchX } from 'lucide-react';
import { getLocaleDirection, normalizeLocale } from '@/lib/i18n/locale';
import MainLayout from '@/shared/layout/MainLayout';
import CmsBlocksRenderer from '@/features/cms/renderer/CmsBlocksRenderer';
import { isExternalUrl } from '@/lib/config/site-config';

const BlogList = dynamic(() => import('@/features/blog/components/BlogList'));
const BlogPost = dynamic(() => import('@/features/blog/components/BlogPost'));
const BLOG_PAGE_BLOCKS = ['blocks.hero-minimal', 'blocks.rich-text', 'blocks.cta-banner'];

function InnerSite({
  route,
  initialLang,
  cmsData,
  cmsFallback,
  children,
  mainClassName = 'pt-0',
  showFooter = true,
  showBlur = true,
}) {
  const router = useRouter();
  const [locale, setLocale] = useState(() => normalizeLocale(initialLang));
  const isArabic = locale === 'ar';

  const applyLocale = useCallback((nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    if (normalized === locale) return;

    try {
      document.cookie = `lang=${normalized}; path=/; max-age=31536000`;
      localStorage.setItem('lang', normalized);
    } catch {
      // ignore persistence failures
    }

    setLocale(normalized);
    router.refresh();
  }, [locale, router]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
    document.body.dataset.locale = locale;

    try {
      document.cookie = `lang=${locale}; path=/; max-age=31536000`;
      localStorage.setItem('lang', locale);
    } catch {
      // ignore persistence failures
    }
  }, [locale]);

  const headerData = cmsData?.header;
  const footerLayout = cmsData?.footer;
  const navItems = useMemo(() => (Array.isArray(headerData?.navLinks) ? headerData.navLinks : []), [headerData]);
  const pageCta = useMemo(() => headerData?.primaryCta || null, [headerData]);

  const showLanguageSwitcher = headerData?.showLanguageSwitcher !== false;
  const footerData = useMemo(() => footerLayout || null, [footerLayout]);

  const navigate = useCallback(
    (targetUrl) => {
      if (!targetUrl) return;
      if (isExternalUrl(targetUrl)) {
        window.location.href = targetUrl;
        return;
      }
      router.push(targetUrl);
    },
    [router]
  );

  const prefetchRoute = useCallback(
    (targetUrl) => {
      if (!targetUrl) return;
      if (isExternalUrl(targetUrl)) return;
      const [path] = targetUrl.split('#');
      if (!path) return;
      router.prefetch(path);
    },
    [router]
  );

  const hasBlocks = Array.isArray(cmsData?.blocks) && cmsData.blocks.length > 0;
  const hasCustomContent = Boolean(children);
  const isBlogPage = cmsData?.type === 'blog-list' || cmsData?.type === 'blog-post';
  const blogListBlocks = Array.isArray(cmsData?.page?.blocks) ? cmsData.page.blocks : [];
  const hasBlogListBlocks = cmsData?.type === 'blog-list' && blogListBlocks.length > 0;
  const hasRenderableBlocks = hasBlocks || hasBlogListBlocks;

  return (
    <MainLayout
      locale={locale}
      activePath={route}
      navItems={navItems}
      cta={pageCta}
      footerData={footerData}
      showLanguageSwitcher={showLanguageSwitcher}
      onLocaleChange={applyLocale}
      onNavigate={navigate}
      onPrefetch={prefetchRoute}
      mainClassName={mainClassName}
      showFooter={showFooter}
      showBlur={showBlur}
    >
      {cmsFallback ? (
        <div className="layout-container--narrow mt-4 rounded-xl border border-[rgba(8,66,153,0.14)] bg-[#edf6ff] px-4 py-2 text-sm text-[#27446e]">
          {isArabic
            ? 'يتم عرض النسخة الإنجليزية مؤقتاً إلى أن يتوفر محتوى عربي لهذا المسار.'
            : 'Showing English fallback while Arabic content is not available for this route.'}
        </div>
      ) : null}
      {hasBlocks ? <CmsBlocksRenderer blocks={cmsData?.blocks} locale={locale} onNavigate={navigate} /> : null}
      {hasBlogListBlocks ? (
        <CmsBlocksRenderer
          blocks={blogListBlocks}
          locale={locale}
          onNavigate={navigate}
          allowedComponents={BLOG_PAGE_BLOCKS}
        />
      ) : null}
      {cmsData?.type === 'blog-list' ? <BlogList articles={cmsData.articles || []} locale={locale} /> : null}
      {cmsData?.type === 'blog-post' ? <BlogPost article={cmsData.article} locale={locale} /> : null}
      {hasCustomContent ? children : null}
      {!hasRenderableBlocks && !isBlogPage && !hasCustomContent ? (
        <section className="layout-container grid min-h-[calc(100vh-var(--header-height)-7rem)] place-items-center py-12">
          <div className="w-full max-w-[620px] bg-transparent px-6 py-10 text-center sm:px-9">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center text-[#0b5da8]">
              <SearchX size={30} strokeWidth={2.2} />
            </div>
            <h1 className="mb-2 text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold tracking-[-0.02em] text-slate-900">
              {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
            </h1>
            <p className="mx-auto max-w-[50ch] text-[clamp(0.98rem,1.2vw,1.06rem)] leading-relaxed text-slate-600">
              {isArabic
                ? 'الصفحة المطلوبة غير منشورة حالياً أو تم نقلها. تحقق من الرابط أو اختر صفحة أخرى من القائمة.'
                : 'The requested page is not published yet or has moved. Check the URL or choose another page from navigation.'}
            </p>
          </div>
        </section>
      ) : null}
    </MainLayout>
  );
}

export default function SiteClient({
  route = '/',
  initialLang = 'en',
  cmsData = null,
  cmsFallback = false,
  children = null,
  mainClassName = 'pt-0',
  showFooter = true,
  showBlur = true,
}) {
  return (
    <InnerSite
      route={route}
      initialLang={initialLang}
      cmsData={cmsData}
      cmsFallback={cmsFallback}
      mainClassName={mainClassName}
      showFooter={showFooter}
      showBlur={showBlur}
    >
      {children}
    </InnerSite>
  );
}
