import { CmsHero } from '@/features/home/components/Hero';
import BrandProofGridBlock from '@/features/cms/blocks/BrandProofGridBlock';
import AnimatedTextBlock from '@/features/cms/blocks/AnimatedTextBlock';
import BookCallBlock from '@/features/cms/blocks/BookCallBlock';
import BookingMeetingBlock from '@/features/cms/blocks/BookingMeetingBlock';
import CtaBannerBlock from '@/features/cms/blocks/CtaBannerBlock';
import DashboardShowcaseBlock from '@/features/cms/blocks/DashboardShowcaseBlock';
import FaqBlock from '@/features/cms/blocks/FaqBlock';
import FeatureMosaicBlock from '@/features/cms/blocks/FeatureMosaicBlock';
import PackagesBlock from '@/features/cms/blocks/PackagesBlock';
import PersonaGridBlock from '@/features/cms/blocks/PersonaGridBlock';
import ProblemBlock from '@/features/cms/blocks/ProblemBlock';
import ProcessBlock from '@/features/cms/blocks/ProcessBlock';
import ProofBlock from '@/features/cms/blocks/ProofBlock';
import RichTextBlock from '@/features/cms/blocks/RichTextBlock';
import TrustRowBlock from '@/features/cms/blocks/TrustRowBlock';
import {
  FaqSection,
  FeatureListSection,
  FinalCtaSection,
  OutcomesSection,
  ProblemSection as PremiumProblemSection,
  ProcessSection,
  SectionHero,
  ServiceOverviewSection,
} from '@/features/cms/sections/PremiumSections';
import {
  DiagnosisSection,
  EditorialContentSection,
  PrinciplesSection,
  StatementPairSection,
  SystemFlowSection,
  TimelineSection,
} from '@/features/cms/sections/EditorialSections';

export const CMS_BLOCK_REGISTRY = {
  'section.editorial-content': ({ block, index }) => <EditorialContentSection key={`section.editorial-content-${index}`} block={block} />,
  'section.system-flow': ({ block, index }) => <SystemFlowSection key={`section.system-flow-${index}`} block={block} />,
  'section.diagnosis': ({ block, index, locale }) => <DiagnosisSection key={`section.diagnosis-${index}`} block={block} locale={locale} />,
  'section.timeline': ({ block, index }) => <TimelineSection key={`section.timeline-${index}`} block={block} />,
  'section.statement-pair': ({ block, index }) => <StatementPairSection key={`section.statement-pair-${index}`} block={block} />,
  'section.principles': ({ block, index, locale }) => <PrinciplesSection key={`section.principles-${index}`} block={block} locale={locale} />,
  'section.animated-text': ({ block, index, locale }) => (
    <AnimatedTextBlock key={`section.animated-text-${index}`} block={block} locale={locale} />
  ),
  'section.hero': ({ block, index, onNavigate }) => (
    <SectionHero key={`section.hero-${index}`} block={block} onNavigate={onNavigate} />
  ),
  'section.problem': ({ block, index }) => <PremiumProblemSection key={`section.problem-${index}`} block={block} />,
  'section.service-overview': ({ block, index, locale, onNavigate }) => (
    <ServiceOverviewSection key={`section.service-overview-${index}`} block={block} locale={locale} onNavigate={onNavigate} />
  ),
  'section.feature-list': ({ block, index }) => <FeatureListSection key={`section.feature-list-${index}`} block={block} />,
  'section.process': ({ block, index, locale }) => <ProcessSection key={`section.process-${index}`} block={block} locale={locale} />,
  'section.outcomes': ({ block, index }) => <OutcomesSection key={`section.outcomes-${index}`} block={block} />,
  'section.faq': ({ block, index }) => <FaqSection key={`section.faq-${index}`} block={block} />,
  'section.final-cta': ({ block, index, onNavigate }) => (
    <FinalCtaSection key={`section.final-cta-${index}`} block={block} onNavigate={onNavigate} />
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
