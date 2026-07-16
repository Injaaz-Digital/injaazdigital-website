import { CmsHero } from '@/features/home/components/Hero';
import BrandProofGridBlock from '@/features/cms/blocks/BrandProofGridBlock';
import AnimatedTextBlock from '@/features/cms/blocks/AnimatedTextBlock';
import BookCallBlock from '@/features/cms/blocks/BookCallBlock';
import BookingMeetingBlock from '@/features/cms/blocks/BookingMeetingBlock';
import CtaBannerBlock from '@/features/cms/blocks/CtaBannerBlock';
import DashboardShowcaseBlock from '@/features/cms/blocks/DashboardShowcaseBlock';
import DiagnosisBlock from '@/features/cms/blocks/DiagnosisBlock';
import EditorialContentBlock from '@/features/cms/blocks/EditorialContentBlock';
import FaqBlock from '@/features/cms/blocks/FaqBlock';
import FeatureListBlock from '@/features/cms/blocks/FeatureListBlock';
import FeatureMosaicBlock from '@/features/cms/blocks/FeatureMosaicBlock';
import FinalCtaBlock from '@/features/cms/blocks/FinalCtaBlock';
import OutcomesBlock from '@/features/cms/blocks/OutcomesBlock';
import PackagesBlock from '@/features/cms/blocks/PackagesBlock';
import PersonaGridBlock from '@/features/cms/blocks/PersonaGridBlock';
import PrinciplesBlock from '@/features/cms/blocks/PrinciplesBlock';
import ProblemBlock from '@/features/cms/blocks/ProblemBlock';
import ProcessBlock from '@/features/cms/blocks/ProcessBlock';
import ProofBlock from '@/features/cms/blocks/ProofBlock';
import RichTextBlock from '@/features/cms/blocks/RichTextBlock';
import SectionFaqBlock from '@/features/cms/blocks/SectionFaqBlock';
import SectionHeroBlock from '@/features/cms/blocks/SectionHeroBlock';
import SectionProblemBlock from '@/features/cms/blocks/SectionProblemBlock';
import SectionProcessBlock from '@/features/cms/blocks/SectionProcessBlock';
import ServiceOverviewBlock from '@/features/cms/blocks/ServiceOverviewBlock';
import StatementPairBlock from '@/features/cms/blocks/StatementPairBlock';
import SystemFlowBlock from '@/features/cms/blocks/SystemFlowBlock';
import TimelineBlock from '@/features/cms/blocks/TimelineBlock';
import TrustRowBlock from '@/features/cms/blocks/TrustRowBlock';

export const CMS_BLOCK_REGISTRY = {
  'section.editorial-content': ({ block, index }) => <EditorialContentBlock key={`section.editorial-content-${index}`} block={block} />,
  'section.system-flow': ({ block, index }) => <SystemFlowBlock key={`section.system-flow-${index}`} block={block} />,
  'section.diagnosis': ({ block, index, locale }) => <DiagnosisBlock key={`section.diagnosis-${index}`} block={block} locale={locale} />,
  'section.timeline': ({ block, index }) => <TimelineBlock key={`section.timeline-${index}`} block={block} />,
  'section.statement-pair': ({ block, index }) => <StatementPairBlock key={`section.statement-pair-${index}`} block={block} />,
  'section.principles': ({ block, index, locale }) => <PrinciplesBlock key={`section.principles-${index}`} block={block} locale={locale} />,
  'section.animated-text': ({ block, index, locale }) => (
    <AnimatedTextBlock key={`section.animated-text-${index}`} block={block} locale={locale} />
  ),
  'section.hero': ({ block, index, onNavigate }) => (
    <SectionHeroBlock key={`section.hero-${index}`} block={block} onNavigate={onNavigate} />
  ),
  'section.problem': ({ block, index }) => <SectionProblemBlock key={`section.problem-${index}`} block={block} />,
  'section.service-overview': ({ block, index, locale, onNavigate }) => (
    <ServiceOverviewBlock key={`section.service-overview-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'section.feature-list': ({ block, index }) => <FeatureListBlock key={`section.feature-list-${index}`} block={block} />,
  'section.process': ({ block, index, locale }) => <SectionProcessBlock key={`section.process-${index}`} block={block} locale={locale} />,
  'section.outcomes': ({ block, index }) => <OutcomesBlock key={`section.outcomes-${index}`} block={block} />,
  'section.faq': ({ block, index }) => <SectionFaqBlock key={`section.faq-${index}`} block={block} />,
  'section.final-cta': ({ block, index, onNavigate }) => (
    <FinalCtaBlock key={`section.final-cta-${index}`} block={block} onNavigate={onNavigate} />
  ),
  'section.book-call': ({ block, index, locale, route }) => (
    <BookCallBlock key={`section.book-call-${index}`} block={block} locale={locale} route={route} />
  ),
  'blocks.hero': ({ block, index, locale, route, onNavigate }) => (
    <CmsHero key={`blocks.hero-${index}`} block={block} locale={locale} route={route} onNavigate={onNavigate} />
  ),
  'blocks.hero-minimal': ({ block, index, locale, route, onNavigate }) => (
    <CmsHero key={`blocks.hero-minimal-${index}`} block={block} locale={locale} route={route} onNavigate={onNavigate} />
  ),
  'blocks.dashboard-showcase': ({ block, index, locale, onNavigate }) => (
    <DashboardShowcaseBlock key={`blocks.dashboard-showcase-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.feature-mosaic': ({ block, index, locale }) => (
    <FeatureMosaicBlock key={`blocks.feature-mosaic-${index}`} block={block} locale={locale} />
  ),
  'blocks.trust-row': ({ block, index }) => <TrustRowBlock key={`blocks.trust-row-${index}`} block={block} />,
  'blocks.persona-grid': ({ block, index, locale, onNavigate }) => (
    <PersonaGridBlock key={`blocks.persona-grid-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.problem': ({ block, index, locale }) => <ProblemBlock key={`blocks.problem-${index}`} block={block} locale={locale} />,
  'blocks.solution-system': ({ block, index, locale, onNavigate }) => (
    <ProcessBlock key={`blocks.solution-system-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.process-timeline': ({ block, index, locale, onNavigate }) => (
    <ProcessBlock key={`blocks.process-timeline-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.proof': ({ block, index, locale }) => <ProofBlock key={`blocks.proof-${index}`} block={block} locale={locale} />,
  'blocks.packages': ({ block, index, locale, onNavigate }) => (
    <PackagesBlock key={`blocks.packages-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.faq': ({ block, index, locale }) => <FaqBlock key={`blocks.faq-${index}`} block={block} locale={locale} />,
  'blocks.cta-banner': ({ block, index, locale, onNavigate }) => (
    <CtaBannerBlock key={`blocks.cta-banner-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.booking-meeting': ({ block, index, locale, onNavigate }) => (
    <BookingMeetingBlock key={`blocks.booking-meeting-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.brand-proof-grid': ({ block, index, locale, onNavigate }) => (
    <BrandProofGridBlock key={`blocks.brand-proof-grid-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'blocks.rich-text': ({ block, index, locale, onNavigate }) => (
    <RichTextBlock key={`blocks.rich-text-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
};
