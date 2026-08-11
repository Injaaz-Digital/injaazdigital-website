import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/config/env';

export const dynamic = 'force-dynamic';

const allowed = [
  /^config$/,
  /^availability$/,
  /^flows\/[a-z][a-z0-9_-]*\/runtime$/,
  /^sites\/site_[a-zA-Z0-9_-]+\/config$/,
  /^sites\/site_[a-zA-Z0-9_-]+\/flows\/[a-z][a-z0-9_-]*\/runtime$/,
  /^sites\/site_[a-zA-Z0-9_-]+\/availability$/,
  /^sessions$/,
  /^sessions\/[0-9a-f-]+\/(answers|contact|complete)$/,
  /^meetings$/,
  /^meetings\/[0-9a-f-]+\/(cancel|reschedule)$/,
];

const forward = async (request: NextRequest, context: { params: Promise<{ path: string[] }> }) => {
  const { path } = await context.params;
  const resource = path.join('/');
  if (!allowed.some(pattern => pattern.test(resource))) return NextResponse.json({ error: { message: 'Booking route not found', code: 'NOT_FOUND' } }, { status: 404 });

  const env = getServerEnv();
  if (!env.CONTENT_ANALYZER_API_URL || !env.CONTENT_ANALYZER_BOOKING_KEY) {
    return NextResponse.json({ error: { message: 'Booking service is not configured', code: 'BOOKING_NOT_CONFIGURED' } }, { status: 503 });
  }

  const upstream = new URL(`/api/v1/booking/public/${resource}`, env.CONTENT_ANALYZER_API_URL);
  upstream.search = request.nextUrl.search;
  const contentType = request.headers.get('content-type');
  let body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();
  if (resource === 'sessions' && contentType?.includes('application/json') && env.CONTENT_ANALYZER_BOOKING_SITE_ID) {
    try {
      const input = JSON.parse(body || '{}');
      const visitorId = request.cookies.get(`flow_vid_${env.CONTENT_ANALYZER_BOOKING_SITE_ID}`)?.value;
      const sessionId = request.cookies.get(`flow_sid_${env.CONTENT_ANALYZER_BOOKING_SITE_ID}`)?.value;
      if (/^v_[A-Za-z0-9_-]{12,158}$/.test(visitorId || '') && /^s_[A-Za-z0-9_-]{12,158}$/.test(sessionId || '')) {
        body = JSON.stringify({ ...input, analyticsContext: { visitorId, sessionId } });
      }
    } catch {
      // The upstream booking schema returns the canonical malformed-body error.
    }
  }
  const response = await fetch(upstream, {
    method: request.method,
    headers: {
      Accept: 'application/json',
      'X-Website-Key': env.CONTENT_ANALYZER_BOOKING_KEY,
      ...(contentType ? { 'Content-Type': contentType } : {}),
      ...(request.headers.get('idempotency-key') ? { 'Idempotency-Key': request.headers.get('idempotency-key')! } : {}),
      ...(request.headers.get('x-request-id') ? { 'X-Request-Id': request.headers.get('x-request-id')! } : {}),
    },
    body,
    cache: 'no-store',
  }).catch(() => null);

  if (!response) return NextResponse.json({ error: { message: 'Booking service is unavailable', code: 'BOOKING_UNAVAILABLE' } }, { status: 503 });
  return new NextResponse(await response.text(), { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' } });
};

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
