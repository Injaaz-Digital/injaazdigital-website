import { timingSafeEqual } from 'node:crypto';
import { draftMode, cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { requireServerEnv } from '@/lib/config/env';
import { isSupportedPreviewPath } from '@/lib/security/redirects';
import { normalizeLocale } from '@/lib/i18n/locale';
import { cmsLogger } from '@/features/cms/server/cms-logger';

export const dynamic = 'force-dynamic';

const secretsMatch = (provided: string, expected: string) => {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
};

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  let expected: string;
  try {
    expected = requireServerEnv('STRAPI_PREVIEW_SECRET');
  } catch (error) {
    cmsLogger.error('Preview configuration is unavailable.', { requestId, operation: 'draft.enable', errorCode: 'PREVIEW_NOT_CONFIGURED' });
    return NextResponse.json({ ok: false, error: { code: 'PREVIEW_NOT_CONFIGURED', message: 'Preview is not configured.' } }, { status: 503 });
  }

  const secret = request.nextUrl.searchParams.get('secret') || '';
  const path = request.nextUrl.searchParams.get('path') || '/';
  const localeInput = request.nextUrl.searchParams.get('locale') || 'en';
  if (!secretsMatch(secret, expected)) {
    cmsLogger.warn('Preview secret was rejected.', { requestId, operation: 'draft.enable', errorCode: 'INVALID_PREVIEW_SECRET' });
    return NextResponse.json({ ok: false, error: { code: 'INVALID_PREVIEW_SECRET', message: 'Invalid preview credentials.' } }, { status: 401 });
  }
  if (!isSupportedPreviewPath(path)) {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_PREVIEW_PATH', message: 'The preview path is not supported.' } }, { status: 400 });
  }
  if (localeInput !== 'en' && localeInput !== 'ar') {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_LOCALE', message: 'Supported locales are en and ar.' } }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();
  const cookieStore = await cookies();
  cookieStore.set('lang', normalizeLocale(localeInput), { httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 31536000 });
  cmsLogger.info('Draft mode enabled.', { requestId, operation: 'draft.enable', route: path, locale: localeInput, status: 'success' });
  const localizedPath = `/${localeInput}${path === '/' ? '' : path}`;
  return NextResponse.redirect(new URL(localizedPath, request.url), 307);
}
