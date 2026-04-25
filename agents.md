# Injaaz Digital - Architecture Overview

This repository is split into two applications:

- `client/` - Next.js frontend (website rendering, routing, UI, SEO metadata)
- `server/` - Strapi v5 backend (CMS, content models, APIs, lead submission)

## 1) What the application does

This is a CMS-driven marketing platform for Injaaz Digital.

- Frontend renders marketing pages, blog pages, and a book-call flow.
- Backend stores structured content (single types, collection types, dynamic zones).
- Pages are composed from reusable block components (`blocks.*`) defined in Strapi and rendered in React via a block registry.

## 2) High-level architecture

- Style: split frontend/backend + headless CMS
- Rendering flow:
  1. User requests route in Next.js (`client/src/app/(marketing)`)
  2. Frontend loads CMS content via `loadCmsRoute()`
  3. Frontend calls Strapi REST APIs (`/api/...`)
  4. Strapi route middleware applies deep populate maps
  5. Frontend normalizes response and renders block-by-block

## 3) Main technologies

- Frontend:
  - Next.js App Router (`client/src/app`)
  - React + Tailwind CSS (`client/src/app/globals.css`)
  - Framer Motion and Three.js for advanced visuals
- Backend:
  - Strapi v5 (`server/src/api`, `server/src/components`)
  - Users-permissions plugin
  - Upload providers (local/cloudinary/s3)
  - Postgres default DB config with SQLite fallback

## 4) Core integration points

- Frontend Strapi client: `client/src/lib/strapi/*`
- Frontend CMS orchestration: `client/src/features/cms/lib/cms-page.js`
- Backend block registry and populate strategy:
  - `server/src/content-system/blocks.json`
  - `server/src/content-system/populate.ts`

## 5) Key route/content model

- Static route map for single-types in frontend:
  - `client/src/lib/config/site-config.js` (`CMS_SINGLE_TYPE_BY_PATH`)
- Dynamic catch-all pages:
  - `client/src/app/(marketing)/[...slug]/page.js`
- Blog routes:
  - `client/src/app/(marketing)/blog/page.js`
  - `client/src/app/(marketing)/blog/[slug]/page.js`

## 6) Lead submission flow

- Frontend form: `client/src/features/book-call/components/HomeworkForm.jsx`
- API call: `createLeadSubmission()` in `client/src/lib/strapi/queries.js`
- Backend custom endpoint:
  - Route: `server/src/api/lead/routes/01-custom-lead.ts`
  - Controller: `server/src/api/lead/controllers/lead.ts`

## 7) Most important files to read first

- Frontend:
  - `client/src/features/cms/lib/cms-page.js`
  - `client/src/features/cms/renderer/CmsSiteClient.jsx`
  - `client/src/features/cms/blocks/registry.jsx`
- Backend:
  - `server/src/content-system/blocks.json`
  - `server/src/content-system/populate.ts`
  - `server/src/index.ts`
  - `server/src/api/lead/controllers/lead.ts`

## 8) Documentation map

- Global overview: this file (`agents.md`)
- Frontend details: `client-architecture.md`
- Backend details: `server-architecture.md`
