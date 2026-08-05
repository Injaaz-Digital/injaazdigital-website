export const CMS_LOCALES = ['en', 'ar'] as const;
export type CmsLocale = (typeof CMS_LOCALES)[number];

export interface CmsEntity {
  id?: number | string;
  documentId?: string;
}

export interface CmsLink extends CmsEntity {
  label: string;
  url: string;
  style?: 'primary' | 'secondary' | 'link' | string;
  isExternal?: boolean;
  trackingId?: string;
}

export interface CmsMedia extends CmsEntity {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  mime?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface CmsSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  noFollow?: boolean;
  openGraphTitle?: string | null;
  openGraphDescription?: string | null;
  shareImage?: unknown;
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string | null;
  structuredDataOverride?: Record<string, unknown> | null;
}

export interface CmsBlockBase<TUid extends string> extends CmsEntity {
  __component: TUid;
  anchorId?: string | null;
  internalName?: string | null;
  theme?: 'light' | 'dark' | 'accent' | 'editorial' | 'default' | 'muted' | 'contrast';
  spacingTop?: 'compact' | 'normal' | 'spacious';
  spacingBottom?: 'compact' | 'normal' | 'spacious';
  visibility?: 'all' | 'desktop' | 'mobile' | 'hidden';
  trackingId?: string | null;
  version?: number;
  [key: string]: unknown;
}

export type HeroBlock = CmsBlockBase<'blocks.hero'>;
export type HeroMinimalBlock = CmsBlockBase<'blocks.hero-minimal'>;
export type PageHeroBlock = CmsBlockBase<'blocks.page-hero'>;
export type AnimatedTextBlock = CmsBlockBase<'blocks.animated-text'>;
export type ProblemBlock = CmsBlockBase<'blocks.problem'>;
export type ServiceOverviewBlock = CmsBlockBase<'blocks.service-overview'>;
export type FeatureListBlock = CmsBlockBase<'blocks.feature-list'>;
export type FaqBlock = CmsBlockBase<'blocks.faq'>;
export type ProcessBlock = CmsBlockBase<'blocks.process'>;
export type FinalCtaBlock = CmsBlockBase<'blocks.final-cta'>;
export type BookCallBlock = CmsBlockBase<'blocks.book-call'>;
export type SystemFlowBlock = CmsBlockBase<'blocks.system-flow'>;
export type DiagnosisBlock = CmsBlockBase<'blocks.diagnosis'>;
export type TimelineBlock = CmsBlockBase<'blocks.timeline'>;
export type StatementPairBlock = CmsBlockBase<'blocks.statement-pair'>;
export type PrinciplesBlock = CmsBlockBase<'blocks.principles'>;
export type DashboardShowcaseBlock = CmsBlockBase<'blocks.dashboard-showcase'>;
export type BookingMeetingBlock = CmsBlockBase<'blocks.booking-meeting'>;
export type BrandProofGridBlock = CmsBlockBase<'blocks.brand-proof-grid'>;

export type CmsBlock =
  | HeroBlock | HeroMinimalBlock | PageHeroBlock | AnimatedTextBlock | ProblemBlock
  | ServiceOverviewBlock | FeatureListBlock | FaqBlock | ProcessBlock | FinalCtaBlock
  | BookCallBlock | SystemFlowBlock | DiagnosisBlock | TimelineBlock | StatementPairBlock
  | PrinciplesBlock | DashboardShowcaseBlock | BookingMeetingBlock | BrandProofGridBlock;

export type CmsBlockUid = CmsBlock['__component'];

export interface CmsPage extends CmsEntity {
  title?: string;
  description?: string;
  slug?: string;
  locale: CmsLocale;
  blocks: CmsBlock[];
  seo?: CmsSeo | null;
}
