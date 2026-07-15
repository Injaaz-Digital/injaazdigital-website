'use strict';

module.exports = {
  async runtime(ctx) {
    try {
      const locale = String(ctx.query.locale || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';
      const data = await strapi.plugin('booking').service('stepper').getRuntime(ctx.params.key, locale, false);
      ctx.body = { data, error: null };
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = { data: null, error: { code: error.message, message: error.message } };
    }
  },
};
