import PropTypes from 'prop-types';
import { cn as cx } from '@/lib/utils';
import { asArray, Copy, CONTAINER, EYEBROW } from './editorialShared';

export default function StatementPairBlock({ block }) {
  const statements = [block?.first, block?.second].filter(Boolean);
  return (
    <section className="relative overflow-hidden bg-[#081a30] py-20 text-white sm:py-28 lg:py-40">
      <div className={CONTAINER}>
        {block?.eyebrow ? <p className={cx(EYEBROW, '!text-[#8eb7d6]')}>{block.eyebrow}</p> : null}
        <div className="mt-10 grid gap-16 lg:grid-cols-2 lg:gap-20">
          {statements.map((entry, index) => (
            <article key={entry.label} className={cx(index === 1 && 'lg:border-s lg:border-white/15 lg:ps-20')}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#79bfe0]">{entry.label}</p>
              <h2 className="premium-geist mt-5 text-[clamp(2rem,3.5vw,3.8rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">{entry.statement}</h2>
              <div className="mt-7 space-y-5 text-base leading-8 text-[#c3d1df]"><Copy value={entry.explanation} /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

StatementPairBlock.propTypes = { block: PropTypes.object };
