# Client Architecture (Next.js Frontend)

## 1) Purpose

`client/` is the presentation layer for the Injaaz Digital website.

- Renders CMS-driven pages from Strapi
- Handles locale/direction (`en`/`ar`, LTR/RTL)
- Handles blog listing/details UI
- Hosts the multi-step lead qualification form (book-call)

## 2) Folder structure

- `src/app/` - Next.js App Router entrypoints and metadata files
- `src/features/` - domain features (cms, blog, home visuals, book-call, figma-kit)
- `src/shared/` - shared layout and UI components
- `src/lib/` - infrastructure helpers (strapi client, i18n, config, utilities)
- `src/fonts/` - local font assets

## 3) Routing strategy

Main routes are in `src/app/(marketing)`:

- `/` -> `src/app/(marketing)/page.js`
- catch-all -> `src/app/(marketing)/[...slug]/page.js`
- `/blog` -> `src/app/(marketing)/blog/page.js`
- `/blog/[slug]` -> `src/app/(marketing)/blog/[slug]/page.js`
- `/book-call` -> `src/app/(marketing)/book-call/page.js`

Global route files:

- `src/app/layout.js` (root layout + metadata + fonts)
- `src/app/sitemap.js`
- `src/app/robots.js`

## 4) CMS rendering pipeline

The CMS flow is centralized in `src/features/cms`:

- Route loaders: `src/features/cms/lib/cms-route.js`
- Main orchestrator: `src/features/cms/lib/cms-page.js`
- Runtime shell: `src/features/cms/renderer/CmsSiteClient.jsx`
- Block renderer: `src/features/cms/renderer/CmsBlocksRenderer.jsx`
- Block registry: `src/features/cms/blocks/registry.jsx`

Block components are split by UID in `src/features/cms/blocks/*` and keyed by `__component` values like `blocks.hero`, `blocks.faq`, etc.

## 5) Data fetching + normalization

The Strapi data layer lives in `src/lib/strapi`:

- `client.js` - HTTP + error wrapper
- `queries.js` - reusable CMS queries + locale fallback + lead submission
- `normalizers.js` - flatten Strapi response shapes
- `utils.js` - media normalization and URL resolution

Important behavior:

- Uses published content (`status=published`)
- Locale fallback logic via `fetchWithLocaleFallback()`
- Uses incremental revalidation in `request()` (`revalidate: 60`)

## 6) Layout and UI composition

- Main shell: `src/shared/layout/MainLayout.jsx`
- Header: `src/shared/layout/Header.jsx`
- Footer: `src/shared/layout/Footer.jsx`
- UI primitives: `src/shared/ui/*`

The CMS header/footer data is normalized in `cms-page.js` and passed into layout components.

## 7) i18n model

- Locale helpers: `src/lib/i18n/locale.js`, `src/lib/i18n/locale.server.js`
- Language persisted in cookie/localStorage (`lang`)
- Direction (`rtl`/`ltr`) is applied in root and in UI blocks

## 8) Blog feature

- Blog list UI: `src/features/blog/components/BlogList.jsx`
- Blog post UI: `src/features/blog/components/BlogPost.jsx`
- Copy dictionary: `src/features/blog/lib/constants.js`
- Rich-text heading decoration: `src/features/blog/lib/helpers.js`

Blog data is fetched through the same CMS orchestration layer, not a separate API client.

## 9) Book-call lead form

- Component: `src/features/book-call/components/HomeworkForm.jsx`
- API integration: `createLeadSubmission()` in `src/lib/strapi/queries.js`
- Endpoint: `POST /api/lead-submissions` on Strapi

The form includes step-based validation and maps backend validation errors to field-level messages.

## 10) Styling and visuals

- Tailwind CSS v4 + custom global component layers in `src/app/globals.css`
- Theme tokens and many reusable CSS classes are defined globally
- Advanced visuals:
  - `HeroCubeStage.jsx` (Three.js)
  - `LiquidEther.tsx` (custom WebGL effect)

## 11) Key frontend files to learn first

1. `client/src/features/cms/lib/cms-page.js`
2. `client/src/features/cms/renderer/CmsSiteClient.jsx`
3. `client/src/features/cms/blocks/registry.jsx`
4. `client/src/lib/strapi/queries.js`
5. `client/src/lib/config/site-config.js`
6. `client/src/shared/layout/Header.jsx`
7. `client/src/features/book-call/components/HomeworkForm.jsx`
