import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::tag.tag', {
  config: {
    find: {
      middlewares: ['api::tag.tag-populate'],
    },
    findOne: {
      middlewares: ['api::tag.tag-populate'],
    },
  },
});
