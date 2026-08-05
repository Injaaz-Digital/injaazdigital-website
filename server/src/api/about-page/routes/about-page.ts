import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::about-page.about-page' as any, {
  config: { find: { middlewares: ['api::about-page.about-page-populate'] } },
});
