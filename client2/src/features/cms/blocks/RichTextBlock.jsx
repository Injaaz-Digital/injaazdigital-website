import PropTypes from 'prop-types';
import { CmsLinkButton } from './shared';

export default function RichTextBlock({ block, locale, onNavigate }) {
  if (!block.heading && !block.body) {
    return null;
  }

  const isArabic = locale === 'ar';

  return (
    <section className="section section--tight">
      <div
        className="layout-content-narrow rounded-[26px] border border-[rgba(8,66,153,0.12)] bg-white px-[21px] py-[34px] shadow-[0_14px_32px_rgba(8,41,89,0.06)] sm:px-[34px] sm:py-[55px]"
        dir={isArabic ? 'rtl' : 'ltr'}
        lang={isArabic ? 'ar' : 'en'}
      >
        <div className="section-head" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? (
            <h2 className="section-title section-title--article">
              {block.heading}
            </h2>
          ) : null}
          {block.description ? <p className="section-head-lead">{block.description}</p> : null}
        </div>
        {block.body ? (
          <div
            className={`rich-text mt-[21px] text-[#3f5a7b] ${isArabic ? 'text-right' : 'text-left'}`}
            style={{ unicodeBidi: 'plaintext' }}
            dangerouslySetInnerHTML={{ __html: block.body }}
          />
        ) : null}

        {block.primaryCta ? (
          <div className="mt-[34px] ltr:text-left rtl:text-right">
            <CmsLinkButton link={block.primaryCta} onNavigate={onNavigate} className="!h-10" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

RichTextBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    body: PropTypes.string,
    primaryCta: PropTypes.object,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
  onNavigate: PropTypes.func,
};
