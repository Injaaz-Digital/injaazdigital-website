import CmsSiteClient from '@/features/cms/renderer/CmsSiteClient';
import { loadCmsRoute, loadCmsRouteMetadata } from '@/features/cms/lib/cms-route';

export async function generateMetadata() {
  return loadCmsRouteMetadata('/');
}

export default async function Page() {
  const { initialLang, cms } = await loadCmsRoute('/');

  return (
    <CmsSiteClient
      route="/"
      initialLang={initialLang}
      cmsData={cms.data}
      cmsFallback={cms.fallback}
    />
  );
}
