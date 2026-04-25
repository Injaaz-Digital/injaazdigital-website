import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::lead-question.lead-question', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
