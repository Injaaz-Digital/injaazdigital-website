import CmsSiteServer from '@/features/cms/renderer/CmsSiteServer';
import { loadCmsRoute, loadCmsRouteMetadata } from '@/features/cms/lib/cms-route';

export async function generateMetadata() {
  return loadCmsRouteMetadata('/book-call');
}

export default async function Page() {
  const { initialLang, cms } = await loadCmsRoute('/book-call');

  return (
    <CmsSiteServer
      route="/book-call"
      initialLang={initialLang}
      cmsData={cms.data}
      cmsFallback={cms.fallback}
      mainClassName="pt-[calc(var(--header-height)+.5rem)] pb-3 md:pt-[calc(var(--header-height)+1rem)] md:pb-4"
      showFooter={false}
      showBlur={false}
    />
  );
}
