import { cache } from 'react';
import {
  fetchContentIndex,
  fetchDocument,
  fetchFirstBySlug,
  fetchSingleType,
  fetchWithLocaleFallback,
  getPageBySlug,
} from '@/lib/strapi';
import { request } from '@/lib/strapi';
import { CMS_SINGLE_TYPE_BY_PATH, isExternalUrl, normalizeCmsUrl } from '@/lib/config/site-config';
import { fetchWebsiteBookingBootstrap } from '@/features/book-call/server/booking-integration';
import { sanitizeCmsRichText } from '@/features/blog/server/rich-text';
import { articleSchema, cmsPageSchema, siteSettingSchema } from '@/features/cms/content/shared/schemas';
import { estimateReadingTime } from '@/features/blog/server/reading-time';
import { rankRelatedArticles } from '@/features/blog/server/recommendations';
import { cmsLogger } from '@/features/cms/server/cms-logger';
import { cmsCacheTags } from '@/features/cms/server/cms-cache';
import { BLOG_ARTICLE_POPULATE, PAGE_COLLECTION_POPULATE, PAGE_POPULATE } from '@/features/cms/content/shared/populate';
import { getBookCallFlowRequestKeys, normalizeBookCallFlowKey } from '@/features/cms/lib/book-call-flow';

const DEFAULT_SITE_NAME = 'Injaaz Digital';
const HERO_CTA_FALLBACKS = Object.freeze({
  en: Object.freeze({
    primary: Object.freeze({ label: 'Book a Call', url: '/book-call', style: 'primary' }),
    secondary: Object.freeze({ label: 'See How It Works', url: '/growth-system', style: 'secondary' }),
  }),
  ar: Object.freeze({
    primary: Object.freeze({ label: 'احجز مكالمة', url: '/book-call', style: 'primary' }),
    secondary: Object.freeze({ label: 'شاهد كيف نعمل', url: '/growth-system', style: 'secondary' }),
  }),
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

const normalizeBlockCtas = (block) => {
  if (!block || typeof block !== 'object') return block;

  return {
    ...block,
    primaryCta: normalizeCmsLink(block.primaryCta),
    secondaryCta: normalizeCmsLink(block.secondaryCta, { defaultStyle: 'secondary' }),
  };
};

const normalizeOffer = (offer) => {
  if (!offer || typeof offer !== 'object' || offer.isActive !== true) return null;
  const name = asText(offer.name);
  const href = normalizeCmsUrl(offer.primaryCtaHref);
  if (!name || !href) return null;

  return {
    ...offer,
    name,
    title: name,
    description: asText(offer.shortDescription),
    shortDescription: asText(offer.shortDescription),
    positioningLine: asText(offer.positioningLine),
    outcome: asText(offer.outcome),
    primaryCtaHref: href,
    url: href,
    primaryCtaLabel: asText(offer.primaryCtaLabel),
    ctaLabel: asText(offer.primaryCtaLabel),
    capabilities: asCollection(offer.capabilities),
    flowSteps: asCollection(offer.flowSteps),
    displayOrder: Number(offer.displayOrder || 0),
  };
};

const normalizeOfferBlocks = (pageData) => {
  if (!pageData || !Array.isArray(pageData.blocks)) return pageData;

  return {
    ...pageData,
    blocks: pageData.blocks.map((block) => block?.__component === 'blocks.service-overview'
      ? {
          ...block,
          services: asCollection(block.services)
            .map(normalizeOffer)
            .filter(Boolean)
            .sort((left, right) => left.displayOrder - right.displayOrder),
        }
      : block),
  };
};

const normalizeCmsBlock = (block, locale = 'en') => {
  const settings = block?.settings && typeof block.settings === 'object' ? block.settings : {};
  const heroNormalized = normalizeHeroBlock({ ...block, ...settings }, locale);
  return normalizeBlockCtas(normalizeBrandProofGridBlock(heroNormalized));
};

const normalizeHeader = (header) => {
  if (!header || typeof header !== 'object') return null;

  const navLinks = Array.isArray(header.navLinks) ? header.navLinks.map(normalizeLink).filter(Boolean) : [];
  const serviceLinks = Array.isArray(header.serviceLinks) ? header.serviceLinks.map(normalizeLink).filter(Boolean) : [];
  const primaryCta = normalizeLink(header.primaryCta);
  const showLanguageSwitcher = header.showLanguageSwitcher !== false;

  if (navLinks.length === 0 && !primaryCta) {
    return null;
  }

  return {
    ...header,
    logoText: asText(header.logoText) || DEFAULT_SITE_NAME,
    navLinks,
    servicesLabel: asText(header.servicesLabel) || 'Services',
    serviceLinks,
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
  const bio = sanitizeCmsRichText(author.bio).html;
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

const normalizeTaxonomyData = (value) => normalizeTagData(value);

const normalizePageData = (data) => {
  if (!data || typeof data !== 'object') return null;

  const locale = asText(data.locale) || 'en';
  const blocks = Array.isArray(data.blocks)
    ? data.blocks
        .filter((item) => item && item.__component)
        .map((item) => normalizeCmsBlock(item, locale))
    : [];

  const normalized = {
    ...data,
    title: asText(data.title),
    description: asText(data.description),
    header: normalizeHeader(data.header),
    footer: normalizeFooter(data.footer),
    seo: normalizeSeo(data.seo),
    blocks,
    finalCta: data.finalCta
      ? normalizeCmsBlock({ ...data.finalCta, __component: 'blocks.final-cta' }, locale)
      : null,
  };
  const parsed = cmsPageSchema.safeParse(normalized);
  if (!parsed.success) {
    cmsLogger.error('CMS page contract validation failed.', { operation: 'cms.page.validate', locale, documentId: data.documentId, issues: parsed.error.issues.map(({ path, code }) => ({ path, code })) });
    return null;
  }
  return parsed.data;
};

const normalizeArticleData = (data) => {
  if (!data || typeof data !== 'object') return null;

  const richText = sanitizeCmsRichText(data.body);
  const articleCta = normalizeCmsLink(data.articleCta)
    || normalizeCmsLink(data.relatedService?.cta)
    || normalizeCmsLink(data.cta);
  const readingTimeMinutes = estimateReadingTime(richText.html, data.readTime);

  const normalized = {
    ...data,
    title: asText(data.title),
    excerpt: asText(data.excerpt),
    body: richText.html,
    headings: richText.headings,
    actionStep: asText(data.actionStep),
    commonMistake: asText(data.commonMistake),
    category: asText(data.category) || 'service',
    readTime: readingTimeMinutes,
    readingTimeMinutes,
    cta: articleCta,
    articleCta,
    author: normalizeAuthorData(data.author),
    tags: Array.isArray(data.tags) ? data.tags.map(normalizeTagData).filter(Boolean) : [],
    primaryCategory: normalizeTaxonomyData(data.primaryCategory),
    relatedPosts: Array.isArray(data.relatedPosts)
      ? data.relatedPosts.filter((article) => article?.slug && article.slug !== data.slug).map((article) => ({ ...article, primaryCategory: normalizeTaxonomyData(article.primaryCategory) }))
      : [],
    relatedService: data.relatedService || null,
    seo: normalizeSeo(data.seo),
  };
  const parsed = articleSchema.safeParse(normalized);
  if (!parsed.success) {
    cmsLogger.error('CMS article contract validation failed.', { operation: 'cms.article.validate', locale: data.locale, documentId: data.documentId, issues: parsed.error.issues.map(({ path, code }) => ({ path, code })) });
    return null;
  }
  return parsed.data;
};

const normalizeSiteSetting = (data) => {
  if (!data || typeof data !== 'object') return null;

  const normalized = {
    ...data,
    siteName: asText(data.siteName) || DEFAULT_SITE_NAME,
    defaultLocale: asText(data.defaultLocale) || 'en',
    header: normalizeHeader(data.header),
    footer: normalizeFooter(data.footer),
    defaultSeo: normalizeSeo(data.defaultSeo),
  };
  const parsed = siteSettingSchema.safeParse(normalized);
  if (!parsed.success) {
    cmsLogger.error('CMS site-setting contract validation failed.', { operation: 'cms.site.validate', locale: data.locale, documentId: data.documentId, issues: parsed.error.issues.map(({ path, code }) => ({ path, code })) });
    return null;
  }
  return parsed.data;
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

const BOOK_CALL_EDITORIAL_FIELDS = Object.freeze([
  'introEyebrow',
  'pageTitle',
  'qualificationIntroTitle',
  'contactStepTitle',
  'contactStepHelp',
  'bookingTitle',
  'successTitle',
  'fallbackTitle',
  'fallbackDescription',
]);

const pickBookCallEditorialCopy = (block) =>
  Object.fromEntries(
    BOOK_CALL_EDITORIAL_FIELDS
      .filter((field) => block?.[field] !== undefined && block?.[field] !== null)
      .map((field) => [field, block[field]])
  );

const hydrateBookCallBlocks = async (pageData, locale, pathname) => {
  const blocks = Array.isArray(pageData?.blocks) ? pageData.blocks : [];
  const hasBookCallBlock = blocks.some((block) => block?.__component === 'blocks.book-call');

  if (!hasBookCallBlock) {
    return pageData;
  }

  const bootstraps = new Map(await Promise.all(
    getBookCallFlowRequestKeys(blocks).map(async (requestedFlowKey) => {
      const bootstrap = await fetchWebsiteBookingBootstrap({
        locale,
        ...(requestedFlowKey ? { flowKey: requestedFlowKey } : {}),
      }).catch((error) => {
        cmsLogger.error('Website booking integration could not be loaded.', {
          operation: 'cms.book-call.integration-resolve',
          locale,
          route: pathname,
          flowKey: requestedFlowKey || 'default',
          errorCode: error?.code || 'BOOKING_INTEGRATION_UNAVAILABLE',
        });
        return null;
      });
      return [requestedFlowKey, bootstrap];
    })
  ));

  return {
    ...pageData,
    blocks: blocks.map((block) => {
      if (block?.__component !== 'blocks.book-call') {
        return block;
      }
      const requestedFlowKey = normalizeBookCallFlowKey(block.questionFlowKey);
      const bootstrap = bootstraps.get(requestedFlowKey) || null;
      const bookingConfig = bootstrap?.bookingConfig || null;
      const stepper = bootstrap?.stepper || null;
      const flowKey = stepper?.key || bookingConfig?.defaultFlowKey || '';
      const hasConfigurationError = !stepper;
      const questionsEnabled = Boolean(stepper) && stepper.qualificationEnabled !== false;
      const duration = Number(bookingConfig?.meetingDuration || 30);

      return {
        id: block.id,
        __component: block.__component,
        ...pickBookCallEditorialCopy(block),
        stepperKey: flowKey,
        stepperVersion: Number(stepper?.version || 0),
        stepperLocale: stepper?.locale || locale,
        stepperSteps: Array.isArray(stepper?.steps) ? stepper.steps : [],
        contactFields: stepper?.contactFields || null,
        ...(bookingConfig?.meetingTitle ? { meetingName: bookingConfig.meetingTitle } : {}),
        durationLabel: locale === 'ar' ? `${duration} دقيقة` : `${duration} min`,
        timezoneLabel: locale === 'ar'
          ? `توقيت ${bookingConfig?.timezone || 'Africa/Casablanca'}`
          : (bookingConfig?.timezone || 'Africa/Casablanca'),
        meetingLocation: bookingConfig?.meetingLocation || 'Google Meet',
        questionsBeforeBookingEnabled: questionsEnabled || hasConfigurationError,
        ...(hasConfigurationError ? {
          errorTitle: locale === 'ar' ? 'إعداد الحجز غير مكتمل' : 'Booking configuration unavailable',
          errorDescription: locale === 'ar'
            ? 'تعذر تحميل إعداد الحجز لهذا الموقع. يرجى التواصل معنا مباشرة.'
            : 'This website booking integration could not be loaded. Please contact us directly.',
        } : {}),
        sourcePage: pathname || '/book-call',
        initialQuestions: questionsEnabled ? (stepper?.questions || []) : [],
      };
    }),
  };
};

const toSlug = (pathname) => {
  if (pathname === '/') return '';

  const raw = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  return raw;
};

const PAGE_SLUG_BY_PATH = Object.freeze({
  '/': 'home',
  '/website-development': 'website-development',
  '/growth-system': 'growth-system',
});

const pageSlugFromPathname = (pathname) => PAGE_SLUG_BY_PATH[pathname] || toSlug(pathname);

const localizedPath = (locale, pathname) => `/${locale}${pathname === '/' ? '' : pathname}`;

const defaultLocalizedPaths = (pathname) => ({
  en: localizedPath('en', pathname),
  ar: localizedPath('ar', pathname),
});

const resolveEntityLocalizedPaths = async ({ contentType, entity, locale, pathname, prefix = '' }) => {
  const paths = defaultLocalizedPaths(pathname);
  const documentId = asText(entity?.documentId);
  const alternateLocale = locale === 'ar' ? 'en' : 'ar';
  if (!documentId || pathname === '/') return paths;

  try {
    const alternate = await fetchDocument(contentType, documentId, alternateLocale, {
      fields: ['slug', 'documentId'],
    });
    const alternateSlug = asText(alternate?.slug);
    if (alternateSlug) paths[alternateLocale] = localizedPath(alternateLocale, `/${prefix}${alternateSlug}`);
  } catch (error) {
    cmsLogger.warn('Localized route lookup failed; retaining the equivalent locale-prefixed path.', {
      operation: 'cms.route.localization',
      locale,
      route: pathname,
      errorCode: error?.code || 'CMS_LOCALIZED_ROUTE_LOOKUP_FAILED',
    });
  }

  return paths;
};

const buildLayoutOnlyData = (siteSetting) => ({
  data: mergePageWithSiteLayout(null, siteSetting?.data),
  fallback: false,
  error: false,
  settings: siteSetting?.data,
});

async function loadBlogListPage(locale, siteSettingPromise) {
  const safeBlogRequest = async (operation, request, emptyData) => {
    try {
      return await request();
    } catch (error) {
      cmsLogger.error('Blog CMS request failed; rendering the resilient blog shell.', {
        operation,
        locale,
        errorCode: error?.code || 'BLOG_CMS_REQUEST_FAILED',
      });
      return { data: emptyData, locale, fallback: false, error: true };
    }
  };
  const [pageResult, articlesResult, siteSetting] = await Promise.all([
    safeBlogRequest(
      'cms.blog-page.load',
      () => fetchWithLocaleFallback((activeLocale) => fetchSingleType('blog-page', activeLocale, { populate: PAGE_POPULATE }), locale),
      null
    ),
    safeBlogRequest(
      'cms.blog-articles.load',
      () => fetchWithLocaleFallback(
        (activeLocale) =>
          fetchContentIndex('articles', activeLocale, {
            populate: BLOG_ARTICLE_POPULATE,
            sort: ['featured:desc', 'publishedAt:desc', 'updatedAt:desc'],
            pagination: { pageSize: 30 },
          }),
        locale
      ),
      []
    ),
    siteSettingPromise,
  ]);

  const fallbackPage = {
    title: locale === 'ar' ? 'الرؤى والأنظمة' : 'Insights and systems',
    description: locale === 'ar'
      ? 'مقالات عملية حول أنظمة النمو والمواقع والعمليات الرقمية.'
      : 'Practical articles about growth, website, and digital operating systems.',
    blocks: [],
    seo: null,
  };
  const page = mergePageWithSiteLayout(pageResult.data || fallbackPage, siteSetting.data) || fallbackPage;

  return {
    data: {
      type: 'blog-list',
      page,
      articles: (articlesResult.data || []).map((article) => normalizeArticleData(article)).filter(Boolean),
      localizedPaths: defaultLocalizedPaths('/blog'),
      header: page?.header || siteSetting.data?.header || null,
      footer: page?.footer || siteSetting.data?.footer || null,
    },
    fallback: pageResult.fallback || articlesResult.fallback,
    error: pageResult.error === true || articlesResult.error === true,
    settings: siteSetting.data,
  };
}

async function loadBlogArticlePage(pathname, locale, siteSettingPromise) {
  const articleSlug = pathname.replace('/blog/', '').trim();
  const [articleResult, articleIndexResult, siteSetting] = await Promise.all([
    fetchWithLocaleFallback(
      (activeLocale) =>
        fetchFirstBySlug('articles', activeLocale, articleSlug, {
          populate: BLOG_ARTICLE_POPULATE,
        }),
      locale
    ),
    fetchWithLocaleFallback((activeLocale) => fetchContentIndex('articles', activeLocale, {
      populate: BLOG_ARTICLE_POPULATE,
      sort: ['publishedAt:desc', 'updatedAt:desc'],
      pagination: { pageSize: 200 },
    }), locale),
    siteSettingPromise,
  ]);

  if (locale === 'ar' && articleResult.data && !articleResult.data?.author?.avatar) {
    try {
      const enArticle = await fetchFirstBySlug('articles', 'en', articleSlug, {
        populate: BLOG_ARTICLE_POPULATE,
      });
      if (enArticle?.author?.avatar) {
        articleResult.data.author = articleResult.data.author || {};
        articleResult.data.author.avatar = enArticle.author.avatar;
      }
    } catch (error) {
      cmsLogger.warn('English author-media fallback failed.', { operation: 'cms.article.author-fallback', locale, route: pathname, errorCode: error?.code || 'CMS_AUTHOR_FALLBACK_FAILED' });
    }
  }

  const localizedPaths = articleResult.data
    ? await resolveEntityLocalizedPaths({ contentType: 'articles', entity: articleResult.data, locale, pathname, prefix: 'blog/' })
    : defaultLocalizedPaths(pathname);

  const normalizedArticle = normalizeArticleData(articleResult.data);
  const normalizedIndex = (articleIndexResult.data || []).map(normalizeArticleData).filter(Boolean);
  if (normalizedArticle) {
    normalizedArticle.relatedPosts = rankRelatedArticles(normalizedArticle, normalizedIndex, 4);
    const chronologicalArticles = normalizedIndex
      .filter((candidate) => candidate.slug)
      .sort((left, right) => Date.parse(right.publishedAt || right.updatedAt || '') - Date.parse(left.publishedAt || left.updatedAt || ''));
    const currentIndex = chronologicalArticles.findIndex((candidate) => candidate.slug === normalizedArticle.slug);
    normalizedArticle.previousArticle = currentIndex >= 0 ? chronologicalArticles[currentIndex + 1] || null : null;
    normalizedArticle.nextArticle = currentIndex > 0 ? chronologicalArticles[currentIndex - 1] || null : null;
  }

  return {
    data: normalizedArticle
      ? {
          type: 'blog-post',
          article: normalizedArticle,
          localizedPaths,
          header: siteSetting.data?.header || null,
          footer: siteSetting.data?.footer || null,
        }
        : {
          type: 'not-found',
          localizedPaths,
          header: siteSetting.data?.header || null,
          footer: siteSetting.data?.footer || null,
        },
    fallback: articleResult.fallback || articleIndexResult.fallback,
    error: false,
    settings: siteSetting.data,
  };
}

const BLOG_TAXONOMY = Object.freeze({
  category: { contentType: 'categories', relation: 'primaryCategory' },
  author: { contentType: 'authors', relation: 'author' },
  tag: { contentType: 'tags', relation: 'tags' },
});

async function loadBlogTaxonomyPage(pathname, locale, siteSettingPromise) {
  const [, kind, slug] = pathname.match(/^\/blog\/(category|author|tag)\/([^/]+)$/) || [];
  const config = BLOG_TAXONOMY[kind];
  if (!config || !slug) return null;
  const [entityResult, articlesResult, siteSetting] = await Promise.all([
    fetchWithLocaleFallback((activeLocale) => fetchFirstBySlug(config.contentType, activeLocale, slug, { populate: { seo: { populate: { shareImage: true } } } }), locale),
    fetchWithLocaleFallback((activeLocale) => fetchContentIndex('articles', activeLocale, {
      populate: BLOG_ARTICLE_POPULATE,
      filters: { [config.relation]: { slug: { $eq: slug } } },
      sort: ['publishedAt:desc', 'updatedAt:desc'],
      pagination: { pageSize: 100 },
    }), locale),
    siteSettingPromise,
  ]);
  if (!entityResult.data) return null;
  const entity = entityResult.data;
  return {
    data: {
      type: 'blog-list',
      page: { title: entity.name, description: entity.description || entity.bio || '', seo: normalizeSeo(entity.seo) },
      articles: (articlesResult.data || []).map(normalizeArticleData).filter(Boolean),
      taxonomy: { kind, slug, entity },
      localizedPaths: defaultLocalizedPaths(pathname),
      header: siteSetting.data?.header || null,
      footer: siteSetting.data?.footer || null,
    },
    fallback: entityResult.fallback || articlesResult.fallback,
    error: false,
    settings: siteSetting.data,
  };
}

async function loadBlogSearchPage(locale, siteSettingPromise, searchParams = {}) {
  const query = asText(searchParams.q);
  const pageNumber = Math.max(1, Number.parseInt(searchParams.page, 10) || 1);
  const [blogPageResult, siteSetting] = await Promise.all([
    fetchWithLocaleFallback((activeLocale) => fetchSingleType('blog-page', activeLocale, { populate: PAGE_POPULATE }), locale),
    siteSettingPromise,
  ]);
  let searchResult = { data: [], meta: { page: pageNumber, pageSize: 12, pageCount: 1, total: 0 } };
  if (query.length >= 2) {
    searchResult = await request('/api/articles/search', {
      locale, q: query, page: pageNumber, pageSize: 12,
      category: asText(searchParams.category), tag: asText(searchParams.tag),
    }, { next: { revalidate: 60, tags: [cmsCacheTags.blogIndex(locale)] } });
  }
  const page = mergePageWithSiteLayout(blogPageResult.data, siteSetting.data);
  return {
    data: {
      type: 'blog-list', page: { ...page, title: locale === 'ar' ? 'البحث في المقالات' : 'Search insights', description: query ? `${searchResult.meta?.total || 0} results for “${query}”` : '' },
      articles: (searchResult.data || []).map(normalizeArticleData).filter(Boolean), search: { query, ...searchResult.meta },
      localizedPaths: defaultLocalizedPaths('/blog/search'), header: page?.header || siteSetting.data?.header || null, footer: page?.footer || siteSetting.data?.footer || null,
    }, fallback: blogPageResult.fallback, error: false, settings: siteSetting.data,
  };
}

async function loadSingleTypePage(singleType, pathname, locale, siteSettingPromise) {
  const [result, siteSetting] = await Promise.all([
    fetchWithLocaleFallback((activeLocale) => fetchSingleType(singleType, activeLocale, { populate: PAGE_COLLECTION_POPULATE }), locale),
    siteSettingPromise,
  ]);

  const pageData = mergePageWithSiteLayout(result.data, siteSetting.data);
  return {
    data: await hydrateBookCallBlocks(pageData ? { ...pageData, localizedPaths: defaultLocalizedPaths(pathname) } : pageData, locale, pathname),
    fallback: result.fallback,
    error: false,
    settings: siteSetting.data,
  };
}

async function loadGenericSlugPage(pathname, locale, siteSettingPromise) {
  const slug = pageSlugFromPathname(pathname);

  if (!slug || slug.includes('/')) {
    const siteSetting = await siteSettingPromise;
    return buildLayoutOnlyData(siteSetting);
  }

  const [result, siteSetting] = await Promise.all([
    fetchWithLocaleFallback(
      (activeLocale) => getPageBySlug(slug, activeLocale, { populate: PAGE_COLLECTION_POPULATE }),
      locale
    ),
    siteSettingPromise,
  ]);

  const pageData = normalizeOfferBlocks(mergePageWithSiteLayout(result.data, siteSetting.data));
  const localizedPaths = result.data
    ? await resolveEntityLocalizedPaths({ contentType: 'pages', entity: result.data, locale, pathname })
    : defaultLocalizedPaths(pathname);

  return {
    data: await hydrateBookCallBlocks(pageData ? { ...pageData, localizedPaths } : pageData, locale, pathname),
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
  } catch (error) {
    cmsLogger.error('Site settings request failed.', { operation: 'cms.site.load', locale, errorCode: error?.code || 'CMS_SITE_REQUEST_FAILED' });
    return {
      data: null,
      fallback: false,
      error: true,
    };
  }
});

export async function getCmsPage(pathname, locale, options = {}) {
  const normalizedPath = normalizeCmsUrl(pathname || '/');
  const siteSettingPromise = getSiteSetting(locale);
  const singleType = CMS_SINGLE_TYPE_BY_PATH[normalizedPath];

  try {
    if (normalizedPath === '/blog') {
      return await loadBlogListPage(locale, siteSettingPromise);
    }

    if (normalizedPath === '/blog/search') {
      return await loadBlogSearchPage(locale, siteSettingPromise, options.searchParams);
    }

    if (/^\/blog\/(category|author|tag)\//.test(normalizedPath)) {
      const taxonomyPage = await loadBlogTaxonomyPage(normalizedPath, locale, siteSettingPromise);
      if (taxonomyPage) return taxonomyPage;
    }

    if (normalizedPath.startsWith('/blog/')) {
      return await loadBlogArticlePage(normalizedPath, locale, siteSettingPromise);
    }

    if (singleType) {
      return await loadSingleTypePage(singleType, normalizedPath, locale, siteSettingPromise);
    }

    return await loadGenericSlugPage(normalizedPath, locale, siteSettingPromise);
  } catch (error) {
    cmsLogger.error('CMS page request failed.', { operation: 'cms.page.load', locale, route: normalizedPath, errorCode: error?.code || 'CMS_PAGE_REQUEST_FAILED' });
    const siteSetting = await siteSettingPromise;
    return {
      data: mergePageWithSiteLayout(null, siteSetting.data),
      fallback: false,
      error: true,
      settings: siteSetting.data,
    };
  }
}
