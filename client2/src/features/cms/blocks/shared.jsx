import Image from 'next/image';
import PropTypes from 'prop-types';
import Button from '@/shared/ui/Button';
import { normalizeMedia } from '@/lib/strapi';

export const BLOCK_SECTION_IDS = {
  'blocks.persona-grid': 'who-it-is-for',
  'blocks.problem': 'problem',
  'blocks.solution-system': 'solution-system',
  'blocks.process-timeline': 'how-it-works',
  'blocks.packages': 'packages',
  'blocks.faq': 'faq',
};

export const DEFAULT_PERSONA_VISUALS = ['/media/image3.png', '/media/image2.png', '/media/image6.png', '/media/image4.png', '/media/image7.png', '/media/iPhone.png'];

const PROCESS_VISUAL_VARIANTS = ['orbit', 'availability', 'meeting', 'launch'];

export const PROCESS_VIEWPORT = { once: true, amount: 0.28 };
export const PROCESS_EASE = [0.22, 1, 0.36, 1];

export const PROCESS_SECTION_COPY = {
  en: {
    eyebrow: 'Execution Rhythm',
    intro: 'Each phase is framed as a visible deliverable, so progress feels tangible and approvals stay easy.',
    summaryLabel: 'Structured in',
    summaryValue: 'phases',
    summaryNote: 'Clear handoffs, tighter feedback loops, and fewer surprises during delivery.',
    orbitCenter: 'Brief',
    orbitNodes: ['Goals', 'Assets', 'Scope'],
    scheduleRows: [
      { day: 'Mon', from: '09:00', to: '17:00' },
      { day: 'Tue', from: '10:00', to: '18:00' },
      { day: 'Wed', from: '11:30', to: '19:00' },
    ],
    scheduleBadge: 'Availability locked',
    meetingControls: ['Video', 'Audio', 'Notes'],
    launchLabel: 'Launch Ready',
    launchScore: '98%',
    launchItems: ['QA passed', 'Content loaded', 'Tracking live'],
  },
  ar: {
    eyebrow: 'إيقاع التنفيذ',
    intro: 'كل مرحلة كتكون مؤطرة بمخرجات واضحة، باش يبقى التقدم ظاهر والمراجعة سهلة.',
    summaryLabel: 'مبني على',
    summaryValue: 'مراحل',
    summaryNote: 'تسليم منظم، ردود أسرع، ومفاجآت أقل أثناء التنفيذ.',
    orbitCenter: 'الانطلاقة',
    orbitNodes: ['الأهداف', 'الأصول', 'النطاق'],
    scheduleRows: [
      { day: 'الإثنين', from: '09:00', to: '17:00' },
      { day: 'الثلاثاء', from: '10:00', to: '18:00' },
      { day: 'الأربعاء', from: '11:30', to: '19:00' },
    ],
    scheduleBadge: 'الجاهزية مضبوطة',
    meetingControls: ['فيديو', 'صوت', 'ملاحظات'],
    launchLabel: 'جاهز للإطلاق',
    launchScore: '٩٨٪',
    launchItems: ['اجتاز الفحص', 'تم تجهيز المحتوى', 'التتبع جاهز'],
  },
};

const linkStyleToVariant = (style) => {
  if (style === 'secondary') {
    return 'outline';
  }

  if (style === 'tertiary') {
    return 'ghost';
  }

  return 'primary';
};

export const pickVisual = (items, index, fallback) => {
  if (items.length === 0) {
    return fallback;
  }

  const source = items[index % items.length];
  const normalized = normalizeMedia(source);
  return normalized?.url || fallback;
};

export function CmsImage({ media, src, alt, width, height, className, sizes = '100vw' }) {
  const normalized = normalizeMedia(media || src, { fallbackAlt: alt });
  if (!normalized?.url) return null;
  const imageAlt = normalized.isDecorative ? '' : normalized.alt || '';

  return (
    <Image
      src={normalized.url}
      alt={imageAlt}
      width={width}
      height={height}
      unoptimized
      className={className}
      sizes={sizes}
      aria-hidden={normalized.isDecorative ? true : undefined}
    />
  );
}

CmsImage.propTypes = {
  media: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  sizes: PropTypes.string,
};

export function ProcessVisual({ variant, locale }) {
  const copy = PROCESS_SECTION_COPY[locale] || PROCESS_SECTION_COPY.en;

  if (variant === 'availability') {
    return (
      <div className="process-visual process-visual--availability" aria-hidden="true">
        <div className="process-schedule">
          <span className="process-schedule__badge">{copy.scheduleBadge}</span>
          {copy.scheduleRows.map((row) => (
            <div key={`${row.day}-${row.from}`} className="process-schedule__row">
              <span className="process-toggle" />
              <span className="process-schedule__day">{row.day}</span>
              <span className="process-schedule__time">{row.from}</span>
              <span className="process-schedule__dash" />
              <span className="process-schedule__time">{row.to}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'meeting') {
    return (
      <div className="process-visual process-visual--meeting" aria-hidden="true">
        <div className="process-browser">
          <div className="process-browser__chrome">
            <span />
            <span />
            <span />
          </div>

          <div className="process-browser__stage">
            <div className="process-avatar process-avatar--lead">A</div>
            <div className="process-browser__beam" />
            <div className="process-browser__pulse" />
            <div className="process-avatar process-avatar--guest">B</div>
          </div>

          <div className="process-browser__controls">
            {copy.meetingControls.map((item) => (
              <span key={item} className="process-browser__control">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'launch') {
    return (
      <div className="process-visual process-visual--launch" aria-hidden="true">
        <div className="process-launch">
          <span className="process-launch__label">{copy.launchLabel}</span>
          <p className="process-launch__score">{copy.launchScore}</p>
          <div className="process-launch__meter">
            <span />
          </div>
          <div className="process-launch__stack">
            {copy.launchItems.map((item) => (
              <div key={item} className="process-launch__item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="process-visual process-visual--orbit" aria-hidden="true">
      <div className="process-orbit__ring process-orbit__ring--lg" />
      <div className="process-orbit__ring process-orbit__ring--md" />
      <div className="process-orbit__ring process-orbit__ring--sm" />
      <div className="process-orbit__core">{copy.orbitCenter}</div>
      <span className="process-orbit__node process-orbit__node--north">{copy.orbitNodes[0]}</span>
      <span className="process-orbit__node process-orbit__node--west">{copy.orbitNodes[1]}</span>
      <span className="process-orbit__node process-orbit__node--east">{copy.orbitNodes[2]}</span>
    </div>
  );
}

ProcessVisual.propTypes = {
  variant: PropTypes.oneOf(PROCESS_VISUAL_VARIANTS).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
};

export function CmsLinkButton({ link, onNavigate, className, size = 'md' }) {
  if (!link?.label || !link?.url) {
    return null;
  }

  const handleClick = () => {
    if (link.isExternal) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (onNavigate) {
      onNavigate(link.url);
      return;
    }

    window.location.href = link.url;
  };

  return (
    <Button
      variant={linkStyleToVariant(link.style)}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {link.label}
    </Button>
  );
}

CmsLinkButton.propTypes = {
  link: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
    style: PropTypes.string,
    isExternal: PropTypes.bool,
  }),
  onNavigate: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
