# Frontend architecture

The frontend is Next.js 16.2 with the App Router and React 19. Strapi 5.11.3 is the editorial and administrative control plane. Public pages are loaded on the server; static blocks render as Server Components and interactive features cross explicit client boundaries.

## Routing

- Legacy routes remain available: `/`, `/blog`, `/blog/:slug`, `/book-call`, and the marketing catch-all.
- Stable localized compatibility routes are handled by the same catch-all: `/en`, `/ar`, `/en/:path`, `/ar/:path`, `/en/blog/:slug`, and `/ar/blog/:slug`.
- Existing non-prefixed URLs are not forcibly redirected. Their canonical metadata points at the localized document.
- Content, leads, meetings, and editorial administration are managed exclusively through the Strapi admin panel. The Next.js application exposes no custom admin or admin-login routes.

## Published page request

```mermaid
sequenceDiagram
  participant B as Browser
  participant N as Next.js Server
  participant C as CMS Loader
  participant S as Strapi
  B->>N: GET /en/growth-system
  N->>C: getCmsPage(/growth-system, en)
  par independent requests
    C->>S: page query
    C->>S: site settings query
  end
  S-->>C: Strapi documents
  C->>C: unwrap, validate, map, sanitize
  C-->>N: typed page DTO
  N-->>B: server HTML + client-island references
```

## Server and client boundaries

```mermaid
flowchart TD
  Page["CmsSiteServer"] --> Header["SiteHeaderClient"]
  Page --> Renderer["CmsBlocksRenderer (server)"]
  Page --> Blog["Blog interaction island"]
  Page --> Footer["Footer (server)"]
  Renderer --> Static["Static blocks"]
  Renderer --> Motion["AnimatedText / Process islands"]
  Renderer --> Hero["Hero + Three.js island"]
  Renderer --> Booking["Booking funnel island"]
  Renderer --> Proof["Interactive proof grid island"]
```

Static blocks: page hero shell, problem, service overview, feature list, FAQ markup, final CTA shell, system flow, diagnosis, timeline, statement pair, principles, dashboard shell, and booking-meeting. Client islands: header controls, hero/WebGL, animated text, process tabs/GSAP, brand-proof carousel, booking, blog list filters, blog post table-of-contents observer, and canvas effects.

The old page-wide `CmsSiteClient` boundary was removed. The isolated demo route keeps its own client-only `MainLayout`; production marketing routes use `CmsSiteServer`.
