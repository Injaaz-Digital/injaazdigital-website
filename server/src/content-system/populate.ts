import { ABOUT_PAGE_BLOCKS, BLOCK_UID, BLOG_PAGE_BLOCKS, MARKETING_PAGE_BLOCKS, SERVICE_PAGE_BLOCKS } from './blocks';

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
  [BLOCK_UID.dashboardShowcase]: {
    populate: {
      stats: true,
      insights: true,
      primaryCta: linkPopulate,
      secondaryCta: linkPopulate,
    },
  },
  [BLOCK_UID.featureMosaic]: {
    populate: {
      cards: {
        populate: {
          artwork: mediaComponentPopulate,
        },
      },
    },
  },
  [BLOCK_UID.trustRow]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.personaGrid]: {
    populate: {
      personas: {
        populate: {
          cta: linkPopulate,
        },
      },
    },
  },
  [BLOCK_UID.problem]: {
    populate: {
      bullets: true,
    },
  },
  [BLOCK_UID.solutionSystem]: {
    populate: {
      steps: true,
    },
  },
  [BLOCK_UID.processTimeline]: {
    populate: {
      steps: true,
    },
  },
  [BLOCK_UID.proof]: {
    populate: {
      trackedMetrics: true,
      artifact: mediaComponentPopulate,
    },
  },
  [BLOCK_UID.packages]: {
    populate: {
      packages: {
        populate: {
          cta: linkPopulate,
        },
      },
    },
  },
  [BLOCK_UID.faq]: {
    populate: {
      items: true,
    },
  },
  [BLOCK_UID.ctaBanner]: {
    populate: {
      primaryCta: linkPopulate,
      secondaryCta: linkPopulate,
    },
  },
  [BLOCK_UID.bookingMeeting]: {
    populate: {
      bookingLink: linkPopulate,
      benefits: true,
    },
  },
  [BLOCK_UID.aboutMosaic]: {
    populate: {
      csatEmojis: mediaComponentPopulate,
      strategyImage: mediaComponentPopulate,
      strategySlides: {
        populate: {
          artwork: mediaComponentPopulate,
        },
      },
      discussBackground: mediaComponentPopulate,
      discussCta: linkPopulate,
      teamMembers: {
        populate: {
          avatar: mediaComponentPopulate,
        },
      },
      seoMetrics: true,
      caseStudyLink: linkPopulate,
      caseStudyImage: mediaComponentPopulate,
      industries: true,
      testimonialVideo: mediaComponentPopulate,
      testimonialPoster: mediaComponentPopulate,
    },
  },
  [BLOCK_UID.brandProofGrid]: {
    populate: {
      satisfactionPanel: {
        populate: {
          reactionIcons: mediaComponentPopulate,
        },
      },
      strategyPanel: {
        populate: {
          icon: mediaComponentPopulate,
          coverMedia: mediaComponentPopulate,
        },
      },
      consultationPanel: {
        populate: {
          backgroundMedia: mediaComponentPopulate,
          cta: linkPopulate,
          teamMembers: {
            populate: {
              avatar: mediaComponentPopulate,
            },
          },
        },
      },
      performancePanel: {
        populate: {
          metrics: true,
        },
      },
      caseStudyPanel: {
        populate: {
          cta: linkPopulate,
          coverMedia: mediaComponentPopulate,
        },
      },
      industriesPanel: {
        populate: {
          items: true,
        },
      },
      testimonialPanel: {
        populate: {
          video: mediaComponentPopulate,
          poster: mediaComponentPopulate,
        },
      },
    },
  },
  [BLOCK_UID.richText]: {
    populate: {
      primaryCta: linkPopulate,
    },
  },
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

export const marketingPagePopulate = {
  ...layoutPopulate,
  seo: seoPopulate,
  blocks: createBlockDynamicZonePopulate(MARKETING_PAGE_BLOCKS),
};

export const blogPagePopulate = {
  ...layoutPopulate,
  seo: seoPopulate,
  blocks: createBlockDynamicZonePopulate(BLOG_PAGE_BLOCKS),
};

export const servicePagePopulate = {
  ...layoutPopulate,
  seo: seoPopulate,
  blocks: createBlockDynamicZonePopulate(SERVICE_PAGE_BLOCKS),
};

export const aboutPagePopulate = {
  ...layoutPopulate,
  seo: seoPopulate,
  blocks: createBlockDynamicZonePopulate(ABOUT_PAGE_BLOCKS),
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
