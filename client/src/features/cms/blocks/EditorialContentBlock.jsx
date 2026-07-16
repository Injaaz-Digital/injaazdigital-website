import PropTypes from 'prop-types';
import cx from '@/lib/utils/cx';
import { asArray, Copy, CONTAINER, EYEBROW, TITLE } from './editorialShared';

export default function EditorialContentBlock({ block }) {
  const statements = asArray(block?.statements);
  const manifesto = block?.variant === 'manifesto';
  const vision = block?.variant === 'vision';

  return (
    <section className={cx('relative overflow-hidden py-20 sm:py-28 lg:py-36', manifesto && 'bg-[#081a30] text-white', vision && 'bg-[#eef5f8]')}>
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            {block?.eyebrow ? <p className={cx(EYEBROW, manifesto && '!text-[#8eb7d6]')}>{block.eyebrow}</p> : null}
            <h2 className={cx(TITLE, 'mt-5 max-w-[16ch] !text-[clamp(2rem,3.6vw,3.8rem)]', manifesto && '!text-white')}>{block?.heading}</h2>
          </div>
          <div className="max-w-[46rem]">
            <div className={cx('space-y-5 text-base leading-8 sm:text-lg', manifesto ? 'text-[#c7d5e3]' : 'text-[#4f6277]')}>
              <Copy value={block?.body} />
            </div>
            {statements.length ? (
              <div className={cx('mt-10 border-t', manifesto ? 'border-white/15' : 'border-[#ccd8e2]')}>
                {statements.map((statement, index) => (
                  <div key={`${statement.title}-${index}`} className={cx('grid gap-2 border-b py-5 sm:grid-cols-[2.5rem_1fr]', manifesto ? 'border-white/15' : 'border-[#d7e0e7]')}>
                    <span className={cx('text-xs font-semibold', manifesto ? 'text-[#79bfe0]' : 'text-[#1685a1]')}>{String(index + 1).padStart(2, '0')}</span>
                    <p className={cx('premium-geist text-lg font-medium tracking-[-0.018em] sm:text-xl', manifesto ? 'text-white' : 'text-[#13263d]')}>{statement.title}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {block?.closingStatement ? (
              <p className={cx('mt-10 border-s-2 ps-5 premium-geist text-xl font-medium leading-8 tracking-[-0.02em] sm:text-2xl', manifesto ? 'border-[#28aec3] text-white' : 'border-[#084299] text-[#123b67]')}>{block.closingStatement}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

EditorialContentBlock.propTypes = { block: PropTypes.object };

