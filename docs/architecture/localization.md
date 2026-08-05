# Localization

English and Arabic are normalized to `en` and `ar`; Arabic sets `dir=rtl`. The catch-all route recognizes an optional leading locale without introducing a competing router:

- `/en`, `/ar`
- `/en/<marketing-path>`, `/ar/<marketing-path>`
- `/en/blog/<slug>`, `/ar/blog/<slug>`

Legacy unprefixed URLs continue to work and use the existing locale cookie. Canonical and `hreflang` metadata point to locale-prefixed documents. On a prefixed route, the language switcher replaces the prefix and all internal CMS links are localized before rendering. On a legacy route, switching updates the cookie and refreshes, preserving backward compatibility.

The current Strapi article/page schema localizes slugs but does not expose a dedicated translation-link DTO to the frontend. If translated slugs differ, editors must provide the translated document slug and future routing work should resolve the related localization by `documentId`; the frontend does not assume a fabricated translated slug mapping.
