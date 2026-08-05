import { factories } from '@strapi/strapi';
import { enrichBookCallSteppers } from '../../../content-system/page-controller';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async find(ctx) {
    const response = await super.find(ctx);
    await enrichBookCallSteppers(strapi, response.data);
    return response;
  },
  async findOne(ctx) {
    const response = await super.findOne(ctx);
    await enrichBookCallSteppers(strapi, response.data);
    return response;
  },
}));
