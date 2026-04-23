import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { normalizeMedia } from '@/lib/strapi/utils';

const cx = (...values) => values.filter(Boolean).join(' ');

const GRID_CLASS = 'mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2 lg:grid-rows-[236px_236px_236px_236px]';

const CARD_SHELL_CLASS =
  'min-h-[280px] overflow-hidden rounded-[28px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,247,255,0.92))] shadow-[0_18px_50px_rgba(8,41,89,0.08)] backdrop-blur-sm will-change-transform sm:min-h-0 sm:h-full sm:rounded-[34px]';

const TALL_CARD_INNER_CLASS =
  'grid h-full grid-rows-[132px_auto] gap-3 px-4 py-5 text-center sm:grid-rows-[minmax(0,1fr)_auto] sm:px-7 sm:py-[1.75rem]';

const COMPACT_CARD_INNER_CLASS =
  'grid h-full grid-rows-[132px_auto] gap-3 px-4 py-5 text-center sm:grid-rows-none sm:grid-cols-[minmax(0,1fr)_112px] sm:items-center sm:gap-4 sm:px-7 sm:py-[1.25rem]';

const CARD_REVEAL_PROPS = {
  initial: { opacity: 0.38, y: 26, scale: 0.985 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: false, amount: 0.28, margin: '0px 0px -10% 0px' },
};

function getCardTransition(index) {
  return {
    duration: 0.68,
    delay: Math.min(index * 0.05, 0.18),
    ease: [0.22, 1, 0.36, 1],
  };
}

const CARD_LAYOUTS = [
  {
    slotClass: 'lg:col-[1/span_1] lg:row-[1/span_1]',
    variant: 'compact',
    imageClass: 'max-h-[118px] w-full max-w-[118px] object-contain sm:max-h-[162px] sm:max-w-[128px]',
  },
  {
    slotClass: 'lg:col-[2/span_1] lg:row-[1/span_2]',
    variant: 'tall',
    imageClass: 'max-h-[118px] w-full max-w-[118px] object-contain sm:max-h-[268px] sm:max-w-[238px]',
  },
  {
    slotClass: 'lg:col-[1/span_1] lg:row-[2/span_1]',
    variant: 'compact',
    imageClass: 'max-h-[118px] w-full max-w-[118px] object-contain sm:max-h-[162px] sm:max-w-[128px]',
  },
  {
    slotClass: 'lg:col-[1/span_1] lg:row-[3/span_2]',
    variant: 'tall',
    imageClass: 'max-h-[118px] w-full max-w-[118px] object-contain sm:max-h-[276px] sm:max-w-[254px]',
  },
  {
    slotClass: 'lg:col-[2/span_1] lg:row-[3/span_1]',
    variant: 'compact',
    imageClass: 'max-h-[118px] w-full max-w-[104px] object-contain sm:max-h-[138px] sm:max-w-[112px]',
  },
  {
    slotClass: 'lg:col-[2/span_1] lg:row-[4/span_1]',
    variant: 'compact',
    imageClass: 'max-h-[118px] w-full max-w-[118px] object-contain sm:max-h-[162px] sm:max-w-[128px]',
  },
];

const DEFAULT_MOSAIC_CARDS = [
  {
    title: 'Sharper Positioning',
    description: 'Clarify the offer and message so visitors understand value in seconds.',
  },
  {
    title: 'Trust-First UI',
    description: 'Use proof, hierarchy, and calm design language to reduce hesitation.',
  },
  {
    title: 'Conversion Copy',
    description: 'Turn generic text into decision-driving copy near action points.',
  },
  {
    title: 'Frictionless Flow',
    description: 'Guide users from first scroll to booking with fewer dead ends.',
  },
  {
    title: 'Revenue Visibility',
    description: 'Connect pages, forms, and CRM touchpoints for cleaner reporting.',
  },
  {
    title: 'Scalable Structure',
    description: 'Build reusable sections your team can extend without redesign debt.',
  },
];


function resolveCardImage(card) {
  const normalized = normalizeMedia(card?.artwork, { fallbackAlt: card?.title || '' });

  if (!normalized?.url) {
    return null;
  }

  return {
    src: normalized.url,
    alt: normalized.alt || card?.title || '',
  };
}

function CardCopy({ card, variant, isArabic }) {
  const isTall = variant === 'tall';
  const textDirectionProps = {
    dir: isArabic ? 'rtl' : 'ltr',
    lang: isArabic ? 'ar' : 'en',
    style: { unicodeBidi: 'plaintext' },
  };
  const titleAlignClass = isTall ? 'text-center' : isArabic ? 'text-right' : 'text-center sm:text-left';
  const bodyAlignClass = isTall ? 'text-center' : isArabic ? 'text-center sm:text-right' : 'text-center sm:text-left';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={isArabic ? 'ar' : 'en'}
      className={cx(
        'w-full',
        isTall
          ? 'mx-auto flex flex-col items-center'
          : 'order-2 flex min-w-0 flex-col justify-center sm:order-1'
      )}
    >
      {card.title ? (
        <h3
          {...textDirectionProps}
          className={cx(
            'w-full text-balance font-medium tracking-[-0.04em] text-[#111111]',
            titleAlignClass,
            isTall ? 'text-[1.16rem] leading-[1.08] sm:text-[1.42rem]' : 'text-[1.16rem] leading-[1.08] sm:text-[1.24rem]'
          )}
        >
          {card.title}
        </h3>
      ) : null}

      {card.description ? (
        <p
          {...textDirectionProps}
          className={cx(
            'w-full text-[#5e6878]',
            bodyAlignClass,
            isTall
              ? 'mt-2 text-[0.92rem] leading-6 sm:mt-3 sm:text-[0.96rem] sm:leading-7'
              : 'mt-2 text-[0.92rem] leading-6 sm:mt-1.5 sm:text-[0.94rem] sm:leading-7'
          )}
        >
          {card.description}
        </p>
      ) : null}
    </div>
  );
}

CardCopy.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(['compact', 'tall']).isRequired,
  isArabic: PropTypes.bool.isRequired,
};

function CardArtwork({ image, imageClass, title }) {
  if (!image?.src) {
    return null;
  }

  return (
    <img
      src={image.src}
      alt={image.alt || title || ''}
      loading="lazy"
      className={imageClass}
    />
  );
}

CardArtwork.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
  imageClass: PropTypes.string.isRequired,
  title: PropTypes.string,
};

CardArtwork.defaultProps = {
  image: null,
  title: '',
};

function TallCard({ card, layout, isArabic, index }) {
  const image = resolveCardImage(card);

  return (
    <motion.article
      className={cx(CARD_SHELL_CLASS, layout.slotClass)}
      transition={getCardTransition(index)}
      {...CARD_REVEAL_PROPS}
    >
      <div className={TALL_CARD_INNER_CLASS}>
        <div className="flex h-[132px] items-center justify-center sm:min-h-0 sm:h-full">
          <CardArtwork
            image={image}
            imageClass={layout.imageClass}
            title={card.title}
          />
        </div>

        <CardCopy
          card={card}
          variant="tall"
          isArabic={isArabic}
        />
      </div>
    </motion.article>
  );
}

TallCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    artwork: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }).isRequired,
  layout: PropTypes.shape({
    slotClass: PropTypes.string.isRequired,
    imageClass: PropTypes.string.isRequired,
  }).isRequired,
  isArabic: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

function CompactCard({ card, layout, isArabic, index }) {
  const image = resolveCardImage(card);

  return (
    <motion.article
      className={cx(CARD_SHELL_CLASS, layout.slotClass)}
      transition={getCardTransition(index)}
      {...CARD_REVEAL_PROPS}
    >
      <div className={COMPACT_CARD_INNER_CLASS}>
        <CardCopy
          card={card}
          variant="compact"
          isArabic={isArabic}
        />

        <div className="order-1 flex h-[132px] w-full items-center justify-center sm:order-2 sm:h-full sm:justify-center">
          <CardArtwork
            image={image}
            imageClass={layout.imageClass}
            title={card.title}
          />
        </div>
      </div>
    </motion.article>
  );
}

CompactCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    artwork: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }).isRequired,
  layout: PropTypes.shape({
    slotClass: PropTypes.string.isRequired,
    imageClass: PropTypes.string.isRequired,
  }).isRequired,
  isArabic: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

function MosaicCard({ card, layout, isArabic, index }) {
  if (layout.variant === 'tall') {
    return <TallCard card={card} layout={layout} isArabic={isArabic} index={index} />;
  }

  return <CompactCard card={card} layout={layout} isArabic={isArabic} index={index} />;
}

MosaicCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    artwork: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }).isRequired,
  layout: PropTypes.shape({
    slotClass: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['compact', 'tall']).isRequired,
    imageClass: PropTypes.string.isRequired,
  }).isRequired,
  isArabic: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

export default function FeatureMosaicBlock({ block, locale }) {
  const isArabic = locale === 'ar';
  const sourceCards = Array.isArray(block.cards) ? block.cards.filter(Boolean).slice(0, CARD_LAYOUTS.length) : [];
  const cards = sourceCards.length > 0 ? sourceCards : DEFAULT_MOSAIC_CARDS;
  const sectionTextDirectionProps = {
    dir: isArabic ? 'rtl' : 'ltr',
    lang: isArabic ? 'ar' : 'en',
    style: { unicodeBidi: 'plaintext' },
  };

  if (!block.heading && !block.subheading && cards.length === 0) {
    return null;
  }

  return (
    <section className="section relative overflow-hidden">
      <div className="layout-content-wide">
        <div className="section-head" {...sectionTextDirectionProps}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? (
            <h2
              className="section-title text-center text-[#111111]"
            >
              {block.heading}
            </h2>
          ) : null}

          {block.subheading ? (
            <p
              className="section-head-lead text-[#5e6878] sm:text-[1.02rem] sm:leading-8"
            >
              {block.subheading}
            </p>
          ) : null}
        </div>

        <div className={GRID_CLASS}>
          {cards.map((card, index) => (
            <MosaicCard
              key={`${card.title || card.description || 'card'}-${index}`}
              card={card}
              layout={CARD_LAYOUTS[index] || CARD_LAYOUTS[0]}
              isArabic={isArabic}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

FeatureMosaicBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    subheading: PropTypes.string,
    cards: PropTypes.array,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
};
