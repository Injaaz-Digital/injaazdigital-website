import { factories } from '@strapi/strapi';

const enrichBookCallSteppers = async (strapi: any, value: any) => {
  const entries = Array.isArray(value) ? value : value ? [value] : [];
  await Promise.all(entries.map(async (entry) => {
    const blocks = Array.isArray(entry?.blocks) ? entry.blocks : [];
    await Promise.all(blocks.map(async (block: any) => {
      if (block?.__component !== 'section.book-call' || !block.id) return;
      const component = await strapi.db.query('section.book-call').findOne({ where: { id: block.id }, populate: { stepper: true } });
      const stepper = component?.stepper;
      block.stepper = stepper?.status === 'published'
        ? { key: stepper.key, name: stepper.name, status: stepper.status, version: stepper.version }
        : null;
    }));
  }));
  return value;
};

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
