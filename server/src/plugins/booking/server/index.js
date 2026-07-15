'use strict';

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    try {
      let defaultStepper = await strapi.db.query('plugin::booking.stepper').findOne({ where: { key: 'default-website-qualification' } });
      if (!defaultStepper) {
        defaultStepper = await strapi.db.query('plugin::booking.stepper').create({ data: {
          name: 'Default Website Qualification', key: 'default-website-qualification',
          description: 'General qualification flow used by the main website.', status: 'draft', version: 0,
          qualificationEnabled: true, qualificationThreshold: 8,
          contactFields: strapi.plugin('booking').service('stepper').normalizeContactFields({}),
        } });
      }
      const unassigned = await strapi.db.query('api::lead-question.lead-question').findMany({ where: { stepper: { $null: true } } });
      await Promise.all(unassigned.map((question) => strapi.db.query('api::lead-question.lead-question').update({ where: { id: question.id }, data: { stepper: defaultStepper.id } })));
      if (defaultStepper.status !== 'published' && unassigned.length) {
        await strapi.plugin('booking').service('stepper').publish(defaultStepper.id);
      }
    } catch (error) {
      strapi.log.warn(`[booking] Default stepper migration deferred: ${String(error?.message || error)}`);
    }
    strapi.cron.add({
      bookingExpiredHolds: { task: () => strapi.plugin('booking').service('jobs').cleanupExpiredHolds(), options: { rule: '*/1 * * * *' } },
      bookingReconciliation: { task: () => strapi.plugin('booking').service('jobs').reconcile(), options: { rule: '*/5 * * * *' } },
    });
    if (String(process.env.BOOKING_ENGINE_V2 || '').toLowerCase() === 'true') {
      try {
        await strapi.plugin('booking').service('jobs').backfillOpenMeetings();
      } catch (error) {
        strapi.log.warn(`[booking] Open-meeting backfill deferred: ${String(error?.message || error)}`);
      }
    }
  },
  destroy() {},
  config: { default: {}, validator() {} },
  contentTypes: require('./content-types'),
  controllers: require('./controllers'),
  routes: require('./routes'),
  services: require('./services'),
};
