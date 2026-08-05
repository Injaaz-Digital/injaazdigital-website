'use client';

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { ArrowUpRight, Check, ChevronDown, Languages, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LogoEn from '@/shared/brand/Logo_name2.svg';
import LogoAr from '@/shared/brand/logo_name_ar2.svg';
import Button from '@/shared/ui/Button';
import { cn as cx } from '@/lib/utils';
import { getLocaleDirection, normalizeLocale } from '@/lib/i18n/locale';
import { isExternalUrl, isHashUrl, isInternalUrl, matchPathname } from '@/lib/config/site-config';
import { useHeaderVisibility } from './Header/useHeaderVisibility';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

const DROPDOWN_GLASS = {
  backgroundColor: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(30px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(30px) saturate(1.3)',
};

const DROPDOWN_PANEL_CLASS =
  'header-glass-noise relative overflow-visible corner-squircle rounded-[38px] p-2 shadow-[0_24px_44px_rgba(8,41,89,0.1)] transition-[background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';

const MOBILE_SHEET_CLASS =
  'relative corner-squircle overflow-hidden rounded-[24px] border border-white/72 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,249,255,0.86))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_48px_rgba(8,41,89,0.16)] backdrop-blur-[24px]';

function Header({
  locale = 'en',
  activePath = '/',
  onLocaleChange,
  navItems = [],
  servicesLabel = 'Services',
  serviceLinks = [],
  cta,
  showLanguageSwitcher = true,
  onNavigate,
  onPrefetch,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);
  const { hasScrolled, headerMaxWidth } = useHeaderVisibility();
  const desktopLangRef = useRef(null);
  const mobileLangRef = useRef(null);
  const servicesRef = useRef(null);
  const normalizedLocale = normalizeLocale(locale);
  const isArabic = normalizedLocale === 'ar';
  const servicesActive = serviceLinks.some((item) => matchPathname(item.url, activePath));
  const logoSrc = isArabic ? (LogoAr?.src || LogoAr) : (LogoEn?.src || LogoEn);
  const desktopControlClass = cx(
    'h-9 rounded-full !border-0 !bg-transparent text-[#355884] transition-[color,text-shadow] duration-300 hover:!bg-transparent hover:!text-[#0b5da8]',
    isLangOpen && '!text-[#087f9c] [text-shadow:0_2px_8px_rgba(8,127,156,0.24)]'
  );
  const mobileControlClass = cx(
    'corner-squircle h-11 w-11 rounded-[18px] px-0 text-[#355884] transition-[background-color,border-color,box-shadow,color] duration-300',
    hasScrolled
      ? 'border border-white/78 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(243,248,255,0.62))] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,249,255,0.76))]'
      : 'border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] hover:border-white/24 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))]'
  );
  const mobileMenuButtonClass = cx(
    mobileControlClass,
    isMenuOpen
      ? 'border-white/82 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(245,249,255,0.78))] text-[#21456d] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_14px_28px_rgba(8,41,89,0.12)]'
      : null
  );
  const headerShellClass =
    'header-glass-noise relative corner-squircle flex items-center justify-between gap-3 overflow-visible rounded-full px-2 py-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';
  const headerGlassLayerClass = cx(
    'header-glass-noise pointer-events-none absolute inset-0 corner-squircle rounded-full transition-[background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
    hasScrolled
      ? 'header-glass-surface'
      : 'bg-transparent backdrop-blur-none backdrop-saturate-100'
  );

  const navigateTo = (url, closeMenu = false) => {
    if (!url) return;

    if (isExternalUrl(url) || !onNavigate) {
      window.location.assign(url);
      if (closeMenu) setIsMenuOpen(false);
      return;
    }

    onNavigate(url);
    if (closeMenu) setIsMenuOpen(false);
  };

  const prefetchRoute = (url) => {
    if (!url || !onPrefetch || !isInternalUrl(url)) return;
    onPrefetch(url);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
    setHoveredService(null);
  }, [activePath]);

  useEffect(() => {
    const onPointerDown = (event) => {
      const target = event.target;
      const outsideDesktop = !desktopLangRef.current || !desktopLangRef.current.contains(target);
      const outsideMobile = !mobileLangRef.current || !mobileLangRef.current.contains(target);
      const outsideServices = !servicesRef.current || !servicesRef.current.contains(target);

      if (outsideDesktop && outsideMobile) {
        setIsLangOpen(false);
      }
      if (outsideServices) {
        setIsServicesOpen(false);
        setHoveredService(null);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key !== 'Escape') return;
      setIsLangOpen(false);
      setIsMenuOpen(false);
      setIsServicesOpen(false);
      setHoveredService(null);
    };

    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);

  useEffect(() => {
    if (!showLanguageSwitcher) {
      setIsLangOpen(false);
    }
  }, [showLanguageSwitcher]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const renderNavLink = (item, mobile = false) => {
    const active = matchPathname(item.url, activePath);
    const classes = cx(
      mobile
        ? 'block corner-squircle rounded-[18px] border-0 bg-transparent px-3.5 py-3 text-sm font-medium transition-[color,text-shadow] duration-300'
        : 'corner-squircle rounded-full px-3.5 py-2 text-sm font-medium transition-[color,background-color,box-shadow,transform] duration-300',
      active
        ? 'border-0 bg-transparent text-[#087f9c] shadow-none [text-shadow:0_2px_8px_rgba(8,127,156,0.24)]'
        : mobile
          ? 'bg-transparent text-[#21456d] hover:bg-transparent hover:text-[#0b4f8c]'
          : 'bg-transparent text-[#21456d]/88 hover:bg-transparent hover:text-[#0b4f8c]'
    );

    if (item.isExternal || isExternalUrl(item.url)) {
      return (
        <a
          key={`${mobile ? 'm' : 'd'}-${item.url}`}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className={classes}
        >
          {item.label}
        </a>
      );
    }

    if (isHashUrl(item.url)) {
      return (
        <a
          key={`${mobile ? 'm' : 'd'}-${item.url}`}
          href={item.url}
          className={classes}
          onClick={() => {
            if (mobile) setIsMenuOpen(false);
          }}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        key={`${mobile ? 'm' : 'd'}-${item.url}`}
        href={item.url}
        className={classes}
        onClick={() => {
          if (mobile) setIsMenuOpen(false);
        }}
        onMouseEnter={() => prefetchRoute(item.url)}
        onFocus={() => prefetchRoute(item.url)}
      >
        {item.label}
      </Link>
    );
  };

  const renderLanguageMenu = (mobile = false) => (
    <div
      className={cx(
        'absolute top-full z-50 w-52 pt-5',
        mobile ? 'ltr:right-0 rtl:left-0' : 'ltr:left-0 rtl:right-0'
      )}
    >
      <div
        className={cx(DROPDOWN_PANEL_CLASS, hasScrolled && 'header-glass-surface')}
        style={hasScrolled ? undefined : DROPDOWN_GLASS}
        role="menu"
        aria-label={isArabic ? 'اللغة' : 'Language'}
      >
        <span className="header-glass-noise__texture" aria-hidden="true" />
        <div className="px-2.5 pb-1.5 pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b85a2]">
            {isArabic ? 'اللغة' : 'Language'}
          </p>
          <p className="mt-1 text-xs text-[#5b7391]">
            {isArabic ? 'اختر لغة العرض للموقع.' : 'Choose the site display language.'}
          </p>
        </div>

        {LANGUAGE_OPTIONS.map((option) => {
          const selected = normalizedLocale === option.code;
          const optionDir = getLocaleDirection(option.code);

          return (
            <Button
              key={option.code}
              variant="ghost"
              size="sm"
              dir={option.dir}
              className={cx(
                'corner-squircle mb-1 h-auto w-full rounded-[16px] px-2.5 py-2.5 text-sm font-medium last:mb-0',
                selected
                  ? '!border-0 !bg-transparent !text-[#087f9c] !shadow-none [text-shadow:0_2px_8px_rgba(8,127,156,0.22)] hover:!bg-transparent'
                  : '!border-0 bg-transparent text-[#27436b] shadow-none hover:bg-white/20 hover:text-[#1d4f86]'
              )}
              onClick={() => {
                onLocaleChange?.(option.code);
                setIsLangOpen(false);
              }}
            >
              <span
                className={cx(
                  'flex w-full items-center justify-between gap-2',
                  optionDir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                )}
              >
                <span>{option.label}</span>
                <span
                  className={cx(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-[#0b4f8c]',
                    selected ? 'bg-transparent text-[#087f9c]' : 'bg-transparent text-[#6b85a2]'
                  )}
                  aria-hidden={!selected}
                >
                  {selected ? <Check size={15} /> : option.code.toUpperCase()}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );

  const renderServicesMenu = () => serviceLinks.length ? (
    <div
      className="relative"
      ref={servicesRef}
      onMouseEnter={() => {
        setIsServicesOpen(true);
        setIsLangOpen(false);
      }}
      onMouseLeave={() => { setIsServicesOpen(false); setHoveredService(null); }}
      onFocusCapture={() => {
        setIsServicesOpen(true);
        setIsLangOpen(false);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setIsServicesOpen(false); setHoveredService(null); }
      }}
    >
      <button
        type="button"
        className={cx(
          'corner-squircle flex items-center gap-1 rounded-full border-0 px-3.5 py-2 text-sm font-medium shadow-none transition-[color,text-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28aec3]/40',
          servicesActive || isServicesOpen
            ? 'bg-transparent text-[#087f9c] [text-shadow:0_2px_8px_rgba(8,127,156,0.24)]'
            : 'bg-transparent text-[#21456d]/88 hover:bg-transparent hover:text-[#0b4f8c]'
        )}
        aria-expanded={isServicesOpen}
        aria-haspopup="menu"
      >
        {servicesLabel}
        <ChevronDown className={cx('h-3.5 w-3.5 transition-transform', isServicesOpen && 'rotate-180')} aria-hidden="true" />
      </button>
      {isServicesOpen ? (
        <div className="absolute top-full z-50 w-[34rem] max-w-[calc(100vw-2rem)] pt-5 ltr:left-0 rtl:right-0">
          <div
            className={cx(DROPDOWN_PANEL_CLASS, 'p-2', hasScrolled && 'header-glass-surface')}
            style={hasScrolled ? undefined : DROPDOWN_GLASS}
            role="menu"
            aria-label={servicesLabel}
          >
            <span className="header-glass-noise__texture" aria-hidden="true" />
            <div className="grid grid-cols-[minmax(0,1fr)_13rem] gap-1.5 rtl:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="py-1">
                <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4a6a8a]">
                  {isArabic ? 'حلولنا' : 'What we build'}
                </p>
                {serviceLinks.map((item, i) => {
                  const active = matchPathname(item.url, activePath);
                  return (
                    <Link
                      key={item.url}
                      href={item.url}
                      role="menuitem"
                      className={cx(
                        'group flex items-center justify-between gap-3 corner-squircle rounded-[15px] px-2.5 py-2.5 text-sm font-medium transition-colors hover:bg-white/20 hover:text-[#087f9c]',
                        active
                          ? 'bg-transparent text-[#087f9c] [text-shadow:0_2px_8px_rgba(8,127,156,0.2)]'
                          : 'text-[#27436b]',
                        hoveredService === i && '!bg-white/20 !text-[#087f9c]'
                      )}
                      onClick={(event) => {
                        setIsServicesOpen(false);
                        setHoveredService(null);
                        if (!onNavigate) return;
                        event.preventDefault();
                        onNavigate(item.url);
                      }}
                      onMouseEnter={() => {
                        prefetchRoute(item.url);
                        setHoveredService(i);
                      }}
                      onMouseLeave={() => setHoveredService(null)}
                      onFocus={() => prefetchRoute(item.url)}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#6b85a2] transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#087f9c] rtl:rotate-[-90deg]" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>

              <div className="relative isolate min-h-[13.5rem] overflow-hidden corner-squircle rounded-[28px] p-3 text-white transition-[background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rtl:order-first"
                style={{
                  backgroundColor: hoveredService !== null
                    ? (hoveredService === 0 ? '#0a3a2e' : '#1a1a3e')
                    : '#0a315b'
                }}
              >
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: hoveredService !== null
                      ? (hoveredService === 0
                        ? 'radial-gradient(circle at 80% 15%, rgba(45,212,120,0.50), transparent 34%), linear-gradient(145deg, transparent 42%, rgba(255,255,255,0.08) 43%, transparent 72%)'
                        : 'radial-gradient(circle at 80% 15%, rgba(145,115,235,0.50), transparent 34%), linear-gradient(145deg, transparent 42%, rgba(255,255,255,0.08) 43%, transparent 72%)')
                      : 'radial-gradient(circle at 80% 15%, rgba(75,205,220,0.55), transparent 34%), linear-gradient(145deg, transparent 42%, rgba(255,255,255,0.08) 43%, transparent 72%)'
                  }}
                />
                <div className={cx(
                  'absolute -right-8 top-10 h-28 w-28 corner-squircle rounded-full border-[18px] transition-[border-color] duration-300',
                  hoveredService === null ? 'border-[#28aec3]/35' : hoveredService === 0 ? 'border-[#2dd48a]/35' : 'border-[#9b83eb]/35'
                )} />
                <div className={cx(
                  'absolute bottom-5 right-6 h-16 w-24 -rotate-6 corner-squircle rounded-xl backdrop-blur-sm transition-[background-color] duration-300',
                  hoveredService === null ? 'bg-white/10' : hoveredService === 0 ? 'bg-white/10' : 'bg-white/10'
                )}>
                  <span className={cx(
                    'absolute left-3 top-3 h-1.5 w-10 rounded-full transition-[background-color] duration-300',
                    hoveredService === null ? 'bg-[#71dce5]' : hoveredService === 0 ? 'bg-[#4ade80]' : 'bg-[#a78bfa]'
                  )} />
                  <span className="absolute left-3 top-7 h-1 w-14 rounded-full bg-white/45" />
                  <span className="absolute left-3 top-10 h-1 w-9 rounded-full bg-white/25" />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <span className={cx(
                    'inline-flex h-8 w-8 items-center justify-center corner-squircle rounded-full text-xs font-semibold ring-1 ring-inset ring-white/15 transition-[background-color] duration-300',
                    hoveredService === null ? 'bg-white/10' : 'bg-white/10'
                  )}>
                    {hoveredService === null ? 'ID' : hoveredService === 0 ? 'GE' : 'WE'}
                  </span>
                  <div>
                    <p className={cx(
                      'text-[10px] font-semibold uppercase tracking-[0.18em] transition-[color] duration-300',
                      hoveredService === null ? 'text-[#b0ecf0]' : hoveredService === 0 ? 'text-[#86efac]' : 'text-[#c4b5fd]'
                    )}>
                      {hoveredService === null
                        ? 'Injaaz systems'
                        : hoveredService === 0
                          ? (isArabic ? 'محرك النمو' : 'Growth Engine')
                          : (isArabic ? 'محرك الموقع' : 'Website Engine')}
                    </p>
                    <p className="mt-1 max-w-[14ch] text-[0.95rem] font-semibold leading-snug [text-shadow:0_2px_12px_rgba(0,0,0,0.25)]">
                      {hoveredService === null
                        ? (isArabic ? 'من الفكرة إلى النمو.' : 'From idea to growth.')
                        : hoveredService === 0
                          ? (isArabic ? 'نظام ينمو بإيراداتك.' : 'The revenue growth system.')
                          : (isArabic ? 'تصميم وتطوير يصنعان الأثر.' : 'Design & development built for impact.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <>
      <header
        className="fixed left-1/2 top-[max(0.7rem,env(safe-area-inset-top))] z-[70] w-[calc(100%-1.1rem)] -translate-x-1/2 transition-[max-width] duration-300 ease-out motion-reduce:transition-none max-[520px]:w-[calc(100%-0.75rem)]"
        style={{ maxWidth: `${headerMaxWidth.toFixed(2)}px` }}
      >
        <div className={headerShellClass} style={{ transform: hasScrolled ? 'translateY(0px)' : 'translateY(4px)' }}>
          <span className={headerGlassLayerClass} aria-hidden="true">
            <span className="header-glass-noise__texture transition-opacity duration-500" style={{ opacity: hasScrolled ? 0.16 : 0 }} aria-hidden="true" />
          </span>
          <Link
            href="/"
            className="relative -mx-4  block h-[54px] w-[138px] shrink-0 rounded-xl transition-opacity hover:opacity-90 max-[520px]:h-[54px] max-[520px]:w-[138px]"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={logoSrc} alt="Injaaz Digital" width="138" height="54" className="h-full w-full object-contain" />
          </Link>

          <nav className="relative hidden items-center gap-1 corner-squircle rounded-2xl p-1.5 md:flex">
            {navItems.slice(0, 1).map((item) => renderNavLink(item, false))}
            {renderServicesMenu()}
            {navItems.slice(1).map((item) => renderNavLink(item, false))}
          </nav>

          <div className="relative hidden items-center gap-2 md:flex">
            {showLanguageSwitcher ? (
              <div
                className="relative"
                ref={desktopLangRef}
                onMouseEnter={() => {
                  setIsLangOpen(true);
                  setIsServicesOpen(false);
                }}
                onMouseLeave={() => setIsLangOpen(false)}
                onFocusCapture={() => {
                  setIsLangOpen(true);
                  setIsServicesOpen(false);
                }}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setIsLangOpen(false);
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={desktopControlClass}
                  aria-label={isArabic ? 'تبديل اللغة' : 'Switch language'}
                  aria-expanded={isLangOpen}
                  aria-haspopup="menu"
                >
                  <Languages size={18} strokeWidth={1.85} />
                </Button>
                {isLangOpen ? renderLanguageMenu(false) : null}
              </div>
            ) : null}

            {cta?.label ? (
              <div className="relative py-1">
                <Button
                  variant="primary"
                  size="md"
                  className="relative shadow-[0_18px_34px_rgba(8,66,153,0.28)]"
                  onClick={() => navigateTo(cta.url, true)}
                  onMouseEnter={() => prefetchRoute(cta.url)}
                  onFocus={() => prefetchRoute(cta.url)}
                >
                  {cta.label}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="relative flex items-center gap-2 md:hidden" ref={mobileLangRef}>
            {showLanguageSwitcher ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLangOpen((open) => !open)}
                className={cx(
                  mobileControlClass,
                  isLangOpen && '!border-0 !bg-transparent !text-[#087f9c] !shadow-none [text-shadow:0_2px_8px_rgba(8,127,156,0.24)]'
                )}
                aria-label={isArabic ? 'تبديل اللغة' : 'Switch language'}
                aria-expanded={isLangOpen}
                aria-haspopup="menu"
              >
                <Languages size={20} strokeWidth={1.65} />
              </Button>
            ) : null}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsMenuOpen((open) => !open);
                setIsLangOpen(false);
              }}
              className={mobileMenuButtonClass}
              aria-label={isArabic ? 'فتح وإغلاق القائمة' : 'Toggle menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {showLanguageSwitcher && isLangOpen ? renderLanguageMenu(true) : null}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px) saturate(100%)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(6px) saturate(140%)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px) saturate(100%)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-white/20"
            >
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu backdrop"
                className="absolute inset-0 h-full w-full cursor-default"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32, mass: 0.9 }}
              className="fixed inset-x-3 top-[calc(max(0.7rem,env(safe-area-inset-top))+4.7rem)] z-50"
            >
              <div className={cx(MOBILE_SHEET_CLASS, 'mx-auto max-w-[28rem]')}>
                <div className="pointer-events-none absolute inset-x-[16%] top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
                <div className="pointer-events-none absolute -right-4 top-0 h-16 w-24 rounded-full bg-white/55 blur-3xl" />
                <div className="pointer-events-none absolute left-3 bottom-0 h-16 w-28 rounded-full bg-[#def1ff] blur-3xl" />

                <motion.nav
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
                    hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                  }}
                  className="relative flex flex-col gap-1.5"
                >
                  {navItems.slice(0, 1).map((item) => (
                    <motion.div
                      key={item.url}
                      variants={{
                        visible: { opacity: 1, y: 0, scale: 1 },
                        hidden: { opacity: 0, y: 16, scale: 0.96 },
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.8 }}
                    >
                      {renderNavLink(item, true)}
                    </motion.div>
                  ))}
                  {serviceLinks.length ? (
                    <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 12 } }} className="corner-squircle rounded-[18px] border border-white bg-white/35 p-2">
                      <p className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#6b85a2]">{servicesLabel}</p>
                      <div className="grid gap-1">
                        {serviceLinks.map((item) => (
                          <Link key={item.url} href={item.url} className="corner-squircle rounded-[14px] px-3 py-2.5 text-sm font-medium text-[#21456d] hover:bg-white/80" onClick={(event) => { setIsMenuOpen(false); if (!onNavigate) return; event.preventDefault(); onNavigate(item.url); }}>{item.label}</Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                  {navItems.slice(1).map((item) => (
                    <motion.div
                      key={item.url}
                      variants={{ visible: { opacity: 1, y: 0, scale: 1 }, hidden: { opacity: 0, y: 16, scale: 0.96 } }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.8 }}
                    >
                      {renderNavLink(item, true)}
                    </motion.div>
                  ))}
                  {cta?.label ? (
                    <motion.div
                      variants={{
                        visible: { opacity: 1, y: 0, scale: 1 },
                        hidden: { opacity: 0, y: 20, scale: 0.95 },
                      }}
                      transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.8 }}
                    >
                      <Button
                        variant="primary"
                        size="md"
                        className="mt-2 h-11 w-full shadow-[0_18px_32px_rgba(8,66,153,0.24)]"
                        onClick={() => navigateTo(cta.url, true)}
                      >
                        {cta.label}
                      </Button>
                    </motion.div>
                  ) : null}
                </motion.nav>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

Header.propTypes = {
  locale: PropTypes.oneOf(['en', 'ar']),
  activePath: PropTypes.string,
  onLocaleChange: PropTypes.func,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      isExternal: PropTypes.bool,
    })
  ),
  servicesLabel: PropTypes.string,
  serviceLinks: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, url: PropTypes.string.isRequired })),
  cta: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
    isExternal: PropTypes.bool,
  }),
  showLanguageSwitcher: PropTypes.bool,
  onNavigate: PropTypes.func,
  onPrefetch: PropTypes.func,
};

export default Header;
