# Frontend testing strategy

Current automated coverage uses Node's test runner through `tsx`. It covers Strapi query serialization, media normalization, UID/registry/Strapi completeness, block schemas, locale and canonical normalization, redirect safety, webhook cache mapping, visual quality policy, and rich-text sanitization.

Commands:

```bash
cd client
npm run lint
npm run typecheck
npm test
npm run build

cd ../server
npm run test:booking
npm run build
```

End-to-end browser coverage is not installed in this repository. Before production rollout, add Playwright against disposable Strapi fixtures for localized navigation, booking, preview, and admin login/mutations. Calendar-provider tests must use the existing mock/provider boundaries and must never create real meetings from CI.
