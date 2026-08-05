import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { safeRedirectPath } from '@/lib/security/redirects';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  const destination = safeRedirectPath(request.nextUrl.searchParams.get('path'), '/');
  return NextResponse.redirect(new URL(destination, request.url), 307);
}
