# 🚀 Getting started with Strapi

## Booking engine V2

The local `booking` plugin is enabled in `config/plugins.ts`. Existing calendar routes switch to the hardened engine when `BOOKING_ENGINE_V2=true`.

Booking-owned models (leads, meetings, notes, questions, responses, sessions, reservations, audits, and calendar settings) are intentionally hidden from Content Manager and Content-Type Builder. Administrators manage them through the **Injaaz Cal** sidebar workspace, whose authenticated `/booking/*` admin API preserves the existing database tables and relations.

Production configuration requires `BOOKING_SLOT_SECRET`, `BOOKING_SESSION_PEPPER`, and valid Google Calendar credentials. `BOOKING_LEGACY_TOKEN_UNTIL` may temporarily contain an ISO timestamp to migrate plaintext sessions; omit it after the migration window. Optional controls are `BOOKING_SLOT_TOKEN_TTL_SECONDS` (default `600`), `BOOKING_HOLD_SECONDS` (default `120`), `BOOKING_SESSION_TTL_HOURS` (default `24`), `BOOKING_AVAILABILITY_RATE_LIMIT` (default `90`/minute), and `BOOKING_MUTATION_RATE_LIMIT` (default `20`/minute).

Production fails closed when Google Calendar is unavailable. `BOOKING_EMERGENCY_LOCAL_ONLY=true` is the explicit emergency override and should not be used during normal operation. Run `npm run test:booking` for the plugin security tests.

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

### `seed:injaaz`

Run technical bootstrap only:
- ensure locales (`en`, `ar`)
- ensure canonical single-type document linkage
- ensure public read permissions for CMS content APIs

```bash
npm run seed:injaaz
```

This script is idempotent and safe to rerun. Use force mode only when intentionally rerunning bootstrap tasks:

```bash
npm run seed:injaaz:force
```

Bootstrap-related environment variables:
- `SEED_INJAAZ_BOOTSTRAP_VERSION` (default `v1`)
- `SEED_INJAAZ_FORCE` (default `false`)

### Content Workflow (Source of Truth)

- Schemas/components define structure (`__component`, block UIDs, relations, locales).
- Strapi database entries are the source of truth for real content.
- Editors should update content in Strapi Content Manager (EN/AR), not in seed scripts.
- `scripts/seed-injaaz.js` is technical bootstrap only.

### `sync:block-zones`

Sync dynamic-zone block allow-lists in page schemas from the canonical block registry:

```bash
npm run sync:block-zones
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
