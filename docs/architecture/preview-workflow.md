# Draft preview workflow

```mermaid
sequenceDiagram
  participant E as Strapi editor
  participant A as Strapi preview handler
  participant D as /api/draft
  participant P as Localized page
  participant S as Strapi REST
  E->>A: Preview page/article
  A->>D: secret, internal path, locale
  D->>D: constant-time secret check + redirect validation
  D-->>P: enable Draft Mode and redirect /en or /ar
  P->>S: status=draft, cache=no-store
  S-->>P: draft document
```

Set `STRAPI_PREVIEW_ENABLED=true`, `CLIENT_URL`, and the same 32+ character `STRAPI_PREVIEW_SECRET` in both applications. Strapi supports pages, blog pages, and articles. External, protocol-relative, admin, API, and demo redirects are rejected. `/api/draft/disable?path=/` exits Draft Mode using a safe internal redirect.
