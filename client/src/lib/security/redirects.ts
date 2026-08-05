const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;
const PUBLIC_PATH = /^\/(?:[a-zA-Z0-9][a-zA-Z0-9_-]*\/?)*$/;

export const isSafeInternalPath = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || CONTROL_CHARACTERS.test(value)) return false;
  try {
    const url = new URL(value, 'https://internal.invalid');
    return url.origin === 'https://internal.invalid' && !url.username && !url.password;
  } catch {
    return false;
  }
};

export const isSupportedPreviewPath = (value: unknown): value is string => {
  if (!isSafeInternalPath(value)) return false;
  const pathname = value.split(/[?#]/, 1)[0];
  if (pathname.startsWith('/api') || pathname.startsWith('/demo')) return false;
  return PUBLIC_PATH.test(pathname);
};

export const safeRedirectPath = (value: unknown, fallback = '/'): string => isSafeInternalPath(value) ? value : fallback;
