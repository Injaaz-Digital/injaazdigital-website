import PropTypes from 'prop-types';
import { asArray, SECTION_CONTAINER, SectionHeader, SectionShell } from './premiumShared';

export default function OutcomesBlock({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell>
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'What changes'} heading={block?.heading} description={block?.description} />
          <div className="overflow-hidden rounded-[20px] border border-[#d5dee6] bg-white/72 md:grid md:grid-cols-3">
            {items.map((item, index) => (
              <article key={`${item.label}-${index}`} className="border-b border-[#dce3e9] p-5 last:border-b-0 sm:p-6 md:min-h-[190px] md:border-b-0 md:border-r md:last:border-r-0">
                <p className="premium-geist text-2xl font-semibold leading-none tracking-[-0.03em] text-[#111820] sm:text-3xl">{item.value}</p>
                <h3 className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#35628f]">{item.label}</h3>
                {item.hint ? <p className="mt-3 max-w-[30ch] text-sm leading-6 text-[#5b6c7c]">{item.hint}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

OutcomesBlock.propTypes = { block: PropTypes.object };

