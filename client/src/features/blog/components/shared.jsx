import Image from 'next/image';
import PropTypes from 'prop-types';
import { normalizeMedia } from '@/lib/strapi';

const TAGS_WRAPPER_CLASS = 'mt-5 flex flex-wrap gap-2.5';
const TAG_CHIP_CLASS =
  'inline-flex items-center rounded-full border border-white/72 bg-white/78 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#355884] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] backdrop-blur-sm';

export function CmsImage({
  media,
  src,
  alt,
  priority = false,
  className,
  width = 1400,
  height = 900,
  sizes = '100vw',
}) {
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
      priority={priority}
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
  priority: PropTypes.bool,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sizes: PropTypes.string,
};

export const renderTagChips = (tags, { className = TAGS_WRAPPER_CLASS } = {}) =>
  Array.isArray(tags) && tags.length > 0 ? (
    <div className={className}>
      {tags.map((tag) => (
        <span
          key={tag.slug || tag.name}
          className={TAG_CHIP_CLASS}
        >
          {tag.name}
        </span>
      ))}
    </div>
  ) : null;

export const renderAuthorMeta = (author, { showLinks = true, showBio = true, className = '' } = {}) => {
  if (!author?.name) return null;

  const avatar = normalizeMedia(author.avatar, { fallbackAlt: author.name });
  const wrapperClassName = [
    'mt-6 flex items-start gap-3 rounded-[24px] border border-white/74 bg-white/78 px-3.5 py-3.5 shadow-[0_18px_42px_rgba(8,41,89,0.08)] backdrop-blur-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName}>
      {avatar?.url ? (
        <CmsImage
          media={author.avatar}
          src={avatar.url}
          alt={author.name}
          width={72}
          height={72}
          sizes="72px"
          className="h-14 w-14 rounded-full object-cover ring-1 ring-[rgba(8,66,153,0.12)]"
        />
      ) : (
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(145deg,#f3f8ff,#e7f1ff)] text-sm font-semibold text-[#0a2546] ring-1 ring-[rgba(8,66,153,0.12)]">
          {author.name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#0a2546]">{author.name}</p>
        {author.role ? <p className="mt-0.5 text-sm text-[#5c7696]">{author.role}</p> : null}
        {showBio && author.bio ? (
          <div
            className="blog-body mt-2 max-w-[46ch] text-xs leading-6 text-[#6b85a2]"
            dangerouslySetInnerHTML={{ __html: author.bio }}
          />
        ) : null}
        {showLinks && Array.isArray(author.socialLinks) && author.socialLinks.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[#0b4f8c]">
            {author.socialLinks.slice(0, 3).map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url} className="hover:underline" target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
