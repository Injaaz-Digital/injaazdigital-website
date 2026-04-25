import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lead.lead', ({ strapi }) => ({
  async create(ctx, next) {
    return this.submit(ctx, next);
  },

  async submit(ctx, _next) {
    try {
      const result = await strapi.service('api::lead.lead').submitLegacy((ctx.request.body && ctx.request.body.data) || {});
      ctx.status = 201;
      ctx.body = { data: result, error: null };
    } catch (error) {
      if ((error as any)?.message === 'VALIDATION_ERROR') {
        const details = (error as any).details || { fieldErrors: {}, globalErrors: [] };
        return ctx.badRequest('Validation failed', details);
      }

      throw error;
    }
  },

  async updateContact(ctx) {
    try {
      const result = await strapi.service('api::lead.lead').updateContact(ctx.params.id, ctx.request.body || {});
      ctx.body = { data: result, error: null };
    } catch (error) {
      if ((error as any)?.message === 'INVALID_SESSION') {
        return ctx.unauthorized('Invalid session token.');
      }

      if ((error as any)?.message === 'VALIDATION_ERROR') {
        return ctx.badRequest('Validation failed', (error as any).details || {});
      }

      throw error;
    }
  },

  async complete(ctx) {
    try {
      const result = await strapi.service('api::lead.lead').completeLead(ctx.params.id, ctx.request.body || {});
      ctx.body = { data: result, error: null };
    } catch (error) {
      if ((error as any)?.message === 'INVALID_SESSION') {
        return ctx.unauthorized('Invalid session token.');
      }

      throw error;
    }
  },
}));
