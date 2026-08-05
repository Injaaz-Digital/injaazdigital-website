import type { ReactNode } from 'react';
import BrandProofGridBlock from './BrandProofGridBlock';
import AnimatedTextBlock from './AnimatedTextBlock';
import BookCallBlock from './BookCallBlock';
import BookingMeetingBlock from './BookingMeetingBlock';
import DashboardShowcaseBlock from './DashboardShowcaseBlock';
import DiagnosisBlock from './DiagnosisBlock';
import FeatureListBlock from './FeatureListBlock';
import FaqBlock from './FaqBlock';
import FinalCtaBlock from './FinalCtaBlock';
import HeroBlock from './Hero';
import PageHeroBlock from './PageHeroBlock';
import PrinciplesBlock from './PrinciplesBlock';
import ProblemBlock from './ProblemBlock';
import ProcessBlock from './ProcessBlock';
import ServiceOverviewBlock from './ServiceOverviewBlock';
import StatementPairBlock from './StatementPairBlock';
import SystemFlowBlock from './SystemFlowBlock';
import TimelineBlock from './TimelineBlock';
import type { CmsBlock, CmsBlockUid, CmsLocale } from '../domain/cms.types';

export type CmsBlockRenderContext = { block: CmsBlock; index: number; locale: CmsLocale; route?: string };
export type CmsBlockRenderer = (context: CmsBlockRenderContext) => ReactNode;

export const CMS_BLOCK_REGISTRY = {
  'blocks.system-flow': ({ block }) => <SystemFlowBlock block={block} />,
  'blocks.diagnosis': ({ block, locale }) => <DiagnosisBlock block={block} locale={locale} />,
  'blocks.timeline': ({ block }) => <TimelineBlock block={block} />,
  'blocks.statement-pair': ({ block }) => <StatementPairBlock block={block} />,
  'blocks.principles': ({ block, locale }) => <PrinciplesBlock block={block} locale={locale} />,
  'blocks.animated-text': ({ block, locale }) => <AnimatedTextBlock block={block} locale={locale} />,
  'blocks.page-hero': ({ block }) => <PageHeroBlock block={block} onNavigate={undefined} />,
  'blocks.problem': ({ block }) => <ProblemBlock block={block} />,
  'blocks.service-overview': ({ block, locale }) => <ServiceOverviewBlock block={block} locale={locale} />,
  'blocks.feature-list': ({ block }) => <FeatureListBlock block={block} />,
  'blocks.faq': ({ block, locale }) => <FaqBlock block={block} locale={locale} />,
  'blocks.process': ({ block, locale }) => <ProcessBlock block={block} locale={locale} />,
  'blocks.final-cta': ({ block }) => <FinalCtaBlock block={block} onNavigate={undefined} />,
  'blocks.book-call': ({ block, locale, route }) => <BookCallBlock block={block} locale={locale} route={route} />,
  'blocks.hero': ({ block, locale }) => <HeroBlock block={block} locale={locale} />,
  'blocks.hero-minimal': ({ block, locale }) => <HeroBlock block={block} locale={locale} />,
  'blocks.dashboard-showcase': ({ block, locale }) => <DashboardShowcaseBlock block={block} locale={locale} onNavigate={undefined} />,
  'blocks.booking-meeting': ({ block, locale }) => <BookingMeetingBlock block={block} locale={locale} />,
  'blocks.brand-proof-grid': ({ block, locale }) => <BrandProofGridBlock block={block} locale={locale} onNavigate={undefined} />,
} satisfies Record<CmsBlockUid, CmsBlockRenderer>;
