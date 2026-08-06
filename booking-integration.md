# Injaaz booking integration

Injaaz uses Flow as the booking system of record. Strapi owns page composition and editorial copy only. The registered Flow website selects its default question flow; `blocks.book-call` has no Flow key or stepper relation. Flow owns flow definitions, authorization, availability, calendar credentials, leads, reservations, and meetings.

## Current behavior

The Next.js server proxy at `client/src/app/api/booking/[...path]/route.ts` keeps the legacy global Flow key server-side. It must not be exposed through `NEXT_PUBLIC_*` variables. This proxy remains in place until Flow's tenant backfill and site-specific trusted mutation endpoints are explicitly approved and deployed.

Next.js loads the `site_injaaz_digital` integration server-side, then fetches the exact default flow runtime authorized for that site. If the site or its default flow cannot be loaded, the page renders a clear localized configuration error. Questionnaire selection is never read from Strapi.

## Planned trusted-proxy cutover

After the Flow migration is verified:

1. Register the production and local Injaaz origins on the seeded `site_injaaz_digital` website.
2. Authorize each CMS-used flow and set the intended default explicitly.
3. Connect the Injaaz Google Calendar from Flow's Website integrations admin page.
4. Rotate and store the one-time Injaaz website secret in the deployment secret manager.
5. Update the Next.js proxy to send that site ID and secret to Flow's trusted mutation API.
6. Smoke-test qualification, booking retry/idempotency, cancellation, and rescheduling in English and Arabic.
7. Remove the legacy global key only after old routes show no traffic.

No Strapi tenant model should be added. A CMS block needs only editorial configuration and a Flow key; Flow validates that the key belongs to and is authorized for the Injaaz website.
