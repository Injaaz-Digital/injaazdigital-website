export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: env.bool('STRAPI_PREVIEW_ENABLED', false),
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://127.0.0.1:3000')],
      async handler(uid: string, { documentId, locale }: { documentId: string; locale?: string }) {
        const supported = new Set(['api::page.page', 'api::article.article', 'api::blog-page.blog-page', 'api::home-page.home-page', 'api::about-page.about-page']);
        if (!supported.has(uid)) return null;
        const entry = await strapi.documents(uid as never).findOne({ documentId, locale: locale || 'en', status: 'draft' } as never) as Record<string, unknown> | null;
        if (!entry) return null;
        const slug = typeof entry.slug === 'string' ? entry.slug.trim() : '';
        const path = uid === 'api::blog-page.blog-page' ? '/blog' : uid === 'api::home-page.home-page' ? '/' : uid === 'api::about-page.about-page' ? '/about' : uid === 'api::article.article' ? `/blog/${slug}` : `/${slug}`;
        if (!['api::blog-page.blog-page', 'api::home-page.home-page', 'api::about-page.about-page'].includes(uid) && !slug) return null;
        const url = new URL('/api/draft', env('CLIENT_URL', 'http://127.0.0.1:3000'));
        url.searchParams.set('secret', env('STRAPI_PREVIEW_SECRET'));
        url.searchParams.set('path', path);
        url.searchParams.set('locale', locale === 'ar' ? 'ar' : 'en');
        return url.toString();
      },
    },
  },
});
