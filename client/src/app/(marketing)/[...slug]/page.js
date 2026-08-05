import CmsSiteServer from '@/features/cms/renderer/CmsSiteServer';
import { loadCmsRoute, loadCmsRouteForLocale, loadCmsRouteMetadata, loadCmsRouteMetadataForLocale } from '@/features/cms/lib/cms-route';

const resolveRoute = (slugParts) => {
  const locale = slugParts[0] === 'en' || slugParts[0] === 'ar' ? slugParts[0] : null;
  const cmsParts = locale ? slugParts.slice(1) : slugParts;
  return { locale, cmsPathname: cmsParts.length ? `/${cmsParts.join('/')}` : '/', publicPathname: `/${slugParts.join('/')}` };
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugParts = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
  const { locale, cmsPathname } = resolveRoute(slugParts);
  return locale ? loadCmsRouteMetadataForLocale(cmsPathname, locale) : loadCmsRouteMetadata(cmsPathname);
}

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slugParts = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
  const { locale, cmsPathname, publicPathname } = resolveRoute(slugParts);
  const options = { searchParams: resolvedSearchParams || {} };
  const { initialLang, cms } = locale ? await loadCmsRouteForLocale(cmsPathname, locale, options) : await loadCmsRoute(cmsPathname, options);
  const isBookCall = cmsPathname === '/book-call';

  return (
    <CmsSiteServer
      route={publicPathname}
      initialLang={initialLang}
      cmsData={cms.data}
      cmsFallback={cms.fallback}
      mainClassName={isBookCall ? 'pt-[calc(var(--header-height)+.5rem)] pb-3 md:pt-[calc(var(--header-height)+1rem)] md:pb-4' : undefined}
      showFooter={!isBookCall}
    />
  );
}
