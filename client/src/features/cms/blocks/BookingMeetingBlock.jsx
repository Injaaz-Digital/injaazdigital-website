import PropTypes from 'prop-types';
import { CmsLinkButton } from './shared';

export default function BookingMeetingBlock({ block, locale }) {
  const benefits = Array.isArray(block?.benefits) ? block.benefits.filter((item) => item?.title) : [];
  if (!block?.heading && benefits.length === 0 && !block?.bookingLink) return null;

  return (
    <section className="layout-container py-12 sm:py-16">
      <div className="grid gap-[21px] rounded-[40px] corner-squircle border border-[rgba(8,66,153,0.14)] bg-white p-[21px] shadow-[0_16px_36px_rgba(8,41,89,0.07)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)] sm:p-[34px]">
        <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? <h2 className="section-title">{block.heading}</h2> : null}
          {block.description ? <p className="section-head-lead">{block.description}</p> : null}
          {benefits.length ? <div className="mt-[21px] grid gap-[13px] sm:grid-cols-2">{benefits.map((item, index) => <article key={`${item.title}-${index}`} className="rounded-[26px] border border-[rgba(8,66,153,0.1)] bg-[#f8fbff] p-[13px]"><strong className="text-sm text-[#0a2546]">{item.title}</strong>{item.description ? <p className="mt-2 text-xs leading-6 text-[#5c7696]">{item.description}</p> : null}</article>)}</div> : null}
        </div>
        <aside className="rounded-[32px] border border-[rgba(8,66,153,0.12)] bg-[#f6f9ff] p-[21px]">
          <p className="section-head-kicker">{block.cardTitle || (locale === 'ar' ? 'حجز اجتماع' : 'Book a Meeting')}</p>
          {block.cardHeading ? <h3 className="mt-3 text-xl text-[#0a2546]">{block.cardHeading}</h3> : null}
          {block.cardDescription ? <p className="mt-3 text-sm leading-7 text-[#4f6a89]">{block.cardDescription}</p> : null}
          <div className="mt-5"><CmsLinkButton link={block.bookingLink} size="lg" /></div>
        </aside>
      </div>
    </section>
  );
}

BookingMeetingBlock.propTypes = { block: PropTypes.object.isRequired, locale: PropTypes.oneOf(['en', 'ar']).isRequired };
