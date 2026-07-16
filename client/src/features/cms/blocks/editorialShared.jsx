import PropTypes from 'prop-types';

export const asArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const paragraphs = (value) =>
  typeof value === 'string'
    ? value.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
    : [];

export const CONTAINER = 'mx-auto w-[min(1120px,calc(100%_-_2rem))] sm:w-[min(1120px,calc(100%_-_3rem))]';
export const EYEBROW = 'text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#35628f]';
export const TITLE = 'premium-geist text-[clamp(2rem,4vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[#0b1728]';

export function Copy({ value, className = '' }) {
  return paragraphs(value).map((paragraph, index) => (
    <p key={`${paragraph.slice(0, 24)}-${index}`} className={className}>{paragraph}</p>
  ));
}

Copy.propTypes = { value: PropTypes.string, className: PropTypes.string };

