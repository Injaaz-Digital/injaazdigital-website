'use strict';

const UIDS = {
  siteSetting: 'api::site-setting.site-setting',
  blogPage: 'api::blog-page.blog-page',
  homePage: 'api::home-page.home-page',
  aboutPage: 'api::about-page.about-page',
  calendarSetting: 'api::calendar-setting.calendar-setting',
  leadQuestion: 'api::lead-question.lead-question',
  page: 'api::page.page',
  article: 'api::article.article',
  author: 'api::author.author',
  tag: 'api::tag.tag',
  category: 'api::category.category',
  offer: 'api::offer.offer',
};

const SINGLE_TYPE_UIDS = [
  UIDS.siteSetting,
  UIDS.blogPage,
  UIDS.homePage,
  UIDS.aboutPage,
];

module.exports = {
  UIDS,
  SINGLE_TYPE_UIDS,
};
