import type { AppLocale } from '@/lib/i18n/routing';
export type FooterLinkData = { label: string; url: string; isExternal?: boolean; trackingId?: string };
export type FooterColumn = { title?: string; links?: FooterLinkData[] };
export type FooterData = { tagline?: string; contactEmail?: string; copyright?: string; columns?: FooterColumn[]; socialLinks?: FooterLinkData[]; legalLinks?: FooterLinkData[] };
export type FooterProps = { locale?: AppLocale; navItems?: FooterLinkData[]; footerData?: FooterData | null };
