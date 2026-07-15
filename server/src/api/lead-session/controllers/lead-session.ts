import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lead-session.lead-session', ({ strapi }) => ({
  async start(ctx) {
    strapi.plugin('booking').service('rate-limit').consume(
      `session:${ctx.ip}`,
      Number(process.env.BOOKING_SESSION_RATE_LIMIT || 10),
      60_000
    );
    try {
      const session = await strapi.service('api::lead.lead').startSession(ctx.request.body || {});
      ctx.status = 201;
      ctx.body = { data: session, error: null };
    } catch (error) {
      if ((error as Error).message === 'STEPPER_VERSION_CHANGED') {
        ctx.status = 409;
        ctx.body = { data: null, error: { code: 'STEPPER_VERSION_CHANGED', message: 'The booking questions were updated. Refresh and try again.' } };
        return;
      }
      throw error;
    }
  },
}));
