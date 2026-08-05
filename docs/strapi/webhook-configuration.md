# Strapi webhook configuration

Create a Strapi webhook targeting `https://<frontend>/api/revalidate/strapi` for entry create, update, publish, unpublish, and delete events. Prefer an HMAC header:

`x-strapi-signature: sha256=<HMAC-SHA256(raw-body, STRAPI_WEBHOOK_SECRET)>`

If the webhook UI cannot compute HMAC, use `Authorization: Bearer <STRAPI_WEBHOOK_SECRET>`. Include locale, slug, and old/previous slug when available. Site settings, pages/offers, blog page, and article models have targeted tag mapping.
