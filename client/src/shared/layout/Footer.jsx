import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Dribbble,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Send,
  Twitter,
  Youtube,
} from 'lucide-react';
import LogoEn from '@/shared/brand/Logo_name2.svg';
import LogoAr from '@/shared/brand/logo_name_ar2.svg';
import { getLocaleDirection, normalizeLocale } from '@/lib/i18n/locale';
import { isExternalUrl, isHashUrl, normalizeCmsUrl } from '@/lib/config/site-config';

const SOCIAL_MATCHERS = [
  { key: 'linkedin', tokens: ['linkedin', 'linked in', 'linkedin.com'] },
  { key: 'twitter', tokens: ['twitter', 'x.com'] },
  { key: 'x', tokens: [' x ', '/x', 'x/'] },
  { key: 'instagram', tokens: ['instagram'] },
  { key: 'facebook', tokens: ['facebook'] },
  { key: 'youtube', tokens: ['youtube', 'youtu.be'] },
  { key: 'telegram', tokens: ['telegram', 't.me'] },
  { key: 'dribbble', tokens: ['dribbble'] },
];

const normalizeEmailAddress = (value) => {
  if (typeof value !== 'string') return '';

  return value.replace(/^mailto:/i, '').trim();
};

const getSocialIconKey = (item) => {
  const fingerprint = ` ${item?.label || ''} ${item?.url || ''} `.toLowerCase();
  const platform = SOCIAL_MATCHERS.find(({ tokens }) => tokens.some((token) => fingerprint.includes(token)));

  return platform?.key || 'fallback';
};

const iconGradient = (
  <defs>
    <linearGradient id="footer-icon-gradient" x1="0.06" y1="0.06" x2="1.1269" y2="1.7709">
      <stop offset="6%" stopColor="#084299" />
      <stop offset="100%" stopColor="#28AEC3" />
    </linearGradient>
  </defs>
);

const SocialIcon = ({ iconKey }) => {
  switch (iconKey) {
    case 'dribbble':
      return (
        <Dribbble className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Dribbble>
      );
    case 'facebook':
      return (
        <Facebook className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Facebook>
      );
    case 'instagram':
      return (
        <Instagram className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Instagram>
      );
    case 'linkedin':
      return (
        <Linkedin className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Linkedin>
      );
    case 'telegram':
      return (
        <Send className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Send>
      );
    case 'twitter':
    case 'x':
      return (
        <Twitter className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Twitter>
      );
    case 'youtube':
      return (
        <Youtube className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Youtube>
      );
    default:
      return (
        <Globe className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
          {iconGradient}
        </Globe>
      );
  }
};

SocialIcon.propTypes = {
  iconKey: PropTypes.string.isRequired,
};

const GlassIcon = ({ children, padding = '11px', className = '' }) => (
  <span
    className={`inline-flex items-center justify-center corner-squircle overflow-hidden rounded-3xl border border-[rgba(15,51,96,0.1)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(243,248,255,0.88))] shadow-[0_10px_24px_rgba(15,51,96,0.08)] ${className}`.trim()}
    style={{ padding }}
  >
    <span className="flex items-center justify-center">{children}</span>
  </span>
);

GlassIcon.propTypes = {
  children: PropTypes.node.isRequired,
  padding: PropTypes.string,
  className: PropTypes.string,
};

const FooterLink = ({ item, onNavigate, className = '' }) => {
  const href = normalizeCmsUrl(item?.url);
  const label = item?.label;

  if (!href || !label) {
    return null;
  }

  if (item.isExternal || isExternalUrl(href) || isHashUrl(href)) {
    return (
      <a
        href={href}
        className={className}
        target={item.isExternal || isExternalUrl(href) ? '_blank' : undefined}
        rel={item.isExternal || isExternalUrl(href) ? 'noreferrer' : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {label}
    </Link>
  );
};

FooterLink.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
    isExternal: PropTypes.bool,
  }),
  onNavigate: PropTypes.func,
  className: PropTypes.string,
};

const SocialLink = ({ item, onNavigate }) => {
  const href = normalizeCmsUrl(item?.url);
  const label = item?.label;
  const iconKey = getSocialIconKey(item);

  if (!href || !label) {
    return null;
  }

  const className =
    'group inline-flex h-9 w-9 items-center justify-center transition-transform duration-300 hover:-translate-y-0.5';
  const accent = (
    <>
      <GlassIcon padding="7px" className="h-9 w-9 transition-shadow duration-300 group-hover:shadow-[0_16px_36px_rgba(14,65,118,0.14)]">
        <span className="flex items-center justify-center">
          <SocialIcon iconKey={iconKey} />
        </span>
      </GlassIcon>
      <span className="sr-only">{label}</span>
    </>
  );

  if (item.isExternal || isExternalUrl(href) || isHashUrl(href)) {
    return (
      <a
        href={href}
        aria-label={label}
        className={className}
        target={item.isExternal || isExternalUrl(href) ? '_blank' : undefined}
        rel={item.isExternal || isExternalUrl(href) ? 'noreferrer' : undefined}
      >
        {accent}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={className}
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {accent}
    </Link>
  );
};

SocialLink.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
    isExternal: PropTypes.bool,
  }),
  onNavigate: PropTypes.func,
};

function Footer({ locale = 'en', navItems = [], footerData = null, onNavigate }) {
  const normalizedLocale = normalizeLocale(locale);
  const isArabic = normalizedLocale === 'ar';
  const logoSrc = isArabic ? (LogoAr?.src || LogoAr) : (LogoEn?.src || LogoEn);
  const contactEmail = normalizeEmailAddress(footerData?.contactEmail);

  const columns =
    footerData?.columns?.length > 0
      ? footerData.columns
      : [
          {
            title: isArabic ? 'التنقل' : 'Navigation',
            links: navItems.slice(0, 4),
          },
        ];

  const socialLinks = footerData?.socialLinks || [];
  const legalLinks = footerData?.legalLinks || [];
  const tagline =
    footerData?.tagline ||
    (isArabic
      ? 'أنظمة نمو عملية تربط الانتباه بالحجز والإيراد.'
      : 'Practical growth systems that connect attention to bookings and revenue.');
  const copyright =
    footerData?.copyright ||
    '© 2026 Injaaz Digital. All rights reserved.';

  return (
    <footer dir={getLocaleDirection(normalizedLocale)} className="relative border-t border-[rgba(8,66,153,0.08)] bg-white/88">
      <div className="layout-container relative grid gap-10 py-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:py-14">
        <div className="max-w-[34rem]">
          <Link
            href="/"
            onClick={(event) => {
              if (!onNavigate) return;
              event.preventDefault();
              onNavigate('/');
            }}
            className="inline-flex rounded-2xl transition-opacity hover:opacity-90"
          >
            <img src={logoSrc} alt="Injaaz Digital" className="h-[54px] w-[138px] object-contain" />
          </Link>

          <p className="mt-4 max-w-[34ch] text-[0.98rem] leading-7 text-[#4c6380]">{tagline}</p>

          {contactEmail ? (
            <a
              href={`mailto:${contactEmail}`}
              className="group mt-5 inline-flex items-center gap-2.5 text-sm font-medium text-[#173b66] transition-colors duration-300 hover:text-[#0b4f8c]"
            >
              <GlassIcon padding="8px" className="transition-transform duration-300 group-hover:scale-105">
                <Mail className="h-4 w-4" color="url(#footer-icon-gradient)" strokeWidth={1.9}>
                  {iconGradient}
                </Mail>
              </GlassIcon>
              <span>{contactEmail}</span>
            </a>
          ) : null}

          {socialLinks.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <SocialLink
                  key={`social-${item.url}`}
                  item={item}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((column, index) => (
            <nav
              key={`${column.title || 'column'}-${index}`}
              aria-label={column.title || (isArabic ? 'روابط التذييل' : 'Footer links')}
              className="space-y-3"
            >
              {column.title ? (
                <p className="text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#607792]">{column.title}</p>
              ) : null}

              <div className="grid gap-2">
                {(column.links || []).map((item) => (
                  <FooterLink
                    key={`${column.title}-${item.url}`}
                    item={item}
                    onNavigate={onNavigate}
                    className="text-sm text-[#24466f] transition-colors hover:text-[#0b4f8c]"
                  />
                ))}
              </div>
            </nav>
          ))}
        </div>
      </div>

      <div className="layout-container relative flex flex-col gap-3 border-t border-[rgba(8,66,153,0.08)] py-4 text-sm text-[#64748b] md:flex-row md:items-center md:justify-between">
        <p>{copyright}</p>

        {legalLinks.length > 0 ? (
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((item) => (
              <FooterLink
                key={`legal-${item.url}`}
                item={item}
                onNavigate={onNavigate}
                className="transition-colors hover:text-[#0b4f8c]"
              />
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}

Footer.propTypes = {
  locale: PropTypes.oneOf(['en', 'ar']),
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  footerData: PropTypes.shape({
    tagline: PropTypes.string,
    contactEmail: PropTypes.string,
    columns: PropTypes.array,
    socialLinks: PropTypes.array,
    legalLinks: PropTypes.array,
    copyright: PropTypes.string,
  }),
  onNavigate: PropTypes.func,
};

export default Footer;
