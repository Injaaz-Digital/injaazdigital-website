import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

function MainLayout({
  children,
  locale,
  activePath,
  mainClassName = 'pt-24',
  navItems,
  cta,
  footerData,
  showLanguageSwitcher = true,
  showFooter = true,
  showBlur = true,
  onLocaleChange,
  onNavigate,
  onPrefetch,
}) {
  return (
    <div className="app-shell flex min-h-screen flex-col bg-[#f8fbff]">
      <Header
        locale={locale}
        activePath={activePath}
        navItems={navItems}
        cta={cta}
        showLanguageSwitcher={showLanguageSwitcher}
        onLocaleChange={onLocaleChange}
        onNavigate={onNavigate}
        onPrefetch={onPrefetch}
      />

      <main className={`flex-1 ${mainClassName}`}>{children}</main>

      

      {showFooter ? <Footer locale={locale} navItems={navItems} footerData={footerData} onNavigate={onNavigate} /> : null}
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
  activePath: PropTypes.string.isRequired,
  mainClassName: PropTypes.string,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  cta: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
  }),
  footerData: PropTypes.shape({
    tagline: PropTypes.string,
    contactEmail: PropTypes.string,
    columns: PropTypes.array,
    socialLinks: PropTypes.array,
    legalLinks: PropTypes.array,
    copyright: PropTypes.string,
  }),
  showLanguageSwitcher: PropTypes.bool,
  showFooter: PropTypes.bool,
  showBlur: PropTypes.bool,
  onLocaleChange: PropTypes.func,
  onNavigate: PropTypes.func,
  onPrefetch: PropTypes.func,
};

export default MainLayout;
