import PropTypes from 'prop-types';
import { Gauge, Network, Orbit, PanelsTopLeft, RefreshCcw, Waypoints } from 'lucide-react';
import cx from '@/lib/utils/cx';
import { asArray, Copy, CONTAINER, EYEBROW, TITLE } from './editorialShared';

const PRINCIPLE_VISUALS = [
  { name: 'systems', Icon: Network },
  { name: 'strategy', Icon: Waypoints },
  { name: 'technology', Icon: PanelsTopLeft },
  { name: 'measurement', Icon: Gauge },
  { name: 'operate', Icon: Orbit },
  { name: 'feedback', Icon: RefreshCcw },
];

function PrincipleVisual({ index }) {
  const visual = PRINCIPLE_VISUALS[index % PRINCIPLE_VISUALS.length];
  const Icon = visual.Icon;

  return (
    <div className={`principle-visual principle-visual--${visual.name}`} aria-hidden="true">
      <div className="principle-visual__track" />
      <div className="principle-visual__glow principle-visual__glow--one" />
      <div className="principle-visual__glow principle-visual__glow--two" />
      <div className="principle-visual__glow principle-visual__glow--three" />
      <div className="principle-visual__bars">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="principle-visual__icon-shell">
        <div className="principle-visual__icon">
          <Icon strokeWidth={1.45} />
        </div>
      </div>
    </div>
  );
}

PrincipleVisual.propTypes = { index: PropTypes.number.isRequired };

export default function PrinciplesBlock({ block, locale = 'en' }) {
  const items = asArray(block?.items);
  const isHomePrinciples = ['Why Injaaz Digital', 'لماذا إنجاز ديجيتال'].includes(block?.eyebrow);

  if (isHomePrinciples) {
    return (
      <section className="principles-mosaic" aria-labelledby="principles-heading">
        <div className={CONTAINER}>
          <header className="principles-mosaic__header">
            <div>
              {block?.eyebrow ? <p className="principles-mosaic__eyebrow">{block.eyebrow}</p> : null}
              <h2 id="principles-heading" className="principles-mosaic__heading">{block?.heading}</h2>
            </div>
            {block?.description ? <p className="principles-mosaic__description">{block.description}</p> : null}
          </header>

          <ol className="principles-mosaic__grid">
            {items.map((entry, index) => (
              <li key={`${entry.title}-${index}`} className="principles-card">
                <PrincipleVisual index={index} />
                <div className="principles-card__copy">
                  <span className="principles-card__number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

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

PrinciplesBlock.propTypes = { block: PropTypes.object, locale: PropTypes.oneOf(['en', 'ar']) };

