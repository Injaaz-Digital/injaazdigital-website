const ABSOLUTE_URL_REGEX = /^https?:\/\//i;
const EXTERNAL_URL_REGEX = /^(https?:\/\/|mailto:|tel:)/i;
const BARE_DOMAIN_URL_REGEX =
  /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\:[0-9]+)?(?:[/?#][^\s]*)?$/i;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://127.0.0.1:3000';

export const CMS_SINGLE_TYPE_BY_PATH = Object.freeze({
  '/': 'home-page',
  '/growth-engine': 'growth-engine-page',
  '/web-studio': 'web-studio-page',
  '/about': 'about-page',
  '/blog': 'blog-page',
});

export const STATIC_SITE_PATHS = Object.freeze([
  '/',
  '/growth-engine',
  '/web-studio',
  '/about',
  '/blog',
  '/book-call',
]);

const splitHash = (value) => {
  const [pathWithQuery, hash = ''] = value.split('#');
  return { pathWithQuery, hash };
};

const splitQuery = (value) => {
  const [pathname, query = ''] = value.split('?');
  return { pathname, query };
};

export const isAbsoluteUrl = (url = '') => ABSOLUTE_URL_REGEX.test(url);

export const isExternalUrl = (url = '') => EXTERNAL_URL_REGEX.test(url);

export const isHashUrl = (url = '') => url.startsWith('#');

export const isInternalUrl = (url = '') => url.startsWith('/');

export const isBareDomainUrl = (url = '') => BARE_DOMAIN_URL_REGEX.test(url.trim());

const toHttpsUrl = (url = '') => `https://${url.replace(/^\/+/, '')}`;

export const normalizeCmsUrl = (rawUrl, { forceExternal = false } = {}) => {
  const value = typeof rawUrl === 'string' ? rawUrl.trim() : '';
  if (!value) return '';
  if (isExternalUrl(value) || isHashUrl(value)) return value;
  if ((forceExternal || isBareDomainUrl(value)) && !isInternalUrl(value)) {
    return toHttpsUrl(value);
  }

  const { pathWithQuery, hash } = splitHash(value);
  const { pathname, query } = splitQuery(pathWithQuery);
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const normalizedPath = withLeadingSlash === '/' ? withLeadingSlash : withLeadingSlash.replace(/\/+$/, '');

  const withQuery = query ? `${normalizedPath}?${query}` : normalizedPath;
  return hash ? `${withQuery}#${hash}` : withQuery;
};

export const matchPathname = (href, pathname) => {
  if (!href || isExternalUrl(href) || isHashUrl(href)) return false;

  const normalizedHref = normalizeCmsUrl(href).split('?')[0];
  const normalizedPathname = normalizeCmsUrl(pathname).split('?')[0];

  if (normalizedHref === '/') {
    return normalizedPathname === '/';
  }

  return normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`);
};

export const toAbsoluteSiteUrl = (pathname = '/') => {
  if (isAbsoluteUrl(pathname)) {
    return pathname;
  }

  return new URL(normalizeCmsUrl(pathname) || '/', SITE_URL).toString();
};
