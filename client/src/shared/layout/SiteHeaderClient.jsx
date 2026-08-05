'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import { getLocaleDirection, normalizeLocale } from '@/lib/i18n/locale';
import { localizePathname } from '@/lib/i18n/routing';
import { isExternalUrl } from '@/lib/config/site-config';

export default function SiteHeaderClient({ initialLocale, activePath, headerData, localizedPaths }) {
  const router = useRouter();
  const [locale, setLocale] = useState(() => normalizeLocale(initialLocale));

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
    document.body.dataset.locale = locale;
  }, [locale]);

  const applyLocale = useCallback((nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    if (normalized === locale) return;
    document.cookie = `lang=${normalized}; path=/; max-age=31536000; samesite=lax`;
    setLocale(normalized);
    const translatedPath = localizedPaths?.[normalized];
    router.push(translatedPath || localizePathname(activePath, normalized));
  }, [activePath, locale, localizedPaths, router]);

  const navigate = useCallback((targetUrl) => {
    if (!targetUrl) return;
    if (isExternalUrl(targetUrl)) window.location.assign(targetUrl);
    else router.push(targetUrl);
  }, [router]);

  const prefetch = useCallback((targetUrl) => {
    if (!targetUrl || isExternalUrl(targetUrl)) return;
    const [path] = targetUrl.split('#');
    if (path) router.prefetch(path);
  }, [router]);

  return <Header locale={locale} activePath={activePath} navItems={headerData?.navLinks || []} servicesLabel={headerData?.servicesLabel} serviceLinks={headerData?.serviceLinks || []} cta={headerData?.primaryCta} showLanguageSwitcher={headerData?.showLanguageSwitcher !== false} onLocaleChange={applyLocale} onNavigate={navigate} onPrefetch={prefetch} />;
}
