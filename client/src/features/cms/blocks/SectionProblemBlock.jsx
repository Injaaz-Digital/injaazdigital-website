import PropTypes from 'prop-types';
import { asArray, SECTION_CONTAINER, SectionHeader, SectionShell } from './premiumShared';

export default function SectionProblemBlock({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell tone="soft">
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'Where momentum gets lost'} heading={block?.heading} description={block?.description} />
          <div className="space-y-4">
            {items.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="rounded-xl border border-[#dce3e9] p-5 transition-all duration-200 hover:border-[#c0cbd8] hover:shadow-[0_4px_20px_rgba(8,52,106,0.06)] sm:p-6"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf4f8] text-[0.8rem] font-semibold text-[#084299] sm:h-9 sm:w-9 sm:text-[0.85rem]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="premium-geist text-base font-semibold tracking-[-0.012em] text-[#111820] sm:text-lg">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-6 text-[#596a7a] sm:text-[0.94rem]">{item.description}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

SectionProblemBlock.propTypes = { block: PropTypes.object };

