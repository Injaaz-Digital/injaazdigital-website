import CmsSiteServer from '@/features/cms/renderer/CmsSiteServer';
import { loadCmsRoute, loadCmsRouteMetadata } from '@/features/cms/lib/cms-route';

export async function generateMetadata() {
  return loadCmsRouteMetadata('/blog');
}

export default async function Page() {
  const { initialLang, cms } = await loadCmsRoute('/blog');

  return (
    <CmsSiteServer route="/blog" initialLang={initialLang} cmsData={cms.data} cmsFallback={cms.fallback} />
  );
}
