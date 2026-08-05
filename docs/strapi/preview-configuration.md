# Strapi preview configuration

The Strapi `config/admin.ts` preview handler supports `api::page.page`, `api::blog-page.blog-page`, and `api::article.article`. It loads the draft document, builds an internal content path, and opens the Next.js Draft Mode endpoint.

Required server variables:

```text
CLIENT_URL=https://www.example.com
STRAPI_PREVIEW_ENABLED=true
STRAPI_PREVIEW_SECRET=<same 32+ character secret as Next.js>
```

Required Next.js variable:

```text
STRAPI_PREVIEW_SECRET=<same secret>
```

The generated format is `/api/draft?secret=<secret>&path=<internal-path>&locale=en|ar`. The Next.js endpoint validates every field and redirects to the localized URL.
