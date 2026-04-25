import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lead-session.lead-session', ({ strapi }) => ({
  async start(ctx) {
    const session = await strapi.service('api::lead.lead').startSession(ctx.request.body || {});
    ctx.status = 201;
    ctx.body = { data: session, error: null };
  },
}));
