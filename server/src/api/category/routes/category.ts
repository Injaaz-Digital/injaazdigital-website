import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::category.category' as any, {
  config: {
    find: { middlewares: ['api::category.category-populate'] },
    findOne: { middlewares: ['api::category.category-populate'] },
  },
});
