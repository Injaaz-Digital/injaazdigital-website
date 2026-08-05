import { z } from 'zod';
import { CMS_BLOCK_UIDS } from '../block-uids';

const entityId = z.union([z.string(), z.number()]).optional();
const optionalText = z.string().trim().optional().nullable();
const blockSettings = {
  id: entityId,
  anchorId: optionalText,
  internalName: optionalText,
  theme: z.enum(['light', 'dark', 'accent', 'editorial', 'default', 'muted', 'contrast']).optional(),
  spacingTop: z.enum(['compact', 'normal', 'spacious']).optional(),
  spacingBottom: z.enum(['compact', 'normal', 'spacious']).optional(),
  visibility: z.enum(['all', 'desktop', 'mobile', 'hidden']).optional(),
  trackingId: optionalText,
  version: z.number().int().nonnegative().optional(),
};

const schemaFor = <T extends (typeof CMS_BLOCK_UIDS)[number]>(uid: T) =>
  z.object({ __component: z.literal(uid), ...blockSettings }).passthrough();

export const CMS_BLOCK_SCHEMAS = {
  'blocks.hero': schemaFor('blocks.hero'),
  'blocks.hero-minimal': schemaFor('blocks.hero-minimal'),
  'blocks.page-hero': schemaFor('blocks.page-hero'),
  'blocks.animated-text': schemaFor('blocks.animated-text'),
  'blocks.problem': schemaFor('blocks.problem'),
  'blocks.service-overview': schemaFor('blocks.service-overview'),
  'blocks.feature-list': schemaFor('blocks.feature-list'),
  'blocks.faq': schemaFor('blocks.faq'),
  'blocks.process': schemaFor('blocks.process'),
  'blocks.final-cta': schemaFor('blocks.final-cta'),
  'blocks.book-call': schemaFor('blocks.book-call'),
  'blocks.system-flow': schemaFor('blocks.system-flow'),
  'blocks.diagnosis': schemaFor('blocks.diagnosis'),
  'blocks.timeline': schemaFor('blocks.timeline'),
  'blocks.statement-pair': schemaFor('blocks.statement-pair'),
  'blocks.principles': schemaFor('blocks.principles'),
  'blocks.dashboard-showcase': schemaFor('blocks.dashboard-showcase'),
  'blocks.booking-meeting': schemaFor('blocks.booking-meeting'),
  'blocks.brand-proof-grid': schemaFor('blocks.brand-proof-grid'),
} as const;

export const cmsBlockSchema = z.discriminatedUnion('__component', [
  CMS_BLOCK_SCHEMAS['blocks.hero'], CMS_BLOCK_SCHEMAS['blocks.hero-minimal'], CMS_BLOCK_SCHEMAS['blocks.page-hero'],
  CMS_BLOCK_SCHEMAS['blocks.animated-text'], CMS_BLOCK_SCHEMAS['blocks.problem'], CMS_BLOCK_SCHEMAS['blocks.service-overview'],
  CMS_BLOCK_SCHEMAS['blocks.feature-list'], CMS_BLOCK_SCHEMAS['blocks.faq'], CMS_BLOCK_SCHEMAS['blocks.process'],
  CMS_BLOCK_SCHEMAS['blocks.final-cta'], CMS_BLOCK_SCHEMAS['blocks.book-call'], CMS_BLOCK_SCHEMAS['blocks.system-flow'],
  CMS_BLOCK_SCHEMAS['blocks.diagnosis'], CMS_BLOCK_SCHEMAS['blocks.timeline'], CMS_BLOCK_SCHEMAS['blocks.statement-pair'],
  CMS_BLOCK_SCHEMAS['blocks.principles'], CMS_BLOCK_SCHEMAS['blocks.dashboard-showcase'], CMS_BLOCK_SCHEMAS['blocks.booking-meeting'],
  CMS_BLOCK_SCHEMAS['blocks.brand-proof-grid'],
]);

export const parseCmsBlocks = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value.map((block) => cmsBlockSchema.safeParse(block));
};
