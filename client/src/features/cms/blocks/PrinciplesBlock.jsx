import PropTypes from 'prop-types';
import { Copy } from './editorialShared';
import { asArray, SECTION_CONTAINER, SectionHeader, SectionShell } from './premiumShared';
import { CmsImage } from './shared';
import { resolveMediaUrl } from '@/lib/strapi';

const CARD_SPANS = [
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
];

export default function PrinciplesBlock({ block, locale = 'en' }) {
  const items = asArray(block?.items);
  const directionLabel = locale === 'ar' ? 'الاتجاه' : 'Direction';

  return (
    <SectionShell id="principles" tone="soft">
      <div className={SECTION_CONTAINER} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <SectionHeader
          align="center"
          eyebrow={block?.eyebrow}
          heading={block?.heading}
          description={block?.description}
        />

        <ol className="mt-9 grid list-none gap-4 sm:mt-11 lg:grid-cols-12">
          {items.map((entry, index) => (
            <li
              key={`${entry.title}-${index}`}
              className={`flex min-w-0 flex-col overflow-hidden rounded-[40px] corner-squircle border-2 border-blue-500/[0.11] bg-white shadow-[0_12px_35px_rgba(16,36,52,0.06)] ${CARD_SPANS[index % CARD_SPANS.length]}`}
            >
              <div className="p-[60px_24px_0]">
                {entry?.image ? (
                  <img
                    src={resolveMediaUrl(entry.image)}
                    alt={entry.title || ''}
                    className="w-full object-contain max-h-56"
                  />
                ) : null}
              </div>

              <div className="flex flex-1 flex-col justify-end px-6 pb-6 pt-8">
                <div className="mb-1 flex items-center gap-2">
                  {entry?.icon ? (
                    <CmsImage
                      media={entry.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 shrink-0 object-contain"
                    />
                  ) : null}
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#39738b]">
                    {entry.label}
                  </p>
                </div>
                <h3 className={`${locale !== 'ar' ? 'premium-geist' : ''} text-[1.3rem] font-semibold leading-tight tracking-[-0.025em] text-[#12263a] sm:text-[1.45rem]`}>
                  {entry.title}
                </h3>
                {entry?.description ? (
                  <p className="mt-3 max-w-[50ch] text-[0.92rem] leading-6 text-[#5a6d7e]">
                    {entry.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        {block?.directionHeading ? (
          <div className="mt-12 grid gap-7 rounded-2xl border border-[#cfdae2] bg-white p-6 shadow-[0_12px_35px_rgba(16,36,52,0.05)] sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#35628f]">{directionLabel}</p>
              <h3 className="premium-geist mt-3 text-2xl font-medium tracking-[-0.03em] text-[#12263a] sm:text-3xl">
                {block.directionHeading}
              </h3>
            </div>
            <div>
              <div className="space-y-4 text-[0.95rem] leading-7 text-[#53677c]">
                <Copy value={block.directionBody} />
              </div>
              {block?.closingStatement ? (
                <p className="mt-6 border-s-2 border-[#084299] ps-5 premium-geist text-lg font-medium leading-7 text-[#123b67]">
                  {block.closingStatement}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}

PrinciplesBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    })),
    directionHeading: PropTypes.string,
    directionBody: PropTypes.string,
    closingStatement: PropTypes.string,
  }),
  locale: PropTypes.oneOf(['en', 'ar']),
};
