const BLOCK_UIDS = [
  'blocks.hero', 'blocks.hero-minimal', 'blocks.page-hero', 'blocks.animated-text', 'blocks.problem',
  'blocks.service-overview', 'blocks.feature-list', 'blocks.faq', 'blocks.process', 'blocks.final-cta',
  'blocks.book-call', 'blocks.system-flow', 'blocks.diagnosis', 'blocks.timeline', 'blocks.statement-pair',
  'blocks.principles', 'blocks.dashboard-showcase', 'blocks.booking-meeting', 'blocks.brand-proof-grid',
];

const on = Object.fromEntries(BLOCK_UIDS.map((uid) => [uid, { populate: '*' }]));
on['blocks.process'] = { populate: { settings: { populate: { backgroundMedia: true } }, steps: { populate: { visual: true } } } };
on['blocks.service-overview'] = { populate: { settings: { populate: { backgroundMedia: true } }, services: { populate: { capabilities: true, flowSteps: true, icon: true, visual: true, seo: { populate: '*' } } } } };
on['blocks.principles'] = { populate: { settings: { populate: { backgroundMedia: true } }, items: { populate: { image: true } } } };
on['blocks.brand-proof-grid'] = { populate: {
  settings: { populate: { backgroundMedia: true } },
  satisfactionPanel: { populate: { reactionIcons: true } }, strategyPanel: { populate: { icon: true, coverMedia: true } },
  consultationPanel: { populate: { cta: true, backgroundMedia: true, teamMembers: { populate: { avatar: true } } } },
  performancePanel: { populate: { metrics: true } }, caseStudyPanel: { populate: { cta: true, coverMedia: true } },
  industriesPanel: { populate: { items: true } }, testimonialPanel: { populate: { video: true, poster: true } },
} };

export const BLOG_ARTICLE_POPULATE = Object.freeze({
  coverImage: true,
  author: { populate: { avatar: true, seo: { populate: { shareImage: true } } } },
  tags: { populate: { seo: { populate: { shareImage: true } } } },
  cta: true,
  articleCta: true,
  primaryCategory: { populate: { seo: { populate: { shareImage: true } } } },
  relatedPosts: { populate: { coverImage: true, primaryCategory: true, tags: true } },
  relatedService: { populate: { icon: true, visual: true, cta: true, seo: { populate: { shareImage: true } } } },
  seo: { populate: { shareImage: true } },
});

export const PAGE_COLLECTION_POPULATE = Object.freeze({ seo: { populate: '*' }, blocks: { on } });
export const PAGE_POPULATE = Object.freeze({
  header: { populate: '*' },
  footer: { populate: '*' },
  seo: { populate: '*' },
  blocks: { on },
  finalCta: { populate: { primaryCta: true, secondaryCta: true } },
});
