import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { buildQuery } from '../src/lib/strapi/client';
import { normalizeMedia, toCanonicalMediaPath } from '../src/lib/strapi/utils';
import { CMS_BLOCK_UIDS } from '../src/features/cms/blocks/block-uids';
import { cmsBlockSchema } from '../src/features/cms/blocks/schemas/block.schemas';
import { normalizeLocale } from '../src/lib/i18n/locale';
import { normalizeCmsUrl, toAbsoluteSiteUrl } from '../src/lib/config/site-config';
import { cmsCacheTags } from '../src/features/cms/server/cms-cache';
import { cacheTagsForStrapiWebhook } from '../src/features/cms/server/strapi-webhook';
import { isSafeInternalPath, isSupportedPreviewPath } from '../src/lib/security/redirects';
import { resolveVisualQuality } from '../src/lib/visual/visual-quality';

test('Strapi query serialization preserves nested filters and array order', () => {
  assert.equal(buildQuery({ locale: 'ar', filters: { slug: { $eq: 'growth' } }, sort: ['featured:desc', 'updatedAt:desc'] }), '?locale=ar&filters%5Bslug%5D%5B%24eq%5D=growth&sort%5B0%5D=featured%3Adesc&sort%5B1%5D=updatedAt%3Adesc');
});

test('media normalization resolves legacy and Strapi media safely', () => {
  assert.equal(toCanonicalMediaPath('/image03.png'), '/media/image03.png');
  assert.deepEqual(normalizeMedia({ url: '/uploads/example.png', alternativeText: 'Example', width: 20, height: 10 }), { url: 'http://127.0.0.1:1337/uploads/example.png', alt: 'Example', caption: '', kind: 'image', isDecorative: false, width: 20, height: 10 });
});

test('CMS block UID contract matches Strapi config and frontend registry', async () => {
  const blockConfig = JSON.parse(await readFile(new URL('../../server/src/content-system/blocks.json', import.meta.url), 'utf8'));
  const registrySource = await readFile(new URL('../src/features/cms/blocks/registry.tsx', import.meta.url), 'utf8');
  const registered = [...registrySource.matchAll(/^\s*'([^']+)':/gm)].map((match) => match[1]);
  assert.deepEqual([...new Set(Object.values(blockConfig.blocks))].sort(), [...CMS_BLOCK_UIDS].sort());
  assert.deepEqual(registered.sort(), [...CMS_BLOCK_UIDS].sort());
});

test('every configured block passes its discriminated runtime schema', () => {
  CMS_BLOCK_UIDS.forEach((uid) => assert.equal(cmsBlockSchema.safeParse({ __component: uid, id: 1 }).success, true));
  assert.equal(cmsBlockSchema.safeParse({ __component: 'blocks.untrusted' }).success, false);
});

test('locale and canonical URL normalization are stable', () => {
  assert.equal(normalizeLocale('ar-MA'), 'ar');
  assert.equal(normalizeLocale('fr'), 'en');
  assert.equal(normalizeCmsUrl('blog/post/'), '/blog/post');
  assert.equal(toAbsoluteSiteUrl('/blog/post'), 'http://127.0.0.1:3000/blog/post');
});

test('preview redirect safety rejects external and protocol-relative targets', () => {
  assert.equal(isSafeInternalPath('/blog/post?draft=1'), true);
  assert.equal(isSafeInternalPath('//evil.example'), false);
  assert.equal(isSafeInternalPath('https://evil.example'), false);
  assert.equal(isSupportedPreviewPath('/api/private'), false);
  assert.equal(isSupportedPreviewPath('/blog/post'), true);
});

test('webhook mapping invalidates locale-specific old and new blog slugs', () => {
  const tags = cacheTagsForStrapiWebhook({ event: 'entry.update', model: 'api::article.article', entry: { locale: 'ar', slug: 'new', oldSlug: 'old' } });
  assert.deepEqual(new Set(tags), new Set([cmsCacheTags.blogIndex('ar'), cmsCacheTags.blogPost('new', 'ar'), cmsCacheTags.blogPost('old', 'ar'), cmsCacheTags.sitemap()]));
});

test('visual quality honors reduced motion and constrained hardware', () => {
  assert.equal(resolveVisualQuality('auto', { width: 1440, devicePixelRatio: 2, reducedMotion: true, saveData: false, hardwareConcurrency: 8, webgl: true }), 'low');
  assert.equal(resolveVisualQuality('auto', { width: 1440, devicePixelRatio: 1, reducedMotion: false, saveData: false, hardwareConcurrency: 8, webgl: true }), 'high');
});
