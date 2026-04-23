import { cache } from 'react';
import {
  fetchContentIndex,
  fetchFirstBySlug,
  fetchSingleType,
  fetchWithLocaleFallback,
  normalizeMedia,
} from '@/lib/strapi';
import { CMS_SINGLE_TYPE_BY_PATH, STATIC_SITE_PATHS, isExternalUrl, normalizeCmsUrl, toAbsoluteSiteUrl } from '@/lib/config/site-config';

const DEFAULT_SITE_NAME = 'Injaaz Digital';
const DEFAULT_DESCRIPTION = 'Data-driven digital growth systems for ambitious brands.';
const HERO_CTA_FALLBACKS = Object.freeze({
  en: Object.freeze({
    primary: Object.freeze({ label: 'Book a Call', url: '/book-call', style: 'primary' }),
    secondary: Object.freeze({ label: 'See How It Works', url: '/growth-engine', style: 'secondary' }),
  }),
  ar: Object.freeze({
    primary: Object.freeze({ label: 'احجز مكالمة', url: '/book-call', style: 'primary' }),
    secondary: Object.freeze({ label: 'شاهد كيف نعمل', url: '/growth-engine', style: 'secondary' }),
  }),
});

const BLOG_ARTICLE_POPULATE = Object.freeze({
  coverImage: true,
  author: {
    populate: {
      avatar: true,
      seo: {
        populate: {
          shareImage: true,
        },
      },
    },
  },
  tags: {
    populate: {
      seo: {
        populate: {
          shareImage: true,
        },
      },
    },
  },
  cta: true,
  seo: {
    populate: {
      shareImage: true,
    },
  },
});

const PAGE_BLOCK_COMPONENTS = [
  'blocks.hero',
  'blocks.hero-minimal',
  'blocks.dashboard-showcase',
  'blocks.feature-mosaic',
  'blocks.trust-row',
  'blocks.persona-grid',
  'blocks.problem',
  'blocks.solution-system',
  'blocks.process-timeline',
  'blocks.proof',
  'blocks.packages',
  'blocks.faq',
  'blocks.cta-banner',
  'blocks.booking-meeting',
  'blocks.brand-proof-grid',
  'blocks.rich-text',
];

const PAGE_BLOCKS_ON_POPULATE = PAGE_BLOCK_COMPONENTS.reduce((accumulator, componentUid) => {
  accumulator[componentUid] = { populate: '*' };
  return accumulator;
}, {});

const PAGE_POPULATE = Object.freeze({
  header: { populate: '*' },
  footer: { populate: '*' },
  seo: { populate: '*' },
  blocks: {
    on: PAGE_BLOCKS_ON_POPULATE,
  },
});

const asText = (value) => (typeof value === 'string' ? value.trim() : '');

const asCollection = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value && typeof value === 'object') return [value];
  return [];
};

const normalizeLink = (link) => {
  if (!link || typeof link !== 'object') return null;

  const label = asText(link.label);
  const shouldForceExternal = link.isExternal === true;
  const url = normalizeCmsUrl(link.url, { forceExternal: shouldForceExternal });

  if (!label || !url) {
    return null;
  }

  return {
    ...link,
    label,
    url,
    style: asText(link.style) || 'primary',
    isExternal: shouldForceExternal || isExternalUrl(url),
  };
};

const normalizeCmsLink = (link, { defaultStyle = 'primary' } = {}) => {
  if (!link || typeof link !== 'object') return null;

  const label = asText(link.label);
  const shouldForceExternal = link.isExternal === true;
  const url = normalizeCmsUrl(link.url, { forceExternal: shouldForceExternal });

  if (!label || !url) {
    return null;
  }

  return {
    ...link,
    label,
    url,
    style: asText(link.style) || defaultStyle,
    isExternal: shouldForceExternal || isExternalUrl(url),
  };
};

const normalizeHeroCtaLink = (link, fallback, { defaultStyle = 'primary' } = {}) => {
  const normalized = normalizeCmsLink(link, { defaultStyle });
  if (normalized?.label) {
    return normalized;
  }

  const fallbackUrl = normalizeCmsUrl(link?.url, { forceExternal: link?.isExternal === true }) || fallback.url;
  if (!fallback.label || !fallbackUrl) {
    return null;
  }

  return {
    ...(link && typeof link === 'object' ? link : {}),
    label: fallback.label,
    url: fallbackUrl,
    style: asText(link?.style) || fallback.style || defaultStyle,
    isExternal: link?.isExternal === true || isExternalUrl(fallbackUrl),
  };
};

const normalizeHeroBlock = (block, locale = 'en') => {
  if (!block || typeof block !== 'object') return block;
  if (block.__component !== 'blocks.hero' && block.__component !== 'blocks.hero-minimal') return block;

  const fallbackSet = locale === 'ar' ? HERO_CTA_FALLBACKS.ar : HERO_CTA_FALLBACKS.en;

  return {
    ...block,
    primaryCta: normalizeHeroCtaLink(block.primaryCta, fallbackSet.primary, { defaultStyle: 'primary' }),
    secondaryCta: normalizeHeroCtaLink(block.secondaryCta, fallbackSet.secondary, { defaultStyle: 'secondary' }),
  };
};

const normalizeBrandProofSatisfactionPanel = (panel) => {
  if (!panel || typeof panel !== 'object') return null;

  const title = asText(panel.title);
  const description = asText(panel.description);
  const ratingLabel = asText(panel.ratingLabel);
  const reactionIcons = asCollection(panel.reactionIcons);

  if (!title && !description && !ratingLabel && reactionIcons.length === 0) {
    return null;
  }

  return {
    ...panel,
    title,
    description,
    ratingLabel,
    reactionIcons,
  };
};

const normalizeBrandProofStrategyCard = (card) => {
  if (!card || typeof card !== 'object') return null;

  const badge = asText(card.badge);
  const headline = asText(card.headline || card.title);
  const summary = asText(card.summary || card.description);
  const coverMedia = card.coverMedia && typeof card.coverMedia === 'object' ? card.coverMedia : null;
  const icon = card.icon && typeof card.icon === 'object' ? card.icon : null;

  if (!badge && !headline && !summary && !icon && !coverMedia) {
    return null;
  }

  return {
    ...card,
    badge,
    headline,
    summary,
    icon,
    coverMedia,
  };
};

const normalizeBrandProofConsultationPanel = (panel) => {
  if (!panel || typeof panel !== 'object') return null;

  const headline = asText(panel.headline || panel.title);
  const supportingNote = asText(panel.supportingNote || panel.note);
  const cta = normalizeCmsLink(panel.cta);
  const backgroundMedia = panel.backgroundMedia && typeof panel.backgroundMedia === 'object' ? panel.backgroundMedia : null;
  const teamMembers = asCollection(panel.teamMembers)
    .map((member) => {
      if (!member || typeof member !== 'object') return null;

      const fullName = asText(member.fullName || member.name);
      const role = asText(member.role);
      const avatar = member.avatar && typeof member.avatar === 'object' ? member.avatar : null;

      if (!fullName && !role && !avatar) {
        return null;
      }

      return {
        ...member,
        fullName,
        role,
        avatar,
      };
    })
    .filter(Boolean);

  if (!headline && !supportingNote && !cta && !backgroundMedia && teamMembers.length === 0) {
    return null;
  }

  return {
    ...panel,
    headline,
    supportingNote,
    cta,
    backgroundMedia,
    teamMembers,
  };
};

const normalizeBrandProofPerformancePanel = (panel) => {
  if (!panel || typeof panel !== 'object') return null;

  const headline = asText(panel.headline || panel.title);
  const summary = asText(panel.summary || panel.description);
  const metrics = asCollection(panel.metrics)
    .map((metric) => {
      if (!metric || typeof metric !== 'object') return null;

      const label = asText(metric.label);
      const value = asText(metric.value);
      const hint = asText(metric.hint);

      if (!label && !value && !hint) {
        return null;
      }

      return {
        ...metric,
        label,
        value,
        hint,
      };
    })
    .filter(Boolean);

  if (!headline && !summary && metrics.length === 0) {
    return null;
  }

  return {
    ...panel,
    headline,
    summary,
    metrics,
  };
};

const normalizeBrandProofCaseStudyPanel = (panel) => {
  if (!panel || typeof panel !== 'object') return null;

  const headline = asText(panel.headline || panel.title);
  const resultLabel = asText(panel.resultLabel || panel.result);
  const cta = normalizeCmsLink(panel.cta);
  const coverMedia = panel.coverMedia && typeof panel.coverMedia === 'object' ? panel.coverMedia : null;

  if (!headline && !resultLabel && !cta && !coverMedia) {
    return null;
  }

  return {
    ...panel,
    headline,
    resultLabel,
    cta,
    coverMedia,
  };
};

const normalizeBrandProofIndustriesPanel = (panel) => {
  if (!panel || typeof panel !== 'object') return null;

  const headline = asText(panel.headline || panel.title);
  const items = asCollection(panel.items)
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const name = asText(item.name || item.title);
      if (!name) {
        return null;
      }

      return {
        ...item,
        name,
      };
    })
    .filter(Boolean);

  if (!headline && items.length === 0) {
    return null;
  }

  return {
    ...panel,
    headline,
    items,
  };
};

const normalizeBrandProofTestimonialPanel = (panel) => {
  if (!panel || typeof panel !== 'object') return null;

  const clientName = asText(panel.clientName || panel.name);
  const clientRole = asText(panel.clientRole || panel.role);
  const quote = asText(panel.quote);
  const video = panel.video && typeof panel.video === 'object' ? panel.video : null;
  const poster = panel.poster && typeof panel.poster === 'object' ? panel.poster : null;

  if (!clientName && !clientRole && !quote && !video && !poster) {
    return null;
  }

  return {
    ...panel,
    clientName,
    clientRole,
    quote,
    video,
    poster,
  };
};

const normalizeBrandProofGridBlock = (block) => {
  if (!block || typeof block !== 'object') return block;
  if (block.__component !== 'blocks.brand-proof-grid') return block;

  const strategyPanel = asCollection(block.strategyPanel).map(normalizeBrandProofStrategyCard).filter(Boolean);

  return {
    ...block,
    satisfactionPanel: normalizeBrandProofSatisfactionPanel(block.satisfactionPanel),
    strategyPanel,
    consultationPanel: normalizeBrandProofConsultationPanel(block.consultationPanel),
    performancePanel: normalizeBrandProofPerformancePanel(block.performancePanel),
    caseStudyPanel: normalizeBrandProofCaseStudyPanel(block.caseStudyPanel),
    industriesPanel: normalizeBrandProofIndustriesPanel(block.industriesPanel),
    testimonialPanel: normalizeBrandProofTestimonialPanel(block.testimonialPanel),
  };
};

const normalizeCmsBlock = (block, locale = 'en') => {
  const heroNormalized = normalizeHeroBlock(block, locale);
  return normalizeBrandProofGridBlock(heroNormalized);
};

const normalizeHeader = (header) => {
  if (!header || typeof header !== 'object') return null;

  const navLinks = Array.isArray(header.navLinks) ? header.navLinks.map(normalizeLink).filter(Boolean) : [];
  const primaryCta = normalizeLink(header.primaryCta);
  const showLanguageSwitcher = header.showLanguageSwitcher !== false;

  if (navLinks.length === 0 && !primaryCta) {
    return null;
  }

  return {
    ...header,
    logoText: asText(header.logoText) || DEFAULT_SITE_NAME,
    navLinks,
    primaryCta,
    showLanguageSwitcher,
  };
};

const normalizeFooter = (footer) => {
  if (!footer || typeof footer !== 'object') return null;

  const columns = Array.isArray(footer.columns)
    ? footer.columns
        .map((column) => {
          if (!column || typeof column !== 'object') return null;

          const links = Array.isArray(column.links) ? column.links.map(normalizeLink).filter(Boolean) : [];
          const title = asText(column.title);

          if (!title && links.length === 0) {
            return null;
          }

          return {
            ...column,
            title,
            links,
          };
        })
        .filter(Boolean)
    : [];

  const socialLinks = Array.isArray(footer.socialLinks) ? footer.socialLinks.map(normalizeLink).filter(Boolean) : [];
  const legalLinks = Array.isArray(footer.legalLinks) ? footer.legalLinks.map(normalizeLink).filter(Boolean) : [];
  const tagline = asText(footer.tagline);
  const contactEmail = asText(footer.contactEmail);
  const copyright = asText(footer.copyright);

  if (!tagline && !contactEmail && !copyright && columns.length === 0 && socialLinks.length === 0 && legalLinks.length === 0) {
    return null;
  }

  return {
    ...footer,
    tagline,
    contactEmail,
    columns,
    socialLinks,
    legalLinks,
    copyright,
  };
};

const normalizeSeo = (seo) => {
  if (!seo || typeof seo !== 'object') return null;

  const metaTitle = asText(seo.metaTitle);
  const metaDescription = asText(seo.metaDescription);
  const keywords = asText(seo.keywords);
  const canonicalUrl = asText(seo.canonicalUrl);

  if (!metaTitle && !metaDescription && !keywords && !canonicalUrl && !seo.shareImage && seo.noIndex !== true) {
    return null;
  }

  return {
    ...seo,
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    noIndex: seo.noIndex === true,
  };
};

const normalizeAuthorData = (author) => {
  if (!author || typeof author !== 'object') return null;

  const name = asText(author.name);
  const slug = asText(author.slug);
  const role = asText(author.role);
  const bio = asText(author.bio);
  const socialLinks = Array.isArray(author.socialLinks) ? author.socialLinks.map(normalizeCmsLink).filter(Boolean) : [];
  const seo = normalizeSeo(author.seo);

  if (!name && !slug && !role && !bio && socialLinks.length === 0 && !author.avatar && !seo) {
    return null;
  }

  return {
    ...author,
    name,
    slug,
    role,
    bio,
    socialLinks,
    seo,
  };
};

const normalizeTagData = (tag) => {
  if (!tag || typeof tag !== 'object') return null;

  const name = asText(tag.name);
  const slug = asText(tag.slug);
  const description = asText(tag.description);
  const seo = normalizeSeo(tag.seo);

  if (!name && !slug && !description && !seo) {
    return null;
  }

  return {
    ...tag,
    name,
    slug,
    description,
    seo,
  };
};

const normalizePageData = (data) => {
  if (!data || typeof data !== 'object') return null;

  const locale = asText(data.locale) || 'en';
  const blocks = Array.isArray(data.blocks)
    ? data.blocks
        .filter((item) => item && item.__component)
        .map((item) => normalizeCmsBlock(item, locale))
    : [];

  return {
    ...data,
    title: asText(data.title),
    description: asText(data.description),
    header: normalizeHeader(data.header),
    footer: normalizeFooter(data.footer),
    seo: normalizeSeo(data.seo),
    blocks,
  };
};

const normalizeArticleData = (data) => {
  if (!data || typeof data !== 'object') return null;

  const readTime = Number.parseInt(data.readTime, 10);

  return {
    ...data,
    title: asText(data.title),
    excerpt: asText(data.excerpt),
    body: asText(data.body),
    actionStep: asText(data.actionStep),
    commonMistake: asText(data.commonMistake),
    category: asText(data.category) || 'service',
    readTime: Number.isFinite(readTime) && readTime > 0 ? readTime : 5,
    cta: normalizeCmsLink(data.cta),
    author: normalizeAuthorData(data.author),
    tags: Array.isArray(data.tags) ? data.tags.map(normalizeTagData).filter(Boolean) : [],
    seo: normalizeSeo(data.seo),
  };
};

const normalizeSiteSetting = (data) => {
  if (!data || typeof data !== 'object') return null;

  return {
    ...data,
    siteName: asText(data.siteName) || DEFAULT_SITE_NAME,
    defaultLocale: asText(data.defaultLocale) || 'en',
    header: normalizeHeader(data.header),
    footer: normalizeFooter(data.footer),
    defaultSeo: normalizeSeo(data.defaultSeo),
  };
};

const mergePageWithSiteLayout = (pageData, siteSetting) => {
  const normalizedPage = normalizePageData(pageData);
  const resolvedHeader = normalizedPage?.header || siteSetting?.header || null;
  const resolvedFooter = normalizedPage?.footer || siteSetting?.footer || null;
  const resolvedSeo = normalizedPage?.seo || siteSetting?.defaultSeo || null;

  if (normalizedPage) {
    return {
      ...normalizedPage,
      header: resolvedHeader,
      footer: resolvedFooter,
      seo: resolvedSeo,
    };
  }

  if (resolvedHeader || resolvedFooter || resolvedSeo) {
    return {
      header: resolvedHeader,
      footer: resolvedFooter,
      seo: resolvedSeo,
    };
  }

  return null;
};

const splitKeywords = (keywords) =>
  asText(keywords)
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const buildSiteMetadata = ({ pathname, siteSetting, pageData, title, description, noIndex = false }) => {
  const siteName = siteSetting?.siteName || DEFAULT_SITE_NAME;
  const seo = pageData?.seo || siteSetting?.defaultSeo || null;
  const metaTitle = title || seo?.metaTitle || pageData?.title || siteName;
  const metaDescription =
    description || seo?.metaDescription || pageData?.description || siteSetting?.defaultSeo?.metaDescription || DEFAULT_DESCRIPTION;
  const canonicalUrl = toAbsoluteSiteUrl(seo?.canonicalUrl || pathname);
  const shareMedia = normalizeMedia(seo?.shareImage, { fallbackAlt: metaTitle });
  const keywords = splitKeywords(seo?.keywords || siteSetting?.defaultSeo?.keywords);
  const shouldIndex = !(seo?.noIndex || noIndex);

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: shouldIndex
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName,
      type: 'website',
      images: shareMedia?.url ? [{ url: shareMedia.url, alt: shareMedia.alt || metaTitle }] : undefined,
    },
    twitter: {
      card: shareMedia?.url ? 'summary_large_image' : 'summary',
      title: metaTitle,
      description: metaDescription,
      images: shareMedia?.url ? [shareMedia.url] : undefined,
    },
  };
};

const toSlug = (pathname) => {
  if (pathname === '/') return '';

  const raw = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  return raw;
};

const buildLayoutOnlyData = (siteSetting) => ({
  data: mergePageWithSiteLayout(null, siteSetting?.data),
  fallback: false,
  error: false,
  settings: siteSetting?.data,
});

async function loadBlogListPage(locale, siteSettingPromise) {
  const [pageResult, articlesResult, siteSetting] = await Promise.all([
    fetchWithLocaleFallback((activeLocale) => fetchSingleType('blog-page', activeLocale, { populate: PAGE_POPULATE }), locale),
    fetchWithLocaleFallback(
      (activeLocale) =>
        fetchContentIndex('articles', activeLocale, {
          populate: BLOG_ARTICLE_POPULATE,
          sort: ['featured:desc', 'publishedAt:desc', 'updatedAt:desc'],
          pagination: { pageSize: 30 },
        }),
      locale
    ),
    siteSettingPromise,
  ]);

  const page = mergePageWithSiteLayout(pageResult.data, siteSetting.data);

  return {
    data: {
      type: 'blog-list',
      page,
      articles: (articlesResult.data || []).map((article) => normalizeArticleData(article)).filter(Boolean),
      header: page?.header || siteSetting.data?.header || null,
      footer: page?.footer || siteSetting.data?.footer || null,
    },
    fallback: pageResult.fallback || articlesResult.fallback,
    error: false,
    settings: siteSetting.data,
  };
}

async function loadBlogArticlePage(pathname, locale, siteSettingPromise) {
  const articleSlug = pathname.replace('/blog/', '').trim();
  const [articleResult, siteSetting] = await Promise.all([
    fetchWithLocaleFallback(
      (activeLocale) =>
        fetchFirstBySlug('articles', activeLocale, articleSlug, {
          populate: BLOG_ARTICLE_POPULATE,
        }),
      locale
    ),
    siteSettingPromise,
  ]);

  return {
    data: articleResult.data
      ? {
          type: 'blog-post',
          article: normalizeArticleData(articleResult.data),
          header: siteSetting.data?.header || null,
          footer: siteSetting.data?.footer || null,
        }
      : {
          type: 'not-found',
          header: siteSetting.data?.header || null,
          footer: siteSetting.data?.footer || null,
        },
    fallback: articleResult.fallback,
    error: false,
    settings: siteSetting.data,
  };
}

async function loadSingleTypePage(singleType, locale, siteSettingPromise) {
  const [result, siteSetting] = await Promise.all([
    fetchWithLocaleFallback((activeLocale) => fetchSingleType(singleType, activeLocale, { populate: PAGE_POPULATE }), locale),
    siteSettingPromise,
  ]);

  return {
    data: mergePageWithSiteLayout(result.data, siteSetting.data),
    fallback: result.fallback,
    error: false,
    settings: siteSetting.data,
  };
}

async function loadGenericSlugPage(pathname, locale, siteSettingPromise) {
  const slug = toSlug(pathname);
  const siteSetting = await siteSettingPromise;

  if (!slug || slug.includes('/')) {
    return buildLayoutOnlyData(siteSetting);
  }

  const result = await fetchWithLocaleFallback(
    (activeLocale) => fetchFirstBySlug('pages', activeLocale, slug, { populate: PAGE_POPULATE }),
    locale
  );

  return {
    data: mergePageWithSiteLayout(result.data, siteSetting.data),
    fallback: result.fallback,
    error: false,
    settings: siteSetting.data,
  };
}

export const getSiteSetting = cache(async (locale) => {
  try {
    const result = await fetchWithLocaleFallback((activeLocale) => fetchSingleType('site-setting', activeLocale), locale);
    return {
      ...result,
      data: normalizeSiteSetting(result.data),
      error: false,
    };
  } catch {
    return {
      data: null,
      fallback: false,
      error: true,
    };
  }
});

export async function getCmsPage(pathname, locale) {
  const normalizedPath = normalizeCmsUrl(pathname || '/');
  const siteSettingPromise = getSiteSetting(locale);
  const singleType = CMS_SINGLE_TYPE_BY_PATH[normalizedPath];

  try {
    if (normalizedPath === '/blog') {
      return loadBlogListPage(locale, siteSettingPromise);
    }

    if (normalizedPath.startsWith('/blog/')) {
      return loadBlogArticlePage(normalizedPath, locale, siteSettingPromise);
    }

    if (singleType) {
      return loadSingleTypePage(singleType, locale, siteSettingPromise);
    }

    return loadGenericSlugPage(normalizedPath, locale, siteSettingPromise);
  } catch {
    const siteSetting = await siteSettingPromise;
    return {
      data: mergePageWithSiteLayout(null, siteSetting.data),
      fallback: false,
      error: true,
      settings: siteSetting.data,
    };
  }
}

export async function getCmsPageMetadata(pathname, locale) {
  const normalizedPath = normalizeCmsUrl(pathname || '/');
  const cms = await getCmsPage(normalizedPath, locale);
  const isBlogList = cms.data?.type === 'blog-list';
  const isBlogPost = cms.data?.type === 'blog-post';
  const hasContent = Boolean(
    cms.data?.blocks?.length ||
      cms.data?.title ||
      cms.data?.description ||
      (isBlogList && (cms.data?.page?.title || cms.data?.page?.blocks?.length || cms.data?.articles?.length)) ||
      (isBlogPost && cms.data?.article?.title)
  );

  if (!hasContent) {
    return buildSiteMetadata({
      pathname: normalizedPath,
      siteSetting: cms.settings,
      pageData: {
        title: locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found',
        description:
          locale === 'ar'
            ? 'هذه الصفحة غير متاحة حالياً أو لم يتم نشرها بعد.'
            : 'This page is not available yet or has not been published.',
      },
      noIndex: true,
    });
  }

  if (isBlogPost) {
    return buildSiteMetadata({
      pathname: normalizedPath,
      siteSetting: cms.settings,
      pageData: cms.data.article,
      title: cms.data.article?.seo?.metaTitle || cms.data.article?.title,
      description: cms.data.article?.seo?.metaDescription || cms.data.article?.excerpt || DEFAULT_DESCRIPTION,
    });
  }

  if (isBlogList) {
    return buildSiteMetadata({
      pathname: normalizedPath,
      siteSetting: cms.settings,
      pageData: cms.data.page,
      title: cms.data.page?.seo?.metaTitle || cms.data.page?.title || 'Blog',
      description: cms.data.page?.seo?.metaDescription || cms.data.page?.description || DEFAULT_DESCRIPTION,
    });
  }

  return buildSiteMetadata({
    pathname: normalizedPath,
    siteSetting: cms.settings,
    pageData: cms.data,
  });
}

export async function getCustomPageMetadata(locale, { pathname, title, description, noIndex = false }) {
  const siteSetting = await getSiteSetting(locale);

  return buildSiteMetadata({
    pathname,
    siteSetting: siteSetting.data,
    pageData: {
      title,
      description,
      seo: {
        metaTitle: title,
        metaDescription: description,
        noIndex,
      },
    },
    title,
    description,
    noIndex,
  });
}

export const getSitemapEntries = cache(async () => {
  const articles = await fetchContentIndex('articles', 'en', {
    fields: ['slug', 'updatedAt'],
    sort: ['featured:desc', 'publishedAt:desc', 'updatedAt:desc'],
  }).catch(() => []);

  const entries = new Map();

  STATIC_SITE_PATHS.forEach((pathname) => {
    entries.set(pathname, {
      url: toAbsoluteSiteUrl(pathname),
      lastModified: new Date(),
    });
  });

  articles.forEach((article) => {
    const slug = asText(article?.slug);
    if (!slug) return;

    const pathname = normalizeCmsUrl(`/blog/${slug}`);
    entries.set(pathname, {
      url: toAbsoluteSiteUrl(pathname),
      lastModified: article?.updatedAt ? new Date(article.updatedAt) : new Date(),
    });
  });

  return [...entries.values()];
});
