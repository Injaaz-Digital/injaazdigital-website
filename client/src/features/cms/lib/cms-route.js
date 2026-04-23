import { getInitialLang } from '@/lib/i18n/locale.server';
import { getCmsPage, getCmsPageMetadata, getCustomPageMetadata } from './cms-page';

export async function loadCmsRoute(pathname) {
  const initialLang = await getInitialLang();
  const cms = await getCmsPage(pathname, initialLang);

  return {
    initialLang,
    cms,
  };
}

export async function loadCmsRouteMetadata(pathname) {
  const initialLang = await getInitialLang();
  return getCmsPageMetadata(pathname, initialLang);
}

export async function loadCustomRouteMetadata(locale, { pathname, title, description, noIndex = false }) {
  return getCustomPageMetadata(locale, {
    pathname,
    title,
    description,
    noIndex,
  });
}
