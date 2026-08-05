import PropTypes from 'prop-types';
import { cn as cx } from '@/lib/utils';
import { asArray, CONTAINER, EYEBROW, TITLE } from './editorialShared';

export default function TimelineBlock({ block }) {
  const stages = asArray(block?.stages);
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className={CONTAINER}>
        {block?.eyebrow ? <p className={EYEBROW}>{block.eyebrow}</p> : null}
        <h2 className={cx(TITLE, 'mt-5 max-w-[15ch] !text-[clamp(2rem,3.8vw,4rem)]')}>{block?.heading}</h2>
        {block?.description ? <p className="mt-5 max-w-[56ch] text-base leading-7 text-[#53677c]">{block.description}</p> : null}
        <ol className="relative mt-14 grid gap-0 border-s border-[#bfcfda] md:grid-cols-4 md:border-s-0 md:border-t">
          {stages.map((stage, index) => (
            <li key={`${stage.stepTitle}-${index}`} className="relative ps-8 pb-10 last:pb-0 md:ps-0 md:pe-8 md:pt-8 md:pb-0">
              <span className="absolute -start-[5px] top-1 h-[9px] w-[9px] rounded-full bg-[#1685a1] ring-4 ring-white md:-top-[5px] md:start-0" aria-hidden="true" />
              <span className="text-[0.65rem] font-semibold tracking-[0.14em] text-[#1685a1]">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="premium-geist mt-3 text-xl font-semibold tracking-[-0.02em] text-[#13263d]">{stage.stepTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-[#596b7c]">{stage.deliverables}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

TimelineBlock.propTypes = { block: PropTypes.object };
