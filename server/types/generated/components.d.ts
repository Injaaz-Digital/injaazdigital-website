import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAnimatedText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_animated_texts';
  info: {
    description: 'A focused statement revealed progressively as the visitor scrolls';
    displayName: 'Animated Text';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'left'>;
    animationStyle: Schema.Attribute.Enumeration<
      ['word-reveal', 'line-reveal', 'progressive-opacity']
    > &
      Schema.Attribute.DefaultTo<'progressive-opacity'>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    highlightedText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    size: Schema.Attribute.Enumeration<['medium', 'large', 'display']> &
      Schema.Attribute.DefaultTo<'large'>;
    sticky: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    theme: Schema.Attribute.Enumeration<['default', 'muted', 'contrast']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface BlocksBookCall extends Struct.ComponentSchema {
  collectionName: 'components_blocks_book_calls';
  info: {
    description: 'Booking funnel copy and question-flow assignment. Questions and versions are managed in the Booking workspace.';
    displayName: 'Book Call';
  };
  attributes: {
    bookingTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Choose a time'>;
    contactStepHelp: Schema.Attribute.Text;
    contactStepTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Your contact details'>;
    fallbackDescription: Schema.Attribute.Text;
    fallbackTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'We need more context before booking'>;
    introEyebrow: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Injaaz Digital'>;
    pageTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Book a Strategy Call'>;
    qualificationIntroTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Fit questions'>;
    questionFlowKey: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 80;
      }>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    successTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Your strategy call is booked'>;
  };
}

export interface BlocksBookingMeeting extends Struct.ComponentSchema {
  collectionName: 'components_blocks_booking_meetings';
  info: {
    description: 'Meeting invitation with benefits and booking link';
    displayName: 'Booking Meeting';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    bookingLink: Schema.Attribute.Component<'shared.link', false>;
    cardDescription: Schema.Attribute.Text;
    cardHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    cardTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksBrandProofGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_brand_proof_grids';
  info: {
    description: 'Media-rich proof mosaic for strategy, team, performance and case studies';
    displayName: 'Brand Proof Grid';
  };
  attributes: {
    caseStudyPanel: Schema.Attribute.Component<
      'shared.brand-proof-case-study',
      false
    >;
    consultationPanel: Schema.Attribute.Component<
      'shared.brand-proof-consultation',
      false
    >;
    industriesPanel: Schema.Attribute.Component<
      'shared.brand-proof-industries',
      false
    >;
    performancePanel: Schema.Attribute.Component<
      'shared.brand-proof-performance',
      false
    >;
    satisfactionPanel: Schema.Attribute.Component<
      'shared.brand-proof-satisfaction',
      false
    >;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    strategyPanel: Schema.Attribute.Component<
      'shared.brand-proof-strategy-card',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    testimonialPanel: Schema.Attribute.Component<
      'shared.brand-proof-testimonial',
      false
    >;
  };
}

export interface BlocksDashboardShowcase extends Struct.ComponentSchema {
  collectionName: 'components_blocks_dashboard_showcases';
  info: {
    description: 'Analytics dashboard preview with metrics and insights';
    displayName: 'Dashboard Showcase';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    chartDelta: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
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
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    stats: Schema.Attribute.Component<'shared.metric', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
  };
}

export interface BlocksDiagnosis extends Struct.ComponentSchema {
  collectionName: 'components_blocks_diagnoses';
  info: {
    description: 'Visible symptoms contrasted with deeper system causes';
    displayName: 'Diagnosis';
  };
  attributes: {
    closingStatement: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    items: Schema.Attribute.Component<'shared.diagnosis-example', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faqs';
  info: {
    description: 'Frequently asked questions';
    displayName: 'FAQ';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    items: Schema.Attribute.Component<'shared.faq-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksFeatureList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feature_lists';
  info: {
    description: 'Dense feature grid';
    displayName: 'Feature List';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    items: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksFinalCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_final_ctas';
  info: {
    description: 'Final conversion section';
    displayName: 'Final CTA';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
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
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
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
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    subheadline: Schema.Attribute.Text;
  };
}

export interface BlocksPageHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_page_heroes';
  info: {
    description: 'Premium landing page hero';
    displayName: 'Hero';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    imageKeyword: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'premium-digital-studio'>;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    variant: Schema.Attribute.Enumeration<['visual', 'editorial']> &
      Schema.Attribute.DefaultTo<'visual'>;
  };
}

export interface BlocksPrinciples extends Struct.ComponentSchema {
  collectionName: 'components_blocks_principles';
  info: {
    description: 'Editorial principles with an optional direction statement';
    displayName: 'Principles';
  };
  attributes: {
    closingStatement: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    directionBody: Schema.Attribute.Text;
    directionHeading: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    items: Schema.Attribute.Component<'shared.principle-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksProblem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_problems';
  info: {
    description: 'Problem framing section';
    displayName: 'Problem';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    items: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksProcess extends Struct.ComponentSchema {
  collectionName: 'components_blocks_processes';
  info: {
    description: 'Step-by-step delivery process';
    displayName: 'Process';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    steps: Schema.Attribute.Component<'shared.process-step', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    variant: Schema.Attribute.Enumeration<['interactive', 'editorial']> &
      Schema.Attribute.DefaultTo<'interactive'>;
  };
}

export interface BlocksServiceOverview extends Struct.ComponentSchema {
  collectionName: 'components_blocks_service_overviews';
  info: {
    description: 'Select Offer entries to render as service cards';
    displayName: 'Service Overview';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    placement: Schema.Attribute.Enumeration<['homepage', 'related']> &
      Schema.Attribute.DefaultTo<'homepage'>;
    services: Schema.Attribute.Relation<'manyToMany', 'api::offer.offer'>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksStatementPair extends Struct.ComponentSchema {
  collectionName: 'components_blocks_statement_pairs';
  info: {
    description: 'Two spacious institutional statements such as mission and vision';
    displayName: 'Statement Pair';
  };
  attributes: {
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    first: Schema.Attribute.Component<'shared.statement', false> &
      Schema.Attribute.Required;
    second: Schema.Attribute.Component<'shared.statement', false> &
      Schema.Attribute.Required;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
  };
}

export interface BlocksSystemFlow extends Struct.ComponentSchema {
  collectionName: 'components_blocks_system_flows';
  info: {
    description: 'A clear responsive sequence with contextual signals';
    displayName: 'System Flow';
  };
  attributes: {
    closingStatement: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    signals: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
        },
        number
      >;
    steps: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 9;
          min: 2;
        },
        number
      >;
    variant: Schema.Attribute.Enumeration<['system', 'measurement']> &
      Schema.Attribute.DefaultTo<'system'>;
  };
}

export interface BlocksTimeline extends Struct.ComponentSchema {
  collectionName: 'components_blocks_timelines';
  info: {
    description: 'An undated conceptual or institutional timeline';
    displayName: 'Timeline';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    settings: Schema.Attribute.Component<'shared.block-settings', false>;
    stages: Schema.Attribute.Component<'shared.process-step', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
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
    serviceLinks: Schema.Attribute.Component<'shared.link', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
        },
        number
      >;
    servicesLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }> &
      Schema.Attribute.DefaultTo<'Services'>;
    showLanguageSwitcher: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedArticleCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_article_ctas';
  info: {
    description: 'Localized, trackable conversion call to action for editorial content';
    displayName: 'Article CTA';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    style: Schema.Attribute.Enumeration<['primary', 'secondary', 'tertiary']> &
      Schema.Attribute.DefaultTo<'primary'>;
    trackingId: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2048;
      }>;
  };
}

export interface SharedBlockSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_block_settings';
  info: {
    description: 'Controlled presentation, visibility and analytics settings shared by CMS blocks';
    displayName: 'Block Settings';
  };
  attributes: {
    anchorId: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    backgroundMedia: Schema.Attribute.Media<'images' | 'videos'>;
    internalName: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    spacingBottom: Schema.Attribute.Enumeration<
      ['compact', 'normal', 'spacious']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    spacingTop: Schema.Attribute.Enumeration<
      ['compact', 'normal', 'spacious']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
    theme: Schema.Attribute.Enumeration<
      ['light', 'dark', 'accent', 'editorial']
    > &
      Schema.Attribute.DefaultTo<'light'>;
    trackingId: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    version: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    visibility: Schema.Attribute.Enumeration<
      ['all', 'desktop', 'mobile', 'hidden']
    > &
      Schema.Attribute.DefaultTo<'all'>;
  };
}

export interface SharedBrandProofCaseStudy extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_case_studies';
  info: {
    displayName: 'Brand Proof Case Study';
  };
  attributes: {
    coverMedia: Schema.Attribute.Media<'images'>;
    cta: Schema.Attribute.Component<'shared.link', false>;
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    resultLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface SharedBrandProofConsultation extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_consultations';
  info: {
    displayName: 'Brand Proof Consultation';
  };
  attributes: {
    backgroundMedia: Schema.Attribute.Media<'images'>;
    cta: Schema.Attribute.Component<'shared.link', false>;
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    supportingNote: Schema.Attribute.Text;
    teamMembers: Schema.Attribute.Component<
      'shared.brand-proof-team-member',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
  };
}

export interface SharedBrandProofIndustries extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_industry_panels';
  info: {
    displayName: 'Brand Proof Industries';
  };
  attributes: {
    headline: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    items: Schema.Attribute.Component<'shared.brand-proof-industry', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
        },
        number
      >;
  };
}

export interface SharedBrandProofIndustry extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_industries';
  info: {
    displayName: 'Brand Proof Industry';
  };
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedBrandProofPerformance extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_performances';
  info: {
    displayName: 'Brand Proof Performance';
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

export interface SharedBrandProofSatisfaction extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_satisfactions';
  info: {
    displayName: 'Brand Proof Satisfaction';
  };
  attributes: {
    description: Schema.Attribute.Text;
    ratingLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    reactionIcons: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SharedBrandProofStrategyCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_strategy_cards';
  info: {
    displayName: 'Brand Proof Strategy Card';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    coverMedia: Schema.Attribute.Media<'images'>;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    icon: Schema.Attribute.Media<'images'>;
    summary: Schema.Attribute.Text;
  };
}

export interface SharedBrandProofTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_team_members';
  info: {
    displayName: 'Brand Proof Team Member';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    fullName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    role: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedBrandProofTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_shared_brand_proof_testimonials';
  info: {
    displayName: 'Brand Proof Testimonial';
  };
  attributes: {
    clientName: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    clientRole: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    poster: Schema.Attribute.Media<'images'>;
    quote: Schema.Attribute.Text;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: 'Reusable call-to-action link';
    displayName: 'CTA';
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

export interface SharedDiagnosisExample extends Struct.ComponentSchema {
  collectionName: 'components_shared_diagnosis_examples';
  info: {
    displayName: 'Diagnosis Example';
  };
  attributes: {
    deeperSystem: Schema.Attribute.Text & Schema.Attribute.Required;
    visibleProblem: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
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
    capabilities: Schema.Attribute.Text;
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    description: Schema.Attribute.Text;
    displayOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    featuredOnHomepage: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    icon: Schema.Attribute.String;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    outcome: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
    url: Schema.Attribute.String;
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

export interface SharedPrincipleItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_principle_items';
  info: {
    description: 'Image-led principle feature card';
    displayName: 'Principle Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 140;
      }>;
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
    visual: Schema.Attribute.Media<'images'>;
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

export interface SharedStatement extends Struct.ComponentSchema {
  collectionName: 'components_shared_statements';
  info: {
    displayName: 'Statement';
  };
  attributes: {
    explanation: Schema.Attribute.Text;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    statement: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.animated-text': BlocksAnimatedText;
      'blocks.book-call': BlocksBookCall;
      'blocks.booking-meeting': BlocksBookingMeeting;
      'blocks.brand-proof-grid': BlocksBrandProofGrid;
      'blocks.dashboard-showcase': BlocksDashboardShowcase;
      'blocks.diagnosis': BlocksDiagnosis;
      'blocks.faq': BlocksFaq;
      'blocks.feature-list': BlocksFeatureList;
      'blocks.final-cta': BlocksFinalCta;
      'blocks.hero': BlocksHero;
      'blocks.hero-minimal': BlocksHeroMinimal;
      'blocks.page-hero': BlocksPageHero;
      'blocks.principles': BlocksPrinciples;
      'blocks.problem': BlocksProblem;
      'blocks.process': BlocksProcess;
      'blocks.service-overview': BlocksServiceOverview;
      'blocks.statement-pair': BlocksStatementPair;
      'blocks.system-flow': BlocksSystemFlow;
      'blocks.timeline': BlocksTimeline;
      'layout.footer': LayoutFooter;
      'layout.footer-column': LayoutFooterColumn;
      'layout.header': LayoutHeader;
      'shared.article-cta': SharedArticleCta;
      'shared.block-settings': SharedBlockSettings;
      'shared.brand-proof-case-study': SharedBrandProofCaseStudy;
      'shared.brand-proof-consultation': SharedBrandProofConsultation;
      'shared.brand-proof-industries': SharedBrandProofIndustries;
      'shared.brand-proof-industry': SharedBrandProofIndustry;
      'shared.brand-proof-performance': SharedBrandProofPerformance;
      'shared.brand-proof-satisfaction': SharedBrandProofSatisfaction;
      'shared.brand-proof-strategy-card': SharedBrandProofStrategyCard;
      'shared.brand-proof-team-member': SharedBrandProofTeamMember;
      'shared.brand-proof-testimonial': SharedBrandProofTestimonial;
      'shared.cta': SharedCta;
      'shared.diagnosis-example': SharedDiagnosisExample;
      'shared.faq-item': SharedFaqItem;
      'shared.link': SharedLink;
      'shared.list-item': SharedListItem;
      'shared.media': SharedMedia;
      'shared.metric': SharedMetric;
      'shared.principle-item': SharedPrincipleItem;
      'shared.process-step': SharedProcessStep;
      'shared.seo': SharedSeo;
      'shared.statement': SharedStatement;
    }
  }
}
