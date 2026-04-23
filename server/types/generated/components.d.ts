import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAboutMosaic extends Struct.ComponentSchema {
  collectionName: 'components_blocks_about_mosaics';
  info: {
    description: 'About-style editorial mosaic with proof, industries, and testimonial';
    displayName: 'About Mosaic';
  };
  attributes: {
    caseStudyImage: Schema.Attribute.Component<'shared.media', false>;
    caseStudyLink: Schema.Attribute.Component<'shared.link', false>;
    caseStudyResult: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    caseStudyTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    csatDescription: Schema.Attribute.Text;
    csatEmojis: Schema.Attribute.Component<'shared.media', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    csatRatingLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    csatTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    discussBackground: Schema.Attribute.Component<'shared.media', false>;
    discussCta: Schema.Attribute.Component<'shared.link', false>;
    discussNote: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    discussTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    industries: Schema.Attribute.Component<'shared.list-item', true>;
    industriesTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    performanceDescription: Schema.Attribute.Text;
    performanceTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    seoMetrics: Schema.Attribute.Component<'shared.metric', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    strategyBadge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    strategyDescription: Schema.Attribute.Text;
    strategyImage: Schema.Attribute.Component<'shared.media', false>;
    strategySlides: Schema.Attribute.Component<
      'shared.feature-mosaic-card',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    strategyTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    teamMembers: Schema.Attribute.Component<
      'shared.about-mosaic-member',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    testimonialName: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    testimonialPoster: Schema.Attribute.Component<'shared.media', false>;
    testimonialRole: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    testimonialVideo: Schema.Attribute.Component<'shared.media', false>;
  };
}

export interface BlocksBookingMeeting extends Struct.ComponentSchema {
  collectionName: 'components_blocks_booking_meetings';
  info: {
    description: 'Booking section for Google Meet or calendar scheduling';
    displayName: 'Booking Meeting';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    bookingLink: Schema.Attribute.Component<'shared.link', false> &
      Schema.Attribute.Required;
    cardDescription: Schema.Attribute.Text;
    cardHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    cardTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface BlocksBrandProofGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_brand_proof_grids';
  info: {
    description: 'Structured proof and storytelling grid for brand-led pages';
    displayName: 'Brand Proof Grid';
  };
  attributes: {
    caseStudyPanel: Schema.Attribute.Component<
      'shared.brand-proof-case-study-panel',
      false
    >;
    consultationPanel: Schema.Attribute.Component<
      'shared.brand-proof-consultation-panel',
      false
    >;
    industriesPanel: Schema.Attribute.Component<
      'shared.brand-proof-industries-panel',
      false
    >;
    performancePanel: Schema.Attribute.Component<
      'shared.brand-proof-performance-panel',
      false
    >;
    satisfactionPanel: Schema.Attribute.Component<
      'shared.brand-proof-satisfaction-panel',
      false
    >;
    strategyPanel: Schema.Attribute.Component<
      'shared.brand-proof-strategy-panel',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    testimonialPanel: Schema.Attribute.Component<
      'shared.brand-proof-testimonial-panel',
      false
    >;
  };
}

export interface BlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_banners';
  info: {
    description: 'Final CTA block';
    displayName: 'CTA Banner';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
    secondaryCta: Schema.Attribute.Component<'shared.link', false>;
  };
}

export interface BlocksDashboardShowcase extends Struct.ComponentSchema {
  collectionName: 'components_blocks_dashboard_showcases';
  info: {
    description: 'Editorial dashboard or analytics showcase section';
    displayName: 'Dashboard Showcase';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    chartDelta: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    chartLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    chartValue: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    insights: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
    secondaryCta: Schema.Attribute.Component<'shared.link', false>;
    stats: Schema.Attribute.Component<'shared.metric', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faq_sections';
  info: {
    description: 'FAQ accordion section';
    displayName: 'FAQ';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.faq-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksFeatureMosaic extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feature_mosaics';
  info: {
    description: 'Asymmetrical editorial feature grid from Figma';
    displayName: 'Feature Mosaic';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.feature-mosaic-card', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    subheading: Schema.Attribute.Text;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    description: 'Primary hero section';
    displayName: 'Hero';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'left'>;
    eyebrow: Schema.Attribute.String;
    kpis: Schema.Attribute.Component<'shared.metric', true>;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
    secondaryCta: Schema.Attribute.Component<'shared.link', false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    visual: Schema.Attribute.Component<'shared.media', false>;
  };
}

export interface BlocksHeroMinimal extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_minimals';
  info: {
    description: 'Minimal hero with concise messaging and CTA';
    displayName: 'Hero Minimal';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'center'>;
    availability: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    badge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    gallery: Schema.Attribute.Component<'shared.media', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    highlights: Schema.Attribute.Component<'shared.metric', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
    secondaryCta: Schema.Attribute.Component<'shared.link', false>;
    subheadline: Schema.Attribute.Text;
  };
}

export interface BlocksPackages extends Struct.ComponentSchema {
  collectionName: 'components_blocks_package_sections';
  info: {
    description: 'Package and pricing section';
    displayName: 'Packages';
  };
  attributes: {
    heading: Schema.Attribute.String;
    packages: Schema.Attribute.Component<'shared.package-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksPersonaGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_persona_grids';
  info: {
    description: 'Audience persona section';
    displayName: 'Persona Grid';
  };
  attributes: {
    heading: Schema.Attribute.String;
    personas: Schema.Attribute.Component<'shared.persona-card', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksProblem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_problems';
  info: {
    description: 'Pain and bottleneck section';
    displayName: 'Problem';
  };
  attributes: {
    bullets: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    insight: Schema.Attribute.String;
  };
}

export interface BlocksProcessTimeline extends Struct.ComponentSchema {
  collectionName: 'components_blocks_process_timelines';
  info: {
    description: 'Step-by-step process';
    displayName: 'Process Timeline';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
    steps: Schema.Attribute.Component<'shared.process-step', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksProof extends Struct.ComponentSchema {
  collectionName: 'components_blocks_proof_sections';
  info: {
    description: 'Process proof section';
    displayName: 'Proof';
  };
  attributes: {
    afterLabel: Schema.Attribute.String;
    artifact: Schema.Attribute.Component<'shared.media', false>;
    beforeLabel: Schema.Attribute.String;
    evidenceText: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    trackedMetrics: Schema.Attribute.Component<'shared.metric', true>;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_text_sections';
  info: {
    description: 'Generic rich text content block';
    displayName: 'Rich Text';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
  };
}

export interface BlocksSolutionSystem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_solution_systems';
  info: {
    description: 'System overview section';
    displayName: 'Solution System';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
    steps: Schema.Attribute.Component<'shared.process-step', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksTrustRow extends Struct.ComponentSchema {
  collectionName: 'components_blocks_trust_rows';
  info: {
    description: 'Trust cue row';
    displayName: 'Trust Row';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 2;
        },
        number
      >;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    description: 'Global footer layout';
    displayName: 'Footer';
  };
  attributes: {
    columns: Schema.Attribute.Component<'layout.footer-column', true>;
    contactEmail: Schema.Attribute.Email;
    copyright: Schema.Attribute.String;
    legalLinks: Schema.Attribute.Component<'shared.link', true>;
    socialLinks: Schema.Attribute.Component<'shared.link', true>;
    tagline: Schema.Attribute.String;
  };
}

export interface LayoutFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_layout_footer_columns';
  info: {
    description: 'Footer link group';
    displayName: 'Footer Column';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: 'Global header and navigation';
    displayName: 'Header';
  };
  attributes: {
    logoText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Injaaz Digital'>;
    navLinks: Schema.Attribute.Component<'shared.link', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    primaryCta: Schema.Attribute.Component<'shared.link', false>;
    showLanguageSwitcher: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedAboutMosaicMember extends Struct.ComponentSchema {
  collectionName: 'components_shared_about_mosaic_members';
  info: {
    description: 'Profile card item used in the About Mosaic block';
    displayName: 'About Mosaic Member';
  };
  attributes: {
    avatar: Schema.Attribute.Component<'shared.media', false>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedBrandProofCaseStudyPanel extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_case_study_panels';
  info: {
    description: 'Case study highlight panel content';
    displayName: 'Brand Proof Case Study Panel';
  };
  attributes: {
    coverMedia: Schema.Attribute.Component<'shared.media', false>;
    cta: Schema.Attribute.Component<'shared.link', false>;
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    resultLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedBrandProofConsultationPanel
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_consultation_panels';
  info: {
    description: 'Consultation invitation panel content';
    displayName: 'Brand Proof Consultation Panel';
  };
  attributes: {
    backgroundMedia: Schema.Attribute.Component<'shared.media', false>;
    cta: Schema.Attribute.Component<'shared.link', false>;
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    supportingNote: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    teamMembers: Schema.Attribute.Component<'shared.team-member', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
  };
}

export interface SharedBrandProofIndustriesPanel
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_industries_panels';
  info: {
    description: 'Industries panel content';
    displayName: 'Brand Proof Industries Panel';
  };
  attributes: {
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    items: Schema.Attribute.Component<'shared.industry-item', true>;
  };
}

export interface SharedBrandProofPerformancePanel
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_performance_panels';
  info: {
    description: 'Performance and metrics panel content';
    displayName: 'Brand Proof Performance Panel';
  };
  attributes: {
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    metrics: Schema.Attribute.Component<'shared.metric', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    summary: Schema.Attribute.Text;
  };
}

export interface SharedBrandProofSatisfactionPanel
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_satisfaction_panels';
  info: {
    description: 'Customer satisfaction panel content';
    displayName: 'Brand Proof Satisfaction Panel';
  };
  attributes: {
    description: Schema.Attribute.Text;
    ratingLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    reactionIcons: Schema.Attribute.Component<'shared.media', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface SharedBrandProofStrategyPanel extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_strategy_panels';
  info: {
    description: 'Strategy card used in the brand proof slider';
    displayName: 'Brand Proof Strategy Card';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    coverMedia: Schema.Attribute.Component<'shared.media', false>;
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    icon: Schema.Attribute.Component<'shared.media', false>;
    summary: Schema.Attribute.Text;
  };
}

export interface SharedBrandProofTestimonialPanel
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_testimonial_panels';
  info: {
    description: 'Video testimonial panel content';
    displayName: 'Brand Proof Testimonial Panel';
  };
  attributes: {
    clientName: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    clientRole: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    poster: Schema.Attribute.Component<'shared.media', false>;
    quote: Schema.Attribute.Text;
    video: Schema.Attribute.Component<'shared.media', false>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'Atomic FAQ item';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedFeatureMosaicCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_mosaic_cards';
  info: {
    description: 'Card item for the editorial feature mosaic block';
    displayName: 'Feature Mosaic Card';
  };
  attributes: {
    artwork: Schema.Attribute.Component<'shared.media', false>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
  };
}

export interface SharedIndustryItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_industry_items';
  info: {
    description: 'Industry label item';
    displayName: 'Industry Item';
  };
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: 'Atomic navigation and CTA link';
    displayName: 'Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    style: Schema.Attribute.Enumeration<['primary', 'secondary', 'tertiary']> &
      Schema.Attribute.DefaultTo<'primary'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedListItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_list_items';
  info: {
    description: 'Atomic bullet/list item';
    displayName: 'List Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    description: 'Atomic media wrapper';
    displayName: 'Media';
  };
  attributes: {
    alt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    asset: Schema.Attribute.Media<'images' | 'videos' | 'files'> &
      Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    isDecorative: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    kind: Schema.Attribute.Enumeration<
      ['image', 'video', 'file', 'icon', 'logo', 'background', 'decorative']
    > &
      Schema.Attribute.DefaultTo<'image'>;
  };
}

export interface SharedMetric extends Struct.ComponentSchema {
  collectionName: 'components_shared_metrics';
  info: {
    description: 'Atomic KPI item';
    displayName: 'Metric';
  };
  attributes: {
    hint: Schema.Attribute.String;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface SharedPackageItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_package_items';
  info: {
    description: 'Atomic package/pricing item';
    displayName: 'Package Item';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    outcome: Schema.Attribute.Text;
    priceLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    recommended: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    summary: Schema.Attribute.Text & Schema.Attribute.Required;
    timeline: Schema.Attribute.String;
  };
}

export interface SharedPersonaCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_persona_cards';
  info: {
    description: 'Atomic persona summary card';
    displayName: 'Persona Card';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>;
    desire: Schema.Attribute.Text & Schema.Attribute.Required;
    pain: Schema.Attribute.Text & Schema.Attribute.Required;
    persona: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    result: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_process_steps';
  info: {
    description: 'Atomic process step item';
    displayName: 'Process Step';
  };
  attributes: {
    deliverables: Schema.Attribute.Text & Schema.Attribute.Required;
    stepTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    successCriteria: Schema.Attribute.Text;
    timeframe: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    description: 'Reusable SEO metadata';
    displayName: 'SEO';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_shared_team_members';
  info: {
    description: 'Team member card item for consultation panels';
    displayName: 'Team Member';
  };
  attributes: {
    avatar: Schema.Attribute.Component<'shared.media', false>;
    fullName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    role: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.about-mosaic': BlocksAboutMosaic;
      'blocks.booking-meeting': BlocksBookingMeeting;
      'blocks.brand-proof-grid': BlocksBrandProofGrid;
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.dashboard-showcase': BlocksDashboardShowcase;
      'blocks.faq': BlocksFaq;
      'blocks.feature-mosaic': BlocksFeatureMosaic;
      'blocks.hero': BlocksHero;
      'blocks.hero-minimal': BlocksHeroMinimal;
      'blocks.packages': BlocksPackages;
      'blocks.persona-grid': BlocksPersonaGrid;
      'blocks.problem': BlocksProblem;
      'blocks.process-timeline': BlocksProcessTimeline;
      'blocks.proof': BlocksProof;
      'blocks.rich-text': BlocksRichText;
      'blocks.solution-system': BlocksSolutionSystem;
      'blocks.trust-row': BlocksTrustRow;
      'layout.footer': LayoutFooter;
      'layout.footer-column': LayoutFooterColumn;
      'layout.header': LayoutHeader;
      'shared.about-mosaic-member': SharedAboutMosaicMember;
      'shared.brand-proof-case-study-panel': SharedBrandProofCaseStudyPanel;
      'shared.brand-proof-consultation-panel': SharedBrandProofConsultationPanel;
      'shared.brand-proof-industries-panel': SharedBrandProofIndustriesPanel;
      'shared.brand-proof-performance-panel': SharedBrandProofPerformancePanel;
      'shared.brand-proof-satisfaction-panel': SharedBrandProofSatisfactionPanel;
      'shared.brand-proof-strategy-panel': SharedBrandProofStrategyPanel;
      'shared.brand-proof-testimonial-panel': SharedBrandProofTestimonialPanel;
      'shared.faq-item': SharedFaqItem;
      'shared.feature-mosaic-card': SharedFeatureMosaicCard;
      'shared.industry-item': SharedIndustryItem;
      'shared.link': SharedLink;
      'shared.list-item': SharedListItem;
      'shared.media': SharedMedia;
      'shared.metric': SharedMetric;
      'shared.package-item': SharedPackageItem;
      'shared.persona-card': SharedPersonaCard;
      'shared.process-step': SharedProcessStep;
      'shared.seo': SharedSeo;
      'shared.team-member': SharedTeamMember;
    }
  }
}
