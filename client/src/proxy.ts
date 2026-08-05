import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { localeFromPathname, localizePathname, preferredLocale } from '@/lib/i18n/routing';

const LOCALE_COOKIE = 'lang';
const ONE_YEAR = 60 * 60 * 24 * 365;

const cookieOptions = {
  httpOnly: false,
  maxAge: ONE_YEAR,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep the development-only visual sandbox on its existing route.
  if (process.env.NODE_ENV !== 'production' && pathname === '/demo') {
    return NextResponse.next();
  }

  const pathnameLocale = localeFromPathname(pathname);
  if (!pathnameLocale) {
    const locale = preferredLocale(
      request.cookies.get(LOCALE_COOKIE)?.value,
      request.headers.get('accept-language'),
    );
    const destination = request.nextUrl.clone();
    destination.pathname = localizePathname(pathname, locale);
    const response = NextResponse.redirect(destination, 307);
    response.cookies.set(LOCALE_COOKIE, locale, cookieOptions);
    response.headers.append('Vary', 'Cookie, Accept-Language');
    return response;
  }

  // Make the URL authoritative for server rendering as well as client navigation.
  const requestHeaders = new Headers(request.headers);
  const existingCookies = requestHeaders.get('cookie') || '';
  const cookiesWithoutLocale = existingCookies
    .split(';')
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie && !cookie.startsWith(`${LOCALE_COOKIE}=`));
  requestHeaders.set('cookie', [...cookiesWithoutLocale, `${LOCALE_COOKIE}=${pathnameLocale}`].join('; '));

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(LOCALE_COOKIE, pathnameLocale, cookieOptions);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
