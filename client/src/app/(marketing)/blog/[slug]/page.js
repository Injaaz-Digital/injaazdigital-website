import CmsSiteServer from '@/features/cms/renderer/CmsSiteServer';
import { loadCmsRoute, loadCmsRouteMetadata } from '@/features/cms/lib/cms-route';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';

  return loadCmsRouteMetadata(`/blog/${slug}`);
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const pathname = `/blog/${slug}`;
  const { initialLang, cms } = await loadCmsRoute(pathname);

  return (
    <CmsSiteServer route={pathname} initialLang={initialLang} cmsData={cms.data} cmsFallback={cms.fallback} />
  );
}
