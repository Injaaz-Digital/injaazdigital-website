import type { AppLocale } from '@/lib/i18n/routing';
export type HeaderLink = { label: string; url: string; style?: string; isExternal?: boolean; trackingId?: string };
export type HeaderProps = { locale?: AppLocale; activePath?: string; onLocaleChange?: (locale: AppLocale) => void; navItems?: HeaderLink[]; servicesLabel?: string; serviceLinks?: HeaderLink[]; cta?: HeaderLink | null; showLanguageSwitcher?: boolean; onNavigate?: (url: string) => void; onPrefetch?: (url: string) => void };
