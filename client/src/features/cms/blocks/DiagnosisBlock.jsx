import PropTypes from 'prop-types';
import { CornerDownRight } from 'lucide-react';
import { cn as cx } from '@/lib/utils';
import { asArray, CONTAINER, EYEBROW, TITLE } from './editorialShared';

export default function DiagnosisBlock({ block, locale = 'en' }) {
  const items = asArray(block?.items);
  const labels = locale === 'ar' ? { visible: 'المشكلة الظاهرة', deeper: 'النظام الأعمق' } : { visible: 'Visible problem', deeper: 'Deeper system' };
  return (
    <section className="relative overflow-hidden bg-[#f2f6f8] py-20 sm:py-28 lg:py-32">
      <div className={CONTAINER}>
        {block?.eyebrow ? <p className={EYEBROW}>{block.eyebrow}</p> : null}
        <h2 className={cx(TITLE, 'mt-5 max-w-[18ch] !text-[clamp(2rem,3.6vw,3.8rem)]')}>{block?.heading}</h2>
        {block?.description ? <p className="mt-5 max-w-[56ch] text-base leading-7 text-[#53677c]">{block.description}</p> : null}
        <div className="mt-12 border-t border-[#c9d6df]">
          {items.map((entry, index) => (
            <article key={`${entry.visibleProblem}-${index}`} className="grid gap-5 border-b border-[#d3dde4] py-7 md:grid-cols-[0.8fr_auto_1.2fr] md:items-start md:gap-10">
              <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#71869c]">{labels.visible}</p><h3 className="premium-geist mt-2 text-xl font-semibold tracking-[-0.02em] text-[#13263d]">{entry.visibleProblem}</h3></div>
              <CornerDownRight className="mt-6 hidden h-5 w-5 text-[#1685a1] md:block rtl:-scale-x-100" aria-hidden="true" />
              <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#1685a1]">{labels.deeper}</p><p className="mt-2 text-base leading-7 text-[#4f6277]">{entry.deeperSystem}</p></div>
            </article>
          ))}
        </div>
        {block?.closingStatement ? <p className="mt-10 premium-geist text-2xl font-medium tracking-[-0.025em] text-[#0d3a68]">{block.closingStatement}</p> : null}
      </div>
    </section>
  );
}

DiagnosisBlock.propTypes = { block: PropTypes.object, locale: PropTypes.oneOf(['en', 'ar']) };
