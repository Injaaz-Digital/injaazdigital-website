'use strict';

const UIDS = {
  siteSetting: 'api::site-setting.site-setting',
  homePage: 'api::home-page.home-page',
  growthEnginePage: 'api::growth-engine-page.growth-engine-page',
  webStudioPage: 'api::web-studio-page.web-studio-page',
  aboutPage: 'api::about-page.about-page',
  blogPage: 'api::blog-page.blog-page',
  page: 'api::page.page',
  article: 'api::article.article',
  author: 'api::author.author',
  tag: 'api::tag.tag',
};

const SINGLE_TYPE_UIDS = [
  UIDS.siteSetting,
  UIDS.homePage,
  UIDS.growthEnginePage,
  UIDS.webStudioPage,
  UIDS.aboutPage,
  UIDS.blogPage,
];

module.exports = {
  UIDS,
  SINGLE_TYPE_UIDS,
};
