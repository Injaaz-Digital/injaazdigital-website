import PropTypes from 'prop-types';
import { ArrowRight } from 'lucide-react';
import { cn as cx } from '@/lib/utils';
import { asArray, CONTAINER, EYEBROW } from './editorialShared';

export default function SystemFlowBlock({ block }) {
  const steps = asArray(block?.steps);
  const signals = asArray(block?.signals);
  const measurement = block?.variant === 'measurement';

  return (
    <section className={cx('relative overflow-hidden py-20 sm:py-28 lg:py-32', measurement && 'bg-[#081a30] text-white')}>
      <div className={CONTAINER}>
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            {block?.eyebrow ? <p className={cx(EYEBROW, measurement && '!text-[#8eb7d6]')}>{block.eyebrow}</p> : null}
            <h2 className={cx('mt-5 !text-[clamp(2rem,3.5vw,3.7rem)]', measurement ? '!text-white' : 'section-title !text-[clamp(2rem,3.5vw,3.7rem)]')}>{block?.heading}</h2>
            {block?.description ? <p className={cx('mt-6 max-w-[46ch] text-base leading-7', measurement ? 'text-[#c0cfdd]' : 'text-[#53677c]')}>{block.description}</p> : null}
          </div>
          <div>
            <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label={block?.heading}>
              {steps.map((step, index) => (
                <li key={`${step.title}-${index}`} className={cx('group rounded-[24px] corner-squircle border p-5 transition-all duration-200', measurement ? 'border-white/12 bg-white/[0.045]' : 'border-[#d6e1e8] hover:border-[#c0cbd8] hover:shadow-[0_4px_20px_rgba(8,52,106,0.06)]')}>
                  <span className={cx('text-[0.65rem] font-semibold tracking-[0.14em]', measurement ? 'text-[#79bfe0]' : 'text-[#1685a1]')}>{String(index + 1).padStart(2, '0')}</span>
                  <p className={cx('premium-geist mt-4 text-lg font-semibold tracking-[-0.02em]', measurement ? 'text-white' : 'text-[#13263d]')}>{step.title}</p>
                  {step.description ? (
                    <p className={cx('mt-2 text-sm leading-5', measurement ? 'text-[#b8c9d8]' : 'text-[#596b7c]')}>{step.description}</p>
                  ) : null}
                  {index < steps.length - 1 ? (
                    <ArrowRight className="absolute end-4 top-4 h-4 w-4 text-[#1685a1] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>
            {signals.length ? (
              <div className="mt-10">
                <div className="grid gap-x-8 border-t border-[#d6e1e8] sm:grid-cols-2">
                  {signals.map((signal, index) => (
                    <article key={`${signal.title}-${index}`} className={cx('border-b border-[#dce3e9] py-5 transition-colors duration-200', measurement ? '' : 'hover:bg-[#f8fafb] hover:px-3 -mx-3 rounded-lg')}>
                      <h3 className={cx('premium-geist font-semibold tracking-[-0.01em]', measurement ? 'text-white' : 'text-[#173b66]')}>{signal.title}</h3>
                      {signal.description ? <p className={cx('mt-2 text-sm leading-6', measurement ? 'text-[#b8c9d8]' : 'text-[#5b6c7c]')}>{signal.description}</p> : null}
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {block?.closingStatement ? <p className={cx('mt-12 max-w-[62ch] premium-geist text-xl font-medium leading-8 tracking-[-0.02em] sm:text-2xl', measurement ? 'text-white' : 'text-[#123b67]')}>{block.closingStatement}</p> : null}
      </div>
    </section>
  );
}

SystemFlowBlock.propTypes = { block: PropTypes.object };
