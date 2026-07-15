import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Check, ChevronDown, Languages, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LogoEn from '@/shared/brand/Logo_name2.svg';
import LogoAr from '@/shared/brand/logo_name_ar2.svg';
import Button from '@/shared/ui/Button';
import cx from '@/lib/utils/cx';
import { getLocaleDirection, normalizeLocale } from '@/lib/i18n/locale';
import { isExternalUrl, isHashUrl, isInternalUrl, matchPathname } from '@/lib/config/site-config';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

const DROPDOWN_PANEL_CLASS =
  'corner-squircle rounded-[22px] border border-white/78 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,248,255,0.92))] p-2 shadow-[0_24px_44px_rgba(8,41,89,0.14)] backdrop-blur-xl';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const desktopLangRef = useRef(null);
  const mobileLangRef = useRef(null);
  const servicesRef = useRef(null);
  const normalizedLocale = normalizeLocale(locale);
  const isArabic = normalizedLocale === 'ar';
  const servicesActive = serviceLinks.some((item) => matchPathname(item.url, activePath));
  const logoSrc = isArabic ? (LogoAr?.src || LogoAr) : (LogoEn?.src || LogoEn);
  const headerMaxWidth = 1200 - scrollProgress * 400;
  const hasScrolled = scrollProgress > 0.06;
  const desktopControlClass = cx(
    'h-9 rounded-full text-[#355884]',
    hasScrolled
      ? 'bg-white/18 text-[#21456d] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_22px_rgba(8,41,89,0.08)]'
      : 'bg-white/10 hover:bg-white/20'
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
  const headerShellClass = cx(
    'relative corner-squircle flex items-center justify-between gap-3 overflow-visible rounded-full border px-2 py-1 transition-[background-color,border-color,box-shadow,backdrop-filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
    hasScrolled
      ? 'border border-white/72 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(246,250,255,0.72))] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_52px_rgba(8,41,89,0.14)] backdrop-blur-[22px]'
      : 'border-transparent'
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
      if (outsideServices) setIsServicesOpen(false);
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

  useEffect(() => {
    let rafId = 0;

    const onScroll = () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        const nextProgress = Math.max(0, Math.min(1, window.scrollY / 140));
        setScrollProgress((prev) => (Math.abs(prev - nextProgress) < 0.004 ? prev : nextProgress));
        rafId = 0;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const renderNavLink = (item, mobile = false) => {
    const active = matchPathname(item.url, activePath);
    const classes = cx(
      mobile
        ? 'block corner-squircle rounded-[18px] border px-3.5 py-3 text-sm font-medium transition-[background-color,color,box-shadow,border-color] duration-300'
        : 'corner-squircle rounded-full px-3.5 py-2 text-sm font-medium transition-[color,background-color,box-shadow,transform] duration-300',
      active
        ? mobile
          ? 'border-white/82 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,249,255,0.86))] text-[#21456d] shadow-[0_12px_24px_rgba(8,41,89,0.08)]'
          : hasScrolled
            ? 'bg-white/18 text-[#21456d] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_22px_rgba(8,41,89,0.08)]'
            : 'bg-white/18 text-[#0b4f8c]'
        : mobile
          ? 'border-white bg-transparent text-[#21456d] hover:border-white/68 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,248,255,0.62))] hover:text-[#0b4f8c]'
          : hasScrolled
            ? 'bg-transparent text-[#21456d] hover:bg-white/20 hover:text-[#0b4f8c]'
            : 'bg-transparent text-[#21456d]/88 hover:bg-white/14 hover:text-[#0b4f8c]'
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
        'absolute top-full z-50 mt-2 w-52',
        DROPDOWN_PANEL_CLASS,
        mobile ? 'ltr:right-0 rtl:left-0' : 'ltr:left-0 rtl:right-0'
      )}
      role="menu"
      aria-label={isArabic ? 'اللغة' : 'Language'}
    >
      <div className="px-3 pb-2 pt-1">
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
              'corner-squircle mb-1 h-auto w-full rounded-[16px] px-3 py-3 text-sm font-medium last:mb-0',
              selected
                ? 'border border-white/80 bg-white text-[#21456d] shadow-[0_10px_20px_rgba(8,41,89,0.08)]'
                : 'bg-transparent text-[#27436b] hover:bg-white/78 hover:text-[#1d4f86]'
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
                  selected ? 'bg-[#edf4ff]' : 'bg-white/70 text-[#8ba2bd]'
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
  );

  const renderServicesMenu = () => serviceLinks.length ? (
    <div className="relative" ref={servicesRef}>
      <button
        type="button"
        className={cx(
          'corner-squircle flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-[color,background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28aec3]/40',
          servicesActive || isServicesOpen
            ? 'bg-white/20 text-[#0b4f8c] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_10px_22px_rgba(8,41,89,0.08)]'
            : 'text-[#21456d]/88 hover:bg-white/18 hover:text-[#0b4f8c]'
        )}
        aria-expanded={isServicesOpen}
        aria-haspopup="menu"
        onClick={() => setIsServicesOpen((open) => !open)}
      >
        {servicesLabel}
        <ChevronDown className={cx('h-3.5 w-3.5 transition-transform', isServicesOpen && 'rotate-180')} aria-hidden="true" />
      </button>
      {isServicesOpen ? (
        <div className={cx('absolute top-full z-50 mt-2 w-64', DROPDOWN_PANEL_CLASS, 'ltr:left-0 rtl:right-0')} role="menu" aria-label={servicesLabel}>
          {serviceLinks.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              role="menuitem"
              className={cx('block rounded-[15px] px-3 py-3 text-sm font-medium text-[#27436b] transition-colors hover:bg-white hover:text-[#0b4f8c]', matchPathname(item.url, activePath) && 'bg-white text-[#0b4f8c]')}
              onClick={(event) => {
                setIsServicesOpen(false);
                if (!onNavigate) return;
                event.preventDefault();
                onNavigate(item.url);
              }}
              onMouseEnter={() => prefetchRoute(item.url)}
              onFocus={() => prefetchRoute(item.url)}
            >
              {item.label}
            </Link>
          ))}
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
              <div className="relative" ref={desktopLangRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLangOpen((open) => !open)}
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
                className={mobileControlClass}
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
                    <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 12 } }} className="rounded-[18px] border border-white bg-white/35 p-2">
                      <p className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#6b85a2]">{servicesLabel}</p>
                      <div className="grid gap-1">
                        {serviceLinks.map((item) => (
                          <Link key={item.url} href={item.url} className="rounded-[14px] px-3 py-2.5 text-sm font-medium text-[#21456d] hover:bg-white/80" onClick={(event) => { setIsMenuOpen(false); if (!onNavigate) return; event.preventDefault(); onNavigate(item.url); }}>{item.label}</Link>
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
