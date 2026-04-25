# Server Architecture (Strapi v5 Backend)

## 1) Purpose

`server/` is the content and API backend.

- Stores page and blog content
- Defines reusable CMS blocks/components
- Exposes REST APIs consumed by Next.js
- Handles custom lead submissions

## 2) Top-level backend structure

- `config/` - runtime configuration (server, DB, CORS, plugins, admin, API limits)
- `src/api/` - Strapi API modules by content type
- `src/components/` - Strapi component schemas (shared/layout/blocks)
- `src/content-system/` - canonical block registry + populate maps
- `src/index.ts` - app bootstrap logic
- `scripts/` - maintenance and bootstrap scripts

## 3) Content model strategy

### Single types

- `home-page`
- `growth-engine-page`
- `web-studio-page`
- `about-page`
- `blog-page`
- `site-setting`

### Collection types

- `page` (generic slug-based pages)
- `article`
- `author`
- `tag`
- `lead`

All page-like types use dynamic zones for `blocks` and optional localized `header/footer/seo` components.

## 4) Components strategy

`src/components/` is split into:

- `shared/` - atomic pieces (`link`, `media`, `metric`, `faq-item`, etc.)
- `layout/` - global shells (`header`, `footer`, `footer-column`)
- `blocks/` - page sections (`hero`, `problem`, `packages`, `brand-proof-grid`, etc.)

This enables reusable content schemas across multiple page types.

## 5) API module pattern

Each module under `src/api/<name>/` follows Strapi standard:

- `content-types/<name>/schema.json`
- `routes/<name>.ts`
- `controllers/<name>.ts`
- `services/<name>.ts`
- `middlewares/<name>-populate.ts` (for read population)

Most controllers/services are core Strapi factory wrappers, except custom lead controller logic.

## 6) Populate middleware system

Core files:

- Registry: `src/content-system/blocks.json`
- Populate map: `src/content-system/populate.ts`
- Middleware factory: `src/content-system/middleware.ts`

Route middlewares attach deep populate rules for `find`/`findOne` endpoints so frontend gets predictable nested payloads.

## 7) Bootstrap behavior

`src/index.ts` performs two key bootstrap tasks:

1. Ensures public role read permissions for selected CMS APIs
2. Registers document middleware to sanitize nested component IDs before persistence (`COMPONENT_SAFE_MODELS`)

## 8) Lead submission API

Custom routes:

- `POST /api/lead-submissions`
- `POST /api/leads/submit`

Files:

- Route: `src/api/lead/routes/01-custom-lead.ts`
- Controller: `src/api/lead/controllers/lead.ts`
- Schema: `src/api/lead/content-types/lead/schema.json`

Controller includes:

- field sanitization
- required/email/url validation
- simple anti-spam heuristics
- payload shaping (`qualificationAnswers`, locale, sourcePath)

## 9) Configuration and environment

Main config files:

- `config/server.ts` - host/port/app keys
- `config/database.ts` - Postgres default + SQLite fallback + SSL options
- `config/middlewares.ts` - security/CORS/body/session/public middleware stack
- `config/plugins.ts` - users-permissions JWT + upload provider config
- `config/api.ts` - REST pagination defaults
- `config/admin.ts` - admin auth/api token salts

Env template: `server/.env.example`

## 10) Scripts and operational helpers

- `scripts/seed-injaaz.js`
  - ensures locales (`en`, `ar`)
  - enforces canonical single-type documents
  - ensures public read permissions
- `scripts/sync-block-zones.js`
  - syncs page dynamic-zone allowed blocks from `blocks.json` to schema files

## 11) Media and uploads

- Upload provider is env-selectable: `local | cloudinary | s3`
- Local media lives in `server/public/uploads`
- Shared media component: `src/components/shared/media.json`

## 12) Key backend files to learn first

1. `server/src/content-system/blocks.json`
2. `server/src/content-system/populate.ts`
3. `server/src/index.ts`
4. `server/src/api/page/content-types/page/schema.json`
5. `server/src/api/home-page/content-types/home-page/schema.json`
6. `server/src/api/article/content-types/article/schema.json`
7. `server/src/api/lead/controllers/lead.ts`
