import type { CmsBlockUid } from '../domain/cms.types';

export const CMS_BLOCK_UIDS = [
  'blocks.hero',
  'blocks.hero-minimal',
  'blocks.page-hero',
  'blocks.animated-text',
  'blocks.problem',
  'blocks.service-overview',
  'blocks.feature-list',
  'blocks.faq',
  'blocks.process',
  'blocks.final-cta',
  'blocks.book-call',
  'blocks.system-flow',
  'blocks.diagnosis',
  'blocks.timeline',
  'blocks.statement-pair',
  'blocks.principles',
  'blocks.dashboard-showcase',
  'blocks.booking-meeting',
  'blocks.brand-proof-grid',
] as const satisfies readonly CmsBlockUid[];

export const CMS_BLOCK_UID_SET: ReadonlySet<CmsBlockUid> = new Set(CMS_BLOCK_UIDS);
