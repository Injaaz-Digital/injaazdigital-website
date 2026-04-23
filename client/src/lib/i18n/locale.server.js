import { cookies } from 'next/headers';
import { normalizeLocale } from './locale';

export async function getInitialLang() {
  try {
    const store = await cookies();
    const cookieVal = store.get('lang')?.value;
    if (cookieVal) {
      return normalizeLocale(cookieVal);
    }
  } catch {
    // ignore and fallback
  }

  return normalizeLocale();
}
