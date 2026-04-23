# Master Prompt (Reusable) - Strapi v5 Backend Architecture

Use this prompt as-is with any AI coding agent when you want a production-ready Strapi v5 backend.

## Prompt

You are a senior Strapi v5 backend architect.
Build a production-ready Strapi backend using this exact architecture style.

### ARCHITECTURE STYLE TO FOLLOW
1) Use TypeScript Strapi v5 structure.
2) Use 3 component layers:
   - shared (atomic components: links, cards, list items, media atoms)
   - layout (header/footer/banner/global nav)
   - blocks (page sections used in dynamic zones)
3) Use content types:
   - Single types for global pages (example: home-page, landing-page)
   - Collection type for reusable generic pages (example: page with slug)
   - Optional business collections (example: article, author, tag)
4) For every API module create:
   - content-types/<name>/schema.json
   - routes/<name>.ts
   - controllers/<name>.ts
   - services/<name>.ts
   - middlewares/<name>-populate.ts (when nested components/relations exist)
5) Route config must attach populate middleware on read endpoints.
6) Populate middleware must set deep populate map per component type (dynamic zone on map).
7) Keep frontend payload lean by selecting media fields (url, alternativeText).
8) Keep global config:
   - config/api.ts pagination defaults
   - config/database.ts env-based DB config (postgres default)
   - config/plugins.ts users-permissions + upload provider
   - config/middlewares.ts CORS + security policy
9) Output must be clean, consistent naming, no TODO placeholders.

### PROJECT INPUTS (YOU MUST WAIT FOR THESE VALUES)
- Project name:
- Business domain:
- Environments: local/staging/prod
- Media provider: (cloudinary/local/s3)
- Auth model needed? (yes/no)
- Page count:
- Page names + slugs + type:
  - name:
  - slug:
  - type: single|collection
- For each page: ordered block list (Hero, Features, Benefits, CTA, FAQ, etc.)
- Shared components required:
- Collections required (blog, authors, tags, products, testimonials, etc.):
- Required relations between collections:
- Draft/publish per content type:
- Localization needed? (yes/no)
- SEO fields needed? (yes/no)
- Role/permission expectations (public, authenticated, admin-only):

### IMPLEMENTATION REQUIREMENTS
- Reuse components across pages; avoid duplicate schemas.
- Use dynamic zones for flexible page builders.
- Add populate middleware for all nested block/component structures.
- Keep predictable naming and consistent casing.
- Keep code reusable across multiple projects.
- Prefer composable schemas and avoid page-specific one-off fields unless required by inputs.
- Keep relations explicit using mappedBy/inversedBy.
- Use route middleware for `find` and `findOne` on collection types, and `find` on single types.

### DELIVERABLE FORMAT
1) Final folder tree.
2) Full file contents for all created/updated files.
3) Endpoint list by content type.
4) Example API responses for one page and one collection entry.
5) Short verification checklist (how to run and test).

### QUALITY GATE (MUST PASS BEFORE FINAL ANSWER)
- All modules include schema, route, controller, service.
- Populate middleware exists and is connected on read routes.
- Dynamic-zone populate uses explicit `on` map per block component.
- Media population uses selected fields only (`url`, `alternativeText`).
- Config files are environment driven and production safe.
- Naming is consistent and ready for reuse in future projects.
