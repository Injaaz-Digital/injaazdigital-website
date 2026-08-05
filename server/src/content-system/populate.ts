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
  [BLOCK_UID.pageHero]: {
    populate: {
      primaryCta: true,
      secondaryCta: true,
    },
  },
  [BLOCK_UID.animatedText]: {
    fields: ['eyebrow', 'text', 'highlightedText', 'alignment', 'size', 'animationStyle', 'sticky', 'theme'],
  },
  [BLOCK_UID.problem]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.serviceOverview]: {
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
  [BLOCK_UID.featureList]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.faq]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.process]: {
    populate: {
      steps: {
        populate: {
          visual: mediaPopulate,
        },
      },
    },
  },
  [BLOCK_UID.finalCta]: {
    populate: {
      primaryCta: true,
      secondaryCta: true,
    },
  },
  [BLOCK_UID.bookCall]: {
    populate: '*',
  },
  [BLOCK_UID.systemFlow]: {
    populate: { steps: true, signals: true },
  },
  [BLOCK_UID.diagnosis]: {
    populate: { items: true },
  },
  [BLOCK_UID.timeline]: {
    populate: { stages: true },
  },
  [BLOCK_UID.statementPair]: {
    populate: { first: true, second: true },
  },
  [BLOCK_UID.principles]: {
    populate: {
      items: {
        populate: {
          image: mediaPopulate,
        },
      },
    },
  },
  [BLOCK_UID.dashboardShowcase]: {
    populate: {
      stats: true,
      insights: true,
      primaryCta: true,
      secondaryCta: true,
    },
  },
  [BLOCK_UID.bookingMeeting]: {
    populate: {
      bookingLink: true,
      benefits: true,
    },
  },
  [BLOCK_UID.brandProofGrid]: {
    populate: {
      satisfactionPanel: { populate: { reactionIcons: mediaPopulate } },
      strategyPanel: { populate: { icon: mediaPopulate, coverMedia: mediaPopulate } },
      consultationPanel: {
        populate: {
          cta: true,
          backgroundMedia: mediaPopulate,
          teamMembers: { populate: { avatar: mediaPopulate } },
        },
      },
      performancePanel: { populate: { metrics: true } },
      caseStudyPanel: { populate: { cta: true, coverMedia: mediaPopulate } },
      industriesPanel: { populate: { items: true } },
      testimonialPanel: { populate: { video: mediaPopulate, poster: mediaPopulate } },
    },
  },
};

const blockSettingsPopulate = { populate: { backgroundMedia: mediaPopulate } };
Object.values(BLOCK_POPULATE).forEach((strategy) => {
  const populate = strategy.populate;
  if (populate && populate !== '*' && typeof populate === 'object') {
    (populate as QueryShape).settings = blockSettingsPopulate;
  }
});

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
  finalCta: BLOCK_POPULATE[BLOCK_UID.finalCta],
};

export const siteSettingPopulate = {
  ...layoutPopulate,
  defaultSeo: seoPopulate,
};

export const articlePopulate = {
  coverImage: mediaPopulate,
  cta: true,
  articleCta: true,
  primaryCategory: {
    fields: ['name', 'slug', 'description'],
    populate: { seo: seoPopulate },
  },
  author: {
    fields: ['name', 'slug', 'role', 'bio'],
    populate: {
      avatar: mediaPopulate,
      socialLinks: true,
    },
  },
  tags: {
    fields: ['name', 'slug'],
  },
  relatedPosts: {
    fields: ['title', 'slug', 'excerpt', 'publishedAt', 'updatedAt', 'readTime', 'category'],
    populate: { coverImage: mediaPopulate, primaryCategory: { fields: ['name', 'slug'] }, tags: { fields: ['name', 'slug'] } },
  },
  relatedService: {
    populate: offerPopulate,
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

export const categoryPopulate = {
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
