import PropTypes from 'prop-types';
import { ArrowRight, CornerDownRight } from 'lucide-react';
import cx from '@/lib/utils/cx';

const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
const paragraphs = (value) => typeof value === 'string' ? value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean) : [];
const CONTAINER = 'mx-auto w-[min(1120px,calc(100%_-_2rem))] sm:w-[min(1120px,calc(100%_-_3rem))]';
const EYEBROW = 'text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#35628f]';
const TITLE = 'premium-geist text-[clamp(2rem,4vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[#0b1728]';

function Copy({ value, className = '' }) {
  return paragraphs(value).map((paragraph, index) => (
    <p key={`${paragraph.slice(0, 24)}-${index}`} className={className}>{paragraph}</p>
  ));
}

Copy.propTypes = { value: PropTypes.string, className: PropTypes.string };

export function EditorialContentSection({ block }) {
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

EditorialContentSection.propTypes = { block: PropTypes.object };

export function SystemFlowSection({ block }) {
  const steps = asArray(block?.steps);
  const signals = asArray(block?.signals);
  const measurement = block?.variant === 'measurement';

  return (
    <section className={cx('relative overflow-hidden py-20 sm:py-28 lg:py-32', measurement ? 'bg-[#081a30] text-white' : 'bg-white')}>
      <div className={CONTAINER}>
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            {block?.eyebrow ? <p className={cx(EYEBROW, measurement && '!text-[#8eb7d6]')}>{block.eyebrow}</p> : null}
            <h2 className={cx(TITLE, 'mt-5 !text-[clamp(2rem,3.5vw,3.7rem)]', measurement && '!text-white')}>{block?.heading}</h2>
            {block?.description ? <p className={cx('mt-6 max-w-[46ch] text-base leading-7', measurement ? 'text-[#c0cfdd]' : 'text-[#53677c]')}>{block.description}</p> : null}
          </div>
          <div>
            <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3" aria-label={block?.heading}>
              {steps.map((step, index) => (
                <li key={`${step.title}-${index}`} className={cx('group relative min-h-28 overflow-hidden rounded-[18px] border p-5', measurement ? 'border-white/12 bg-white/[0.045]' : 'border-[#d6e1e8] bg-[#f8fbfc]')}>
                  <span className={cx('text-[0.65rem] font-semibold tracking-[0.14em]', measurement ? 'text-[#79bfe0]' : 'text-[#1685a1]')}>{String(index + 1).padStart(2, '0')}</span>
                  <p className={cx('premium-geist mt-5 text-lg font-semibold tracking-[-0.02em]', measurement ? 'text-white' : 'text-[#13263d]')}>{step.title}</p>
                  {index < steps.length - 1 ? <ArrowRight className="absolute end-4 top-4 h-4 w-4 opacity-35 rtl:rotate-180" aria-hidden="true" /> : null}
                </li>
              ))}
            </ol>
            {signals.length ? (
              <div className="mt-10 grid gap-x-8 border-t border-current/15 sm:grid-cols-2">
                {signals.map((signal, index) => (
                  <article key={`${signal.title}-${index}`} className="border-b border-current/15 py-5">
                    <h3 className={cx('premium-geist font-semibold tracking-[-0.01em]', measurement ? 'text-white' : 'text-[#173b66]')}>{signal.title}</h3>
                    {signal.description ? <p className={cx('mt-2 text-sm leading-6', measurement ? 'text-[#b8c9d8]' : 'text-[#5b6c7c]')}>{signal.description}</p> : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {block?.closingStatement ? <p className={cx('mt-12 max-w-[62ch] premium-geist text-xl font-medium leading-8 tracking-[-0.02em] sm:text-2xl', measurement ? 'text-white' : 'text-[#123b67]')}>{block.closingStatement}</p> : null}
      </div>
    </section>
  );
}

SystemFlowSection.propTypes = { block: PropTypes.object };

export function DiagnosisSection({ block, locale = 'en' }) {
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

DiagnosisSection.propTypes = { block: PropTypes.object, locale: PropTypes.oneOf(['en', 'ar']) };

export function TimelineSection({ block }) {
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

TimelineSection.propTypes = { block: PropTypes.object };

export function StatementPairSection({ block }) {
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

StatementPairSection.propTypes = { block: PropTypes.object };

export function PrinciplesSection({ block, locale = 'en' }) {
  const items = asArray(block?.items);
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>{block?.eyebrow ? <p className={EYEBROW}>{block.eyebrow}</p> : null}<h2 className={cx(TITLE, 'mt-5 !text-[clamp(2rem,3.4vw,3.6rem)]')}>{block?.heading}</h2>{block?.description ? <p className="mt-5 text-base leading-7 text-[#53677c]">{block.description}</p> : null}</div>
          <ol className="border-t border-[#cbd7df]">
            {items.map((entry, index) => (
              <li key={`${entry.title}-${index}`} className="grid gap-3 border-b border-[#d5dfe6] py-5 sm:grid-cols-[2.5rem_0.8fr_1.2fr] sm:gap-6 sm:py-6">
                <span className="text-xs font-semibold text-[#1685a1]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="premium-geist text-lg font-semibold tracking-[-0.018em] text-[#13263d]">{entry.title}</h3>
                <p className="text-sm leading-6 text-[#596b7c]">{entry.description}</p>
              </li>
            ))}
          </ol>
        </div>
        {block?.directionHeading ? (
          <div className="mt-20 grid gap-8 rounded-[28px] border border-[#cfdae2] bg-[#f2f7f9] p-7 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-12">
            <div><p className={EYEBROW}>{locale === 'ar' ? 'الاتجاه' : 'Direction'}</p><h3 className="premium-geist mt-4 text-3xl font-medium tracking-[-0.035em] text-[#0b1728] sm:text-4xl">{block.directionHeading}</h3></div>
            <div><div className="space-y-5 text-base leading-8 text-[#4f6277]"><Copy value={block.directionBody} /></div>{block?.closingStatement ? <p className="mt-8 border-s-2 border-[#084299] ps-5 premium-geist text-xl font-medium leading-8 text-[#123b67]">{block.closingStatement}</p> : null}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

PrinciplesSection.propTypes = { block: PropTypes.object, locale: PropTypes.oneOf(['en', 'ar']) };
