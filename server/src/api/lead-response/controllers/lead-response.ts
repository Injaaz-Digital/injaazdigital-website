import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lead-response.lead-response', ({ strapi }) => ({
  async save(ctx) {
    try {
      const response = await strapi.service('api::lead.lead').saveResponse(ctx.request.body || {});
      ctx.body = { data: response, error: null };
    } catch (error) {
      const code = (error as Error)?.message;

      if (code === 'INVALID_SESSION') {
        return ctx.unauthorized('Invalid session token.');
      }

      if (code === 'QUESTION_NOT_FOUND') {
        return ctx.notFound('Lead question not found.');
      }

      if (code === 'QUESTION_KEY_REQUIRED' || code === 'ANSWER_REQUIRED') {
        return ctx.badRequest('Validation failed', {
          message: code === 'ANSWER_REQUIRED' ? 'Answer is required.' : 'Question key is required.',
        });
      }

      throw error;
    }
  },
}));
