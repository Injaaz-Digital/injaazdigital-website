import { useState } from 'react';
import PropTypes from 'prop-types';
import { BLOCK_SECTION_IDS } from './shared';

export default function FaqBlock({ block, locale }) {
  const items = Array.isArray(block.items) ? block.items.filter((item) => item?.question) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const isArabic = locale === 'ar';

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="section" id={BLOCK_SECTION_IDS['blocks.faq']}>
      <div className="layout-content-narrow">
        <div className="section-head" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? (
            <h2 className="section-title">
              {block.heading}
            </h2>
          ) : null}
          {block.description ? <p className="section-head-lead">{block.description}</p> : null}
        </div>
      </div>

      <div className="layout-content-narrow mt-[34px] space-y-[13px]">
        {items.map((item, index) => {
          const isOpen = activeIndex === index;

          return (
            <article
              key={`${item.question}-${index}`}
              className="overflow-hidden rounded-[30px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-white shadow-[0_10px_24px_rgba(8,41,89,0.05)]"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-[13px] px-[21px] py-[13px] text-left"
                onClick={() => setActiveIndex((current) => (current === index ? -1 : index))}
                aria-expanded={isOpen}
              >
                <span className="text-[1rem] font-medium text-[#0a2546]">{item.question}</span>
                <span className="text-xl leading-none text-[#0b4f8c]">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen ? (
                <div className="border-t border-[rgba(8,66,153,0.08)] px-[21px] py-[13px] text-sm leading-7 text-[#4f6a89]" dangerouslySetInnerHTML={{ __html: item.answer || '' }} />
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

FaqBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    items: PropTypes.array,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
};
