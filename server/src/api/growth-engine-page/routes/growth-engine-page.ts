import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::growth-engine-page.growth-engine-page', {
  config: {
    find: {
      middlewares: ['api::growth-engine-page.growth-engine-page-populate'],
    },
  },
});
