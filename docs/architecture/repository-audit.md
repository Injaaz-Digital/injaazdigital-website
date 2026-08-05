# Repository audit (2026-07-17)

## Toolchain and topology

- Package manager: npm with separate lockfiles for `client` and `server`.
- Frontend: Next.js 16.1.6, React 19.2, Tailwind CSS 4, App Router.
- Backend: Strapi 5.11.3, TypeScript, Postgres default with SQLite fallback.
- Tests before this work: booking plugin Node tests only. The client had no test or type-check script.
- No Playwright, Vitest, Jest, bundle analyzer, middleware/proxy, or external observability SDK was configured.

## Routes and boundaries

Public routes were homepage, marketing catch-all, blog list/article, book-call, and demo. Admin routes exposed leads, lead detail, and meetings. Five empty legacy Google Calendar API directories and an empty `lib/google` directory exist only on disk and are not route modules or tracked application code.

The former `CmsSiteClient` made header, footer, every block, and blog content part of one client subtree. Client-only modules included the header, booking funnel, blog views, GSAP process/animated text, Three.js, liquid WebGL, proof carousel, and canvas effects. Static content is now outside that boundary.

## CMS lifecycle and discrepancy

Strapi REST reads used a blanket 60-second fetch revalidation without content tags. There was no Draft Mode, preview handler, or webhook invalidation. The frontend configured 19 component UIDs but registered 18; `blocks.booking-meeting` was missing. A compiler contract and test now cover the mismatch.

The request lifecycle is: route loader → locale resolution → parallel site/page or article reads → Strapi normalization → runtime schema validation → domain normalization → server renderer. Draft Mode changes REST status and disables caching.

## Security findings

- Admin pages and actions trusted `ENABLE_INTERNAL_ADMIN`; there was no identity, expiry, role, or action authorization.
- Article body and author biography reached `dangerouslySetInnerHTML` without a strict sanitizer.
- The client Strapi helper referenced a public-token escape hatch.
- Example Google OAuth values looked like real credentials and were removed.
- Rich-text heading IDs were inserted with regular expressions.
- Lead local storage included answers and contact data.

These findings are addressed by signed sessions, action validation, allowlist sanitization/parser-based headings, server-only token handling, scrubbed examples, and opaque local resume state.

## Performance and consistency findings

- Largest sources remain `globals.css` (2,983 lines), `LiquidEther.tsx` (1,274), the compatibility CMS mapper/loader (about 870 after query/SEO/sitemap extraction), `HomeworkForm.jsx` (566), `Header.jsx` (553), and `BrandProofGridBlock.jsx` (521).
- The hero could load both liquid WebGL and Three.js continuously; it now selects the CSS atmosphere when the cube is present.
- The `cn` and `cx` utilities duplicated responsibility; imports now use one `cn` implementation.
- Four unused Domaine font weights were loaded.
- Dashboard production fallbacks contained plausible business metrics. They now render only CMS-provided metrics.
- Several deleted/obsolete block and Figma-kit files were already part of the incoming worktree and were preserved as user-owned changes.

## Remaining large-file work

The CMS loader no longer owns query construction, metadata, sitemap, registry, schemas, rendering, preview, cache invalidation, or logging. It still contains specialized legacy page/site/blog normalization and booking hydration. Extracting the remaining brand-proof mapper and booking hydrator is safe follow-up work, but should be paired with fixture-heavy contract tests to avoid changing the current redesign data shape.
