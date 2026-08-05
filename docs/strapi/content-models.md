# Strapi content models

`offer` is the existing service model and was extended instead of introducing a competing service type. It now supports audiences, problems, deliverables, success metrics, FAQs, CTA, and case-study relationships.

New draft-and-publish collections:

- `case-study`: situation, diagnosis, intervention, results, verified metric cards, media, timeline, service, related articles, and SEO.
- `proof-entry`: testimonial/metric/media/logo proof with an explicit `verified` flag.
- `redirect`: active internal source/destination mapping and permanent/temporary status.

Article relationships now include related posts, related service, related case study, content pillar, and funnel stage. Existing category, tags, author, CTA, SEO, and localization remain compatible. No client results or metrics were seeded or fabricated.

Every page block has an optional shared `Block Settings` component with controlled enums. Arbitrary CSS, colors, JavaScript, and HTML are not exposed.
