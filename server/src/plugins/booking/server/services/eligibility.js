'use strict';

const { BookingError } = require('./errors');

module.exports = ({ strapi }) => ({
  async assertCanBook(leadId, sessionToken) {
    await strapi.service('api::lead.lead').validateSession(leadId, sessionToken);
    const lead = await strapi.entityService.findOne('api::lead.lead', Number(leadId), { populate: { meetings: true } });
    if (!lead || lead.status !== 'qualified') throw new BookingError('LEAD_NOT_QUALIFIED', 'Lead is not qualified for booking.', 403);
    const open = (lead.meetings || []).some((meeting) => ['scheduled', 'rescheduled'].includes(meeting.status));
    if (open) throw new BookingError('LEAD_ALREADY_BOOKED', 'Lead already has an open meeting.', 409);
    return lead;
  },
});
