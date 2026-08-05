# Observability and privacy

Next instrumentation records application startup. CMS loaders, schema failures, preview attempts, webhook invalidation, sitemap fallback, and admin mutations emit JSON logs. Standard fields include request ID, route, operation, locale, content type, document ID, duration/status where available, and stable error code.

The logger redacts keys matching tokens, secrets, passwords, cookies, email, phone, answers, notes, and meeting links. Lead answers and contact data are never intentionally logged.

The provider-neutral analytics contract lives under `client/src/lib/analytics`. Events are dispatched only after an `analytics_consent=granted` cookie and are de-duplicated by event ID. No analytics vendor was added.
