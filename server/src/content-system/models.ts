export const CONTENT_UID = {
  siteSetting: 'api::site-setting.site-setting',
  blogPage: 'api::blog-page.blog-page',
  homePage: 'api::home-page.home-page',
  aboutPage: 'api::about-page.about-page',
  page: 'api::page.page',
  article: 'api::article.article',
  author: 'api::author.author',
  tag: 'api::tag.tag',
  category: 'api::category.category',
  offer: 'api::offer.offer',
  lead: 'api::lead.lead',
} as const;

export const SINGLE_TYPE_PAGE_UIDS = [
  CONTENT_UID.blogPage,
  CONTENT_UID.homePage,
  CONTENT_UID.aboutPage,
] as const;

export const LAYOUTED_CONTENT_UIDS = [
  ...SINGLE_TYPE_PAGE_UIDS,
  CONTENT_UID.page,
] as const;

export const COMPONENT_SAFE_MODELS = new Set<string>([
  CONTENT_UID.siteSetting,
  ...LAYOUTED_CONTENT_UIDS,
  CONTENT_UID.article,
  CONTENT_UID.author,
  CONTENT_UID.tag,
  CONTENT_UID.category,
  CONTENT_UID.offer,
]);
