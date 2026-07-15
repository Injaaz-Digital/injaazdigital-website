'use strict';

module.exports = ({ strapi }) => ({
  async backfillOpenMeetings() {
    const meetings = await strapi.db.query('api::meeting.meeting').findMany({
      where: { status: { $in: ['scheduled', 'rescheduled'] } }, populate: { lead: true }, limit: 1000,
    });
    const security = strapi.plugin('booking').service('security');
    const setting = await strapi.service('api::calendar.calendar').getCalendarSetting();
    const calendarId = setting.googleCalendarId || setting.calendarId || process.env.GOOGLE_CALENDAR_ID || 'primary';
    const timezone = setting.timezone || process.env.GOOGLE_CALENDAR_TIMEZONE || 'Africa/Casablanca';
    for (const meeting of meetings) {
      if (!meeting.lead?.id) continue;
      const exists = await strapi.db.query('plugin::booking.reservation').findOne({ where: { meetingId: meeting.id } });
      if (exists) continue;
      const slotKey = security.slotKey(calendarId, meeting.start);
      try {
        await strapi.db.query('plugin::booking.reservation').create({ data: {
          leadId: meeting.lead.id, meetingId: meeting.id, slotKey, activeSlotKey: slotKey,
          idempotencyKey: security.requestHash({ migration: 'meeting', id: meeting.id }),
          requestHash: security.requestHash({ meetingId: meeting.id, start: meeting.start, end: meeting.end }),
          operationId: `migration-${meeting.id}`, state: 'confirmed', start: meeting.start, end: meeting.end,
          timezone, calendarId, holdExpiresAt: meeting.end, providerEventId: meeting.googleEventId || null,
          providerSyncState: meeting.googleEventId ? 'synced' : 'not_required',
          responseJson: { meetingId: meeting.id, status: 'booked', start: meeting.start, end: meeting.end, timezone, meetLink: meeting.meetLink || null },
        }});
      } catch (error) {
        strapi.log.warn(`[booking] Could not backfill meeting ${meeting.id}: ${String(error?.message || error)}`);
      }
    }
  },

  async cleanupExpiredHolds() {
    const now = new Date().toISOString();
    const expired = await strapi.db.query('plugin::booking.reservation').findMany({ where: { state: 'held', holdExpiresAt: { $lt: now } }, limit: 200 });
    for (const reservation of expired) {
      await strapi.plugin('booking').service('repository').update(reservation.id, { state: 'expired', activeSlotKey: null, providerSyncState: 'not_required', failureCode: 'HOLD_EXPIRED' });
      await strapi.plugin('booking').service('repository').audit(reservation, 'hold_expired', 'system');
    }
  },

  async reconcile() {
    const provider = strapi.plugin('booking').service('google-provider');
    if (!provider.isConfigured()) return;
    const now = new Date().toISOString();
    const candidates = await strapi.db.query('plugin::booking.reservation').findMany({
      where: { $or: [
        { providerSyncState: { $in: ['retry', 'compensate'] }, nextRetryAt: { $lte: now } },
        { state: 'confirmed', providerSyncState: 'synced' },
      ] },
      orderBy: { updatedAt: 'asc' }, limit: 100,
    });
    for (const reservation of candidates) {
      try {
        if (reservation.providerSyncState === 'compensate' && reservation.providerEventId) {
          await provider.cancel({ eventId: reservation.providerEventId, calendarId: reservation.calendarId, notifyAttendees: false });
          await strapi.plugin('booking').service('repository').update(reservation.id, { providerSyncState: 'not_required', nextRetryAt: null });
          continue;
        }
        if (!reservation.providerEventId) continue;
        const event = await provider.get({ eventId: reservation.providerEventId, calendarId: reservation.calendarId });
        const moved = event?.start?.dateTime && new Date(event.start.dateTime).valueOf() !== new Date(reservation.start).valueOf();
        const canceled = event?.status === 'cancelled';
        await strapi.plugin('booking').service('repository').update(reservation.id, { providerSyncState: moved || canceled ? 'warning' : 'synced', failureCode: moved ? 'PROVIDER_EVENT_MOVED' : canceled ? 'PROVIDER_EVENT_CANCELED' : null });
      } catch (error) {
        const retryCount = Number(reservation.retryCount || 0) + 1;
        const delay = Math.min(3600, 30 * 2 ** Math.min(retryCount, 7));
        await strapi.plugin('booking').service('repository').update(reservation.id, {
          providerSyncState: retryCount >= 8 ? 'warning' : reservation.providerSyncState,
          retryCount, nextRetryAt: new Date(Date.now() + delay * 1000).toISOString(), failureCode: 'RECONCILIATION_FAILED',
        });
      }
    }
  },
});
