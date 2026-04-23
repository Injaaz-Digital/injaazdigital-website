import { API_BASE_URL } from './client';

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;
const LEGACY_MEDIA_REGEX = /^\/(image(?:\d+|0\d)?|iPhone)\.png$/i;
const IMAGE_MIME_REGEX = /^image\//i;

export const toCanonicalMediaPath = (candidate) => {
  if (typeof candidate !== 'string') {
    return candidate;
  }

  if (LEGACY_MEDIA_REGEX.test(candidate)) {
    return `/media${candidate}`;
  }

  return candidate;
};

const resolveAssetUrl = (asset) => {
  if (!asset) return null;

  const candidateRaw =
    typeof asset === 'string'
      ? asset
      : asset.url ||
        asset.formats?.large?.url ||
        asset.formats?.medium?.url ||
        asset.formats?.small?.url ||
        asset.formats?.thumbnail?.url;

  const candidate = toCanonicalMediaPath(candidateRaw);
  if (!candidate) return null;
  if (ABSOLUTE_URL_REGEX.test(candidate)) return candidate;
  if (candidate.startsWith('/media/')) return candidate;

  return `${API_BASE_URL}${candidate}`;
};

const inferKind = (value, asset) => {
  if (typeof value?.kind === 'string' && value.kind.trim()) {
    return value.kind.trim();
  }

  const mime = typeof asset?.mime === 'string' ? asset.mime : '';
  if (IMAGE_MIME_REGEX.test(mime)) return 'image';
  if (mime) return 'file';
  return 'image';
};

export const normalizeMedia = (mediaOrUrl, options = {}) => {
  if (!mediaOrUrl) return null;

  if (typeof mediaOrUrl === 'string') {
    const url = resolveAssetUrl(mediaOrUrl);
    if (!url) return null;

    const fallbackAlt = typeof options.fallbackAlt === 'string' ? options.fallbackAlt : '';
    return {
      url,
      alt: fallbackAlt,
      caption: '',
      kind: 'image',
      isDecorative: false,
      width: null,
      height: null,
    };
  }

  const value = typeof mediaOrUrl === 'object' ? mediaOrUrl : {};
  const asset = value.asset || value;
  const url = resolveAssetUrl(asset);
  if (!url) return null;

  const explicitDecorative = value.isDecorative === true || asset.isDecorative === true;
  const fallbackAlt = typeof options.fallbackAlt === 'string' ? options.fallbackAlt : '';
  const altCandidate = typeof value.alt === 'string' ? value.alt : typeof asset.alternativeText === 'string' ? asset.alternativeText : '';
  const alt = explicitDecorative ? '' : altCandidate.trim() || fallbackAlt;
  const captionCandidate = typeof value.caption === 'string' ? value.caption : typeof asset.caption === 'string' ? asset.caption : '';

  return {
    url,
    alt,
    caption: captionCandidate.trim(),
    kind: inferKind(value, asset),
    isDecorative: explicitDecorative,
    width: Number.isFinite(asset.width) ? asset.width : null,
    height: Number.isFinite(asset.height) ? asset.height : null,
  };
};

export const resolveMediaUrl = (mediaOrUrl) => normalizeMedia(mediaOrUrl)?.url || null;
