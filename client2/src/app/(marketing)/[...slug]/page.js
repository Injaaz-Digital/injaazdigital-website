import CmsSiteClient from '@/features/cms/renderer/CmsSiteClient';
import { loadCmsRoute, loadCmsRouteMetadata } from '@/features/cms/lib/cms-route';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugParts = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
  const pathname = `/${slugParts.join('/')}`;
  return loadCmsRouteMetadata(pathname);
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slugParts = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
  const pathname = `/${slugParts.join('/')}`;
  const { initialLang, cms } = await loadCmsRoute(pathname);

  return (
    <CmsSiteClient
      route={pathname}
      initialLang={initialLang}
      cmsData={cms.data}
      cmsFallback={cms.fallback}
    />
  );
}
