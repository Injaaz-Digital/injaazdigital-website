import PropTypes from 'prop-types';
import { CmsLinkButton } from './shared';

export default function BookingMeetingBlock({ block, onNavigate, locale }) {
  const bookingBenefits = Array.isArray(block.benefits) ? block.benefits.filter((item) => item?.title) : [];

  if (!block.heading && bookingBenefits.length === 0 && !block.bookingLink) {
    return null;
  }

  return (
    <section>
      <div className="grid gap-[21px] rounded-[40px] corner-squircle border border-[rgba(8,66,153,0.14)] bg-white p-[21px] shadow-[0_16px_36px_rgba(8,41,89,0.07)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)] lg:items-start sm:p-[34px]">
        <div>
          <div className="section-head" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale === 'ar' ? 'ar' : 'en'}>
            {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
            {block.heading ? (
              <h2 className="section-title">
                {block.heading}
              </h2>
            ) : null}
            {block.description ? <p className="section-head-lead">{block.description}</p> : null}
          </div>

          {bookingBenefits.length > 0 ? (
            <div className="mt-[21px] grid gap-[13px] sm:grid-cols-2">
              {bookingBenefits.map((item, index) => (
                <article key={`${item.title}-${index}`} className="rounded-[26px] corner-squircle border border-[rgba(8,66,153,0.1)] bg-[#f8fbff] px-[13px] py-[13px]">
                  <strong className="text-sm text-[#0a2546]">{item.title}</strong>
                  {item.description ? <p className="mt-[8px] text-xs leading-6 text-[#5c7696]">{item.description}</p> : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="rounded-[32px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-[#f6f9ff] p-[21px]">
          <p className="section-head-kicker">
            {block.cardTitle || (locale === 'ar' ? 'حجز اجتماع' : 'Book a Meeting')}
          </p>
          <h3 className="mt-[13px] text-xl tracking-[-0.02em] text-[#0a2546]">
            {block.cardHeading || (locale === 'ar' ? 'جلسة استراتيجية قصيرة' : 'Focused strategy session')}
          </h3>
          <p className="mt-[13px] text-sm leading-7 text-[#4f6a89]">
            {block.cardDescription ||
              (locale === 'ar'
                ? 'اختر الوقت المناسب وسنرسل لك تأكيد الموعد مباشرة.'
                : 'Pick a suitable time and receive the confirmation instantly.')}
          </p>

          <div className="mt-[21px]">
            <CmsLinkButton link={block.bookingLink} onNavigate={onNavigate} size="lg" className="!h-10" />
          </div>
        </aside>
      </div>
    </section>
  );
}

BookingMeetingBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    cardTitle: PropTypes.string,
    cardHeading: PropTypes.string,
    cardDescription: PropTypes.string,
    bookingLink: PropTypes.object,
    benefits: PropTypes.array,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
  onNavigate: PropTypes.func,
};
