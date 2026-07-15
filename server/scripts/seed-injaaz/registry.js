'use strict';

const UIDS = {
  siteSetting: 'api::site-setting.site-setting',
  blogPage: 'api::blog-page.blog-page',
  calendarSetting: 'api::calendar-setting.calendar-setting',
  leadQuestion: 'api::lead-question.lead-question',
  page: 'api::page.page',
  article: 'api::article.article',
  author: 'api::author.author',
  tag: 'api::tag.tag',
  offer: 'api::offer.offer',
};

const SINGLE_TYPE_UIDS = [
  UIDS.siteSetting,
  UIDS.blogPage,
];

module.exports = {
  UIDS,
  SINGLE_TYPE_UIDS,
};
