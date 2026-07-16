import PropTypes from 'prop-types';
import Button from '@/shared/ui/Button';
import cx from '@/lib/utils/cx';

export const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);
export const asText = (value) => (typeof value === 'string' ? value.trim() : '');

const imageUrl = (keyword = 'premium-digital-studio') =>
  `https://picsum.photos/seed/${encodeURIComponent(keyword)}/1920/1080`;

export const SECTION_CONTAINER = 'mx-auto w-[min(1120px,calc(100%_-_2rem))] sm:w-[min(1120px,calc(100%_-_3rem))]';

export function SectionShell({ children, className = '', tone = 'plain', id }) {
  return (
    <section
      id={id}
      className={cx(
        'relative isolate overflow-hidden py-12 sm:py-16 lg:py-20',
        tone === 'blue' && 'bg-[#0b1728] text-white',
        className
      )}
    >
      {children}
    </section>
  );
}

SectionShell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tone: PropTypes.oneOf(['plain', 'soft', 'blue']),
  id: PropTypes.string,
};

export function CtaLink({ cta, onNavigate }) {
  const href = asText(cta?.url);
  const label = asText(cta?.label);

  if (!href || !label) return null;

  const handleClick = () => {
    if (cta?.isExternal) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (onNavigate) {
      onNavigate(href);
      return;
    }

    window.location.assign(href);
  };

  return (
    <Button variant={cta?.style === 'secondary' ? 'outline' : 'primary'} size="lg" onClick={handleClick}>
      {label}
    </Button>
  );
}

CtaLink.propTypes = {
  cta: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
    style: PropTypes.string,
    isExternal: PropTypes.bool,
  }),
  onNavigate: PropTypes.func,
};

export function SectionHeader({ heading, description, align = 'left', inverse = false, eyebrow }) {
  return (
    <div className={cx('max-w-[48rem]', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? (
        <p className={cx('mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em]', inverse ? 'text-[#c8d3df]' : 'text-[#35628f]')}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cx(
          'section-title max-w-[25ch] !text-[clamp(1.75rem,3vw,2.75rem)] !leading-[1.08] !tracking-[-0.024em]',
          align === 'center' && 'section-title--center mx-auto',
          inverse && '!text-[#f6f8fa]'
        )}
      >
        {heading}
      </h2>
      {description ? (
        <p className={cx('mt-4 max-w-[58ch] text-[0.95rem] leading-7 sm:text-base', align === 'center' && 'mx-auto', inverse ? 'text-[#c8d3df]' : 'text-[#53677c]')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

SectionHeader.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
  inverse: PropTypes.bool,
  eyebrow: PropTypes.string,
};

export function HeroTitle({ title, imageKeyword }) {
  const words = asText(title).split(' ').filter(Boolean);
  const insertAt = Math.min(3, Math.max(1, Math.floor(words.length / 3)));

  if (!words.length) return null;

  return (
    <h1 className="hero-title-plain mx-auto mt-3 w-full max-w-7xl max-sm:max-w-[calc(100vw-2rem)] text-center lg:mt-5">
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index === insertAt ? (
            <span
              className="mx-2 inline-block h-[0.58em] w-[1.32em] overflow-hidden rounded-full align-middle shadow-[0_0_0_1px_rgba(8,66,153,0.14)] max-sm:hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(6,10,13,0.04),rgba(6,10,13,0.28)),url(${imageUrl(imageKeyword)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(0.2) contrast(1.18)',
              }}
              aria-hidden="true"
            />
          ) : null}
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  );
}

HeroTitle.propTypes = {
  title: PropTypes.string,
  imageKeyword: PropTypes.string,
};

