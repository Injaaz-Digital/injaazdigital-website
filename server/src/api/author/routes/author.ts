import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::author.author', {
  config: {
    find: {
      middlewares: ['api::author.author-populate'],
    },
    findOne: {
      middlewares: ['api::author.author-populate'],
    },
  },
});
