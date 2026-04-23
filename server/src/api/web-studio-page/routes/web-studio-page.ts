import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::web-studio-page.web-studio-page', {
  config: {
    find: {
      middlewares: ['api::web-studio-page.web-studio-page-populate'],
    },
  },
});
