import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireServerEnv } from '@/lib/config/env';
import { cacheTagsForStrapiWebhook, strapiWebhookSchema } from '@/features/cms/server/strapi-webhook';
import { cmsLogger } from '@/features/cms/server/cms-logger';

export const dynamic = 'force-dynamic';

const equal = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  let secret: string;
  try { secret = requireServerEnv('STRAPI_WEBHOOK_SECRET'); }
  catch { return NextResponse.json({ ok: false, error: { code: 'WEBHOOK_NOT_CONFIGURED' } }, { status: 503 }); }

  const bodyText = await request.text();
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  const signature = request.headers.get('x-strapi-signature') || '';
  const expectedSignature = createHmac('sha256', secret).update(bodyText).digest('hex');
  if (!(bearer && equal(bearer, secret)) && !(signature && equal(signature.replace(/^sha256=/, ''), expectedSignature))) {
    cmsLogger.warn('Strapi webhook authentication failed.', { requestId, operation: 'cache.revalidate', errorCode: 'INVALID_WEBHOOK_SIGNATURE' });
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  let json: unknown;
  try { json = JSON.parse(bodyText); }
  catch { return NextResponse.json({ ok: false, error: { code: 'INVALID_JSON' } }, { status: 400 }); }
  const parsed = strapiWebhookSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_WEBHOOK_PAYLOAD', issues: parsed.error.issues.map(({ path, code }) => ({ path, code })) } }, { status: 400 });
  }

  const tags = cacheTagsForStrapiWebhook(parsed.data);
  tags.forEach((tag) => revalidateTag(tag, 'max'));
  cmsLogger.info('Strapi webhook processed.', { requestId, operation: 'cache.revalidate', contentType: typeof parsed.data.model === 'string' ? parsed.data.model : parsed.data.model.uid, event: parsed.data.event, tagCount: tags.length, status: 'success' });
  return NextResponse.json({ ok: true, event: parsed.data.event, revalidated: tags });
}
