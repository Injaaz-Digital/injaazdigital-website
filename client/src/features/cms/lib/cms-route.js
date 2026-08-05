import { getInitialLang } from '@/lib/i18n/locale.server';
import { getCmsPage } from './cms-page';
import { getCmsPageMetadata, getCustomPageMetadata } from '../content/pages/page.metadata';

export async function loadCmsRoute(pathname, options = {}) {
  const initialLang = await getInitialLang();
  const cms = await getCmsPage(pathname, initialLang, options);

  return {
    initialLang,
    cms,
  };
}

export async function loadCmsRouteForLocale(pathname, locale, options = {}) {
  const cms = await getCmsPage(pathname, locale, options);
  return { initialLang: locale, cms };
}

export async function loadCmsRouteMetadataForLocale(pathname, locale) {
  return getCmsPageMetadata(pathname, locale);
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
