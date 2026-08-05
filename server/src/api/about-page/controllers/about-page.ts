import { factories } from '@strapi/strapi';
import { enrichBookCallSteppers } from '../../../content-system/page-controller';

export default factories.createCoreController('api::about-page.about-page' as any, ({ strapi }) => ({
  async find(ctx) {
    const response = await super.find(ctx);
    await enrichBookCallSteppers(strapi, response.data);
    return response;
  },
}));
