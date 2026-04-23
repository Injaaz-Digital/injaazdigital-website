import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::site-setting.site-setting', {
  config: {
    find: {
      middlewares: ['api::site-setting.site-setting-populate'],
    },
  },
});
