export const CONTENT_UID = {
  siteSetting: 'api::site-setting.site-setting',
  homePage: 'api::home-page.home-page',
  growthEnginePage: 'api::growth-engine-page.growth-engine-page',
  webStudioPage: 'api::web-studio-page.web-studio-page',
  aboutPage: 'api::about-page.about-page',
  blogPage: 'api::blog-page.blog-page',
  bookingPageSetting: 'api::booking-page-setting.booking-page-setting',
  page: 'api::page.page',
  article: 'api::article.article',
  author: 'api::author.author',
  tag: 'api::tag.tag',
  lead: 'api::lead.lead',
} as const;

export const SINGLE_TYPE_PAGE_UIDS = [
  CONTENT_UID.homePage,
  CONTENT_UID.growthEnginePage,
  CONTENT_UID.webStudioPage,
  CONTENT_UID.aboutPage,
  CONTENT_UID.blogPage,
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
]);
