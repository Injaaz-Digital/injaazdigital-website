import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::offer.offer', {
  config: {
    find: { middlewares: ['api::offer.offer-populate'] },
    findOne: { middlewares: ['api::offer.offer-populate'] },
  },
});
