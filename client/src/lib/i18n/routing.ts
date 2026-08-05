export const SUPPORTED_LOCALES = ['en', 'ar'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const LOCALE_PREFIX = /^\/(en|ar)(?=\/|$)/;

export const localeFromPathname = (pathname: string): AppLocale | null => {
  const match = pathname.match(LOCALE_PREFIX);
  return match?.[1] === 'ar' ? 'ar' : match?.[1] === 'en' ? 'en' : null;
};

export const stripLocalePrefix = (pathname: string) => {
  const stripped = pathname.replace(LOCALE_PREFIX, '');
  return stripped || '/';
};

export const localizePathname = (pathname: string, locale: AppLocale) => {
  const unprefixed = stripLocalePrefix(pathname || '/');
  return `/${locale}${unprefixed === '/' ? '' : unprefixed}`;
};

export const preferredLocale = (cookieLocale?: string | null, acceptLanguage?: string | null): AppLocale => {
  if (cookieLocale === 'ar' || cookieLocale === 'en') return cookieLocale;

  const preferredLanguages = (acceptLanguage || '')
    .split(',')
    .map((entry) => {
      const [language, ...parameters] = entry.trim().toLowerCase().split(';');
      const quality = parameters.find((parameter) => parameter.trim().startsWith('q='));
      const weight = quality ? Number.parseFloat(quality.split('=')[1]) : 1;
      return { language, weight: Number.isFinite(weight) ? weight : 0 };
    })
    .sort((left, right) => right.weight - left.weight);

  for (const { language } of preferredLanguages) {
    if (language === 'ar' || language.startsWith('ar-')) return 'ar';
    if (language === 'en' || language.startsWith('en-')) return 'en';
  }

  return 'en';
};
