import { BLOCK_UID, BLOG_PAGE_BLOCKS, PAGE_BLOCKS } from './blocks';

type QueryShape = Record<string, unknown>;

type MiddlewareContext = {
  query?: QueryShape;
};

const MEDIA_FIELDS = ['url', 'alternativeText', 'caption', 'mime', 'width', 'height'];

const linkPopulate = true;

export const mediaPopulate = {
  fields: MEDIA_FIELDS,
};

export const mediaComponentPopulate = {
  populate: {
    asset: mediaPopulate,
  },
};

export const seoPopulate = {
  populate: {
    shareImage: mediaPopulate,
  },
};

export const layoutPopulate = {
  header: {
    populate: {
      navLinks: true,
      serviceLinks: true,
      primaryCta: true,
    },
  },
  footer: {
    populate: {
      columns: {
        populate: {
          links: true,
        },
      },
      socialLinks: true,
      legalLinks: true,
    },
  },
};

const BLOCK_POPULATE: Record<string, QueryShape> = {
  [BLOCK_UID.hero]: {
    populate: {
      primaryCta: linkPopulate,
      secondaryCta: linkPopulate,
      visual: mediaComponentPopulate,
      kpis: true,
    },
  },
  [BLOCK_UID.heroMinimal]: {
    populate: {
      primaryCta: linkPopulate,
      secondaryCta: linkPopulate,
      highlights: true,
      gallery: mediaComponentPopulate,
    },
  },
  [BLOCK_UID.ctaBanner]: {
    populate: {
      primaryCta: linkPopulate,
      secondaryCta: linkPopulate,
    },
  },
  [BLOCK_UID.richText]: {
    populate: {
      primaryCta: linkPopulate,
    },
  },
  [BLOCK_UID.sectionHero]: {
    populate: {
      primaryCta: true,
      secondaryCta: true,
    },
  },
  [BLOCK_UID.sectionAnimatedText]: {
    fields: ['eyebrow', 'text', 'highlightedText', 'alignment', 'size', 'animationStyle', 'sticky', 'theme'],
  },
  [BLOCK_UID.sectionProblem]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.sectionServiceOverview]: {
    populate: {
      services: {
        populate: {
          capabilities: true,
          flowSteps: true,
          icon: mediaPopulate,
          visual: mediaPopulate,
          seo: seoPopulate,
        },
      },
    },
  },
  [BLOCK_UID.sectionFeatureList]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.sectionProcess]: {
    populate: {
      steps: {
        populate: {
          visual: mediaPopulate,
        },
      },
    },
  },
  [BLOCK_UID.sectionOutcomes]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.sectionFaq]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.sectionFinalCta]: {
    populate: {
      primaryCta: true,
      secondaryCta: true,
    },
  },
  [BLOCK_UID.sectionBookCall]: {
    populate: '*',
  },
  [BLOCK_UID.sectionEditorialContent]: {
    populate: { statements: true },
  },
  [BLOCK_UID.sectionSystemFlow]: {
    populate: { steps: true, signals: true },
  },
  [BLOCK_UID.sectionDiagnosis]: {
    populate: { items: true },
  },
  [BLOCK_UID.sectionTimeline]: {
    populate: { stages: true },
  },
  [BLOCK_UID.sectionStatementPair]: {
    populate: { first: true, second: true },
  },
  [BLOCK_UID.sectionPrinciples]: {
    populate: { items: true },
  },
};

export const offerPopulate = {
  capabilities: true,
  flowSteps: true,
  icon: mediaPopulate,
  visual: mediaPopulate,
  seo: seoPopulate,
};

export const createBlockDynamicZonePopulate = (allowedBlocks: string[]) => ({
  on: allowedBlocks.reduce<Record<string, QueryShape>>((accumulator, blockUid) => {
    const strategy = BLOCK_POPULATE[blockUid];
    if (strategy) {
      accumulator[blockUid] = strategy;
    }
    return accumulator;
  }, {}),
});

export const pagePopulate = {
  seo: seoPopulate,
  blocks: createBlockDynamicZonePopulate(PAGE_BLOCKS),
};

export const blogPagePopulate = {
  ...layoutPopulate,
  seo: seoPopulate,
  blocks: createBlockDynamicZonePopulate(BLOG_PAGE_BLOCKS),
};

export const siteSettingPopulate = {
  ...layoutPopulate,
  defaultSeo: seoPopulate,
};

export const articlePopulate = {
  coverImage: mediaPopulate,
  cta: true,
  author: {
    fields: ['name', 'slug', 'role'],
    populate: {
      avatar: mediaPopulate,
      socialLinks: true,
    },
  },
  tags: {
    fields: ['name', 'slug'],
  },
  seo: seoPopulate,
};

export const authorPopulate = {
  avatar: mediaPopulate,
  socialLinks: true,
  seo: seoPopulate,
};

export const tagPopulate = {
  seo: seoPopulate,
};

export const applyPopulate = (ctx: MiddlewareContext, populate: QueryShape): void => {
  const query = { ...(ctx.query ?? {}) };
  const existingPopulate = query.populate;

  if (!existingPopulate || existingPopulate === '*' || typeof existingPopulate !== 'object') {
    query.populate = populate;
    ctx.query = query;
    return;
  }

  query.populate = {
    ...(existingPopulate as QueryShape),
    ...populate,
  };

  ctx.query = query;
};
