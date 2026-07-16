import type { Schema, Struct } from '@strapi/strapi';

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

export interface SectionAnimatedText extends Struct.ComponentSchema {
  collectionName: 'components_section_animated_texts';
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
    size: Schema.Attribute.Enumeration<['medium', 'large', 'display']> &
      Schema.Attribute.DefaultTo<'large'>;
    sticky: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    theme: Schema.Attribute.Enumeration<['default', 'muted', 'contrast']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SectionBookCall extends Struct.ComponentSchema {
  collectionName: 'components_section_book_calls';
  info: {
    description: 'Editorial copy for the booking funnel. Duration, timezone, location, qualification and scheduling rules are managed in Injaaz Cal.';
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
    stepper: Schema.Attribute.Relation<'manyToOne', 'plugin::booking.stepper'> &
      Schema.Attribute.Required;
    successTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Your strategy call is booked'>;
  };
}

export interface SectionDiagnosis extends Struct.ComponentSchema {
  collectionName: 'components_section_diagnoses';
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
  };
}

export interface SectionEditorialContent extends Struct.ComponentSchema {
  collectionName: 'components_section_editorial_contents';
  info: {
    description: 'Long-form institutional copy with controlled statements';
    displayName: 'Editorial Content';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    closingStatement: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    statements: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
        },
        number
      >;
    variant: Schema.Attribute.Enumeration<['default', 'manifesto', 'vision']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SectionFaq extends Struct.ComponentSchema {
  collectionName: 'components_section_faqs';
  info: {
    description: 'Frequently asked questions';
    displayName: 'FAQ';
  };
  attributes: {
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
          min: 1;
        },
        number
      >;
  };
}

export interface SectionFeatureList extends Struct.ComponentSchema {
  collectionName: 'components_section_feature_lists';
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
  };
}

export interface SectionFinalCta extends Struct.ComponentSchema {
  collectionName: 'components_section_final_ctas';
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
  };
}

export interface SectionHero extends Struct.ComponentSchema {
  collectionName: 'components_section_heroes';
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
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    variant: Schema.Attribute.Enumeration<['visual', 'editorial']> &
      Schema.Attribute.DefaultTo<'visual'>;
  };
}

export interface SectionOutcomes extends Struct.ComponentSchema {
  collectionName: 'components_section_outcomes';
  info: {
    description: 'Business outcomes and proof points';
    displayName: 'Outcomes';
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
    items: Schema.Attribute.Component<'shared.metric', true> &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface SectionPrinciples extends Struct.ComponentSchema {
  collectionName: 'components_section_principles';
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
    items: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
  };
}

export interface SectionProblem extends Struct.ComponentSchema {
  collectionName: 'components_section_problems';
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
  };
}

export interface SectionProcess extends Struct.ComponentSchema {
  collectionName: 'components_section_processes';
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

export interface SectionServiceOverview extends Struct.ComponentSchema {
  collectionName: 'components_section_service_overviews';
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
  };
}

export interface SectionStatementPair extends Struct.ComponentSchema {
  collectionName: 'components_section_statement_pairs';
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
  };
}

export interface SectionSystemFlow extends Struct.ComponentSchema {
  collectionName: 'components_section_system_flows';
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

export interface SectionTimeline extends Struct.ComponentSchema {
  collectionName: 'components_section_timelines';
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
  export module Public {
    export interface ComponentSchemas {
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.hero': BlocksHero;
      'blocks.hero-minimal': BlocksHeroMinimal;
      'blocks.rich-text': BlocksRichText;
      'layout.footer': LayoutFooter;
      'layout.footer-column': LayoutFooterColumn;
      'layout.header': LayoutHeader;
      'section.animated-text': SectionAnimatedText;
      'section.book-call': SectionBookCall;
      'section.diagnosis': SectionDiagnosis;
      'section.editorial-content': SectionEditorialContent;
      'section.faq': SectionFaq;
      'section.feature-list': SectionFeatureList;
      'section.final-cta': SectionFinalCta;
      'section.hero': SectionHero;
      'section.outcomes': SectionOutcomes;
      'section.principles': SectionPrinciples;
      'section.problem': SectionProblem;
      'section.process': SectionProcess;
      'section.service-overview': SectionServiceOverview;
      'section.statement-pair': SectionStatementPair;
      'section.system-flow': SectionSystemFlow;
      'section.timeline': SectionTimeline;
      'shared.cta': SharedCta;
      'shared.diagnosis-example': SharedDiagnosisExample;
      'shared.faq-item': SharedFaqItem;
      'shared.link': SharedLink;
      'shared.list-item': SharedListItem;
      'shared.media': SharedMedia;
      'shared.metric': SharedMetric;
      'shared.process-step': SharedProcessStep;
      'shared.seo': SharedSeo;
      'shared.statement': SharedStatement;
    }
  }
}
