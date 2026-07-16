import PropTypes from 'prop-types';
import { Check, Layers3, Sparkles } from 'lucide-react';
import { asArray, SECTION_CONTAINER, SectionHeader, SectionShell } from './premiumShared';

export default function FeatureListBlock({ block }) {
  const items = asArray(block?.items);

  return (
    <SectionShell>
      <div className={SECTION_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <SectionHeader eyebrow={block?.eyebrow || 'Built into the system'} heading={block?.heading} description={block?.description} />
          <div className="grid gap-x-8 border-t border-[#cfd9e2] sm:grid-cols-2">
          {items.map((item, index) => (
            <article key={`${item.title}-${index}`} className="border-b border-[#dce3e9] py-5 sm:py-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#edf4f8] text-[#084299]">
                  {index % 3 === 0 ? <Layers3 className="h-4 w-4" aria-hidden="true" /> : index % 3 === 1 ? <Sparkles className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
                </span>
                <div>
                  <h3 className="premium-geist text-base font-semibold tracking-[-0.012em] text-[#111820] sm:text-lg">{item.title}</h3>
                  {item.description ? <p className="mt-2 text-sm leading-6 text-[#596a7a]">{item.description}</p> : null}
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

FeatureListBlock.propTypes = { block: PropTypes.object };

