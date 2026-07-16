import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import { asArray, SECTION_CONTAINER, SectionHeader, SectionShell } from './premiumShared';

export default function SectionFaqBlock({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell tone="soft">
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'Questions, answered'} heading={block?.heading} description={block?.description} />
          <div className="border-t border-[#cfd9e2]">
            {items.map((item, index) => (
              <details key={`${item.question}-${index}`} className="group border-b border-[#dce3e9] py-5 sm:py-6">
                <summary className="premium-geist flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold tracking-[-0.012em] text-[#111820] [&::-webkit-details-marker]:hidden sm:text-lg">
                  <span>{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d5dee7] text-[#084299]">
                    <Plus className="h-4 w-4 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                  </span>
                </summary>
                <p className="mt-3 max-w-[64ch] pb-1 text-sm leading-6 text-[#5b6c7c] sm:text-[0.94rem]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

SectionFaqBlock.propTypes = { block: PropTypes.object };

