import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::booking-page-setting.booking-page-setting', {
  config: {
    find: {
      auth: false,
    },
  },
});
