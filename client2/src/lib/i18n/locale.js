export function normalizeLocale(value) {
  return typeof value === 'string' && value.startsWith('ar') ? 'ar' : 'en';
}

export function getLocaleDirection(value) {
  return normalizeLocale(value) === 'ar' ? 'rtl' : 'ltr';
}
