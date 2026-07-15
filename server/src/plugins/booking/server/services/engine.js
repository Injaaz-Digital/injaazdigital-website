'use strict';

const crypto = require('node:crypto');
const { BookingError } = require('./errors');

const requireString = (value, name, max = 500) => {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized || normalized.length > max) throw new BookingError('VALIDATION_ERROR', `${name} is required.`, 400);
  return normalized;
};

const responseOf = (reservation) => reservation?.responseJson || null;

module.exports = ({ strapi }) => ({
  service(name) { return strapi.plugin('booking').service(name); },

  async setting() {
    const raw = await strapi.service('api::calendar.calendar').getCalendarSetting();
    return strapi.service('api::calendar.calendar').validateCalendarSetting(raw);
  },

  async availability(query = {}) {
    const security = this.service('security');
    const legacy = strapi.service('api::calendar.calendar');
    const setting = await this.setting();
    const decorate = (result) => ({ ...result, slots: (result.slots || []).map((slot) => ({
      ...slot,
      slotToken: security.signSlot({
        calendarId: setting.calendarId, start: new Date(slot.start).toISOString(), end: new Date(slot.end).toISOString(),
        timezone: setting.timezone, duration: setting.meetingDuration, settingsVersion: String(setting.id || 'default'),
      }),
    })) });

    if (query.date) return decorate(await legacy.getAvailability({ date: query.date }));
    const from = requireString(query.from, 'from', 10);
    const to = requireString(query.to, 'to', 10);
    const start = new Date(`${from}T00:00:00Z`);
    const end = new Date(`${to}T00:00:00Z`);
    if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end < start) throw new BookingError('INVALID_DATE', 'Invalid availability range.', 400);
    const days = Math.floor((end.valueOf() - start.valueOf()) / 86400000) + 1;
    if (days > Math.min(setting.maxDaysAhead + 1, 45)) throw new BookingError('INVALID_DATE', 'Availability range is too large.', 400);
    const dates = Array.from({ length: days }, (_, index) => new Date(start.valueOf() + index * 86400000).toISOString().slice(0, 10));
    const results = [];
    for (const date of dates) results.push(decorate(await legacy.getAvailability({ date })));
    return { from, to, timezone: setting.timezone, days: results };
  },

  async prepare(payload, idempotencyHeader, { allowExistingMeeting = false, supersedesReservationId = null } = {}) {
    const security = this.service('security');
    const repository = this.service('repository');
    const leadId = Number(payload.leadId);
    const sessionToken = requireString(payload.sessionToken, 'sessionToken');
    const idempotencyRaw = requireString(idempotencyHeader || payload.idempotencyKey, 'Idempotency-Key', 200);
    const idempotencyKey = security.requestHash({ leadId, idempotencyRaw });
    const requestHash = security.requestHash({ leadId, slotToken: payload.slotToken, action: supersedesReservationId ? 'reschedule' : 'book' });
    const prior = await repository.findIdempotent(idempotencyKey);
    if (prior) {
      if (prior.requestHash !== requestHash) throw new BookingError('IDEMPOTENCY_CONFLICT', 'Idempotency key was already used for another request.', 409);
      if (prior.state === 'confirmed' && responseOf(prior)) return { replay: responseOf(prior), reservation: prior };
      if (prior.state === 'held') throw new BookingError('BOOKING_IN_PROGRESS', 'This booking request is still processing.', 409);
      throw new BookingError(prior.failureCode || 'BOOKING_FAILED', prior.failureMessage || 'The previous booking attempt failed.', 409);
    }

    const lead = allowExistingMeeting
      ? await (async () => { await strapi.service('api::lead.lead').validateSession(leadId, sessionToken); return strapi.entityService.findOne('api::lead.lead', leadId, { populate: { meetings: true } }); })()
      : await this.service('eligibility').assertCanBook(leadId, sessionToken);
    if (!lead) throw new BookingError('LEAD_NOT_FOUND', 'Lead was not found.', 404);
    const slot = security.verifySlot(requireString(payload.slotToken, 'slotToken', 5000));
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end <= start) throw new BookingError('INVALID_SLOT_TOKEN', 'Slot token is invalid.', 400);
    const availability = await strapi.service('api::calendar.calendar').buildAvailabilityForDate(start.toISOString().slice(0, 10));
    const stillAvailable = availability.slots.some((candidate) => new Date(candidate.start).valueOf() === start.valueOf() && new Date(candidate.end).valueOf() === end.valueOf());
    if (!stillAvailable) throw new BookingError('SLOT_UNAVAILABLE', 'Selected slot is no longer available.', 409);
    const setting = await this.setting();
    if (slot.calendarId !== setting.calendarId || slot.timezone !== setting.timezone) throw new BookingError('SLOT_UNAVAILABLE', 'Calendar settings changed; choose the slot again.', 409);
    const slotKey = security.slotKey(setting.calendarId, start.toISOString());
    const reservation = await repository.acquire({
      leadId, slotKey, activeSlotKey: slotKey, idempotencyKey, requestHash,
      operationId: security.operationId(idempotencyRaw, leadId), state: 'held', start: start.toISOString(), end: end.toISOString(),
      timezone: setting.timezone, calendarId: setting.calendarId, holdExpiresAt: new Date(Date.now() + Number(process.env.BOOKING_HOLD_SECONDS || 120) * 1000).toISOString(),
      providerSyncState: 'pending', supersedesReservationId,
    });
    if (reservation.requestHash !== requestHash) throw new BookingError('IDEMPOTENCY_CONFLICT', 'Idempotency key was already used for another request.', 409);
    return { lead, setting, start, end, reservation };
  },

  async book(payload, idempotencyHeader, requestId = '') {
    const prepared = await this.prepare(payload, idempotencyHeader);
    if (prepared.replay) return prepared.replay;
    const { lead, setting, start, end, reservation } = prepared;
    const repository = this.service('repository');
    const provider = this.service('google-provider');
    let event = null;
    try {
      const localAllowed = process.env.NODE_ENV !== 'production' || process.env.BOOKING_EMERGENCY_LOCAL_ONLY === 'true';
      if (!provider.isConfigured() && !localAllowed) throw new BookingError('GOOGLE_CALENDAR_NOT_CONFIGURED', 'Google Calendar is not configured.', 503);
      if (provider.isConfigured()) event = await provider.create({
        lead, start: start.toISOString(), end: end.toISOString(), timezone: setting.timezone, calendarId: setting.calendarId,
        meetingTitle: setting.meetingTitle, meetingLocation: setting.meetingLocation, autoCreateGoogleMeet: setting.autoCreateGoogleMeet,
        serviceInterest: lead.serviceInterest, score: lead.score, answersJson: lead.answersJson || {}, operationId: reservation.operationId,
      });
    } catch (error) {
      await repository.fail(reservation.id, error.code || 'GOOGLE_CALENDAR_FAILED', error.message);
      await repository.audit(reservation, 'provider_create_failed', 'system', { code: error.code || 'GOOGLE_CALENDAR_FAILED' }, requestId);
      if (error instanceof BookingError) throw error;
      throw new BookingError('GOOGLE_CALENDAR_FAILED', 'Google Calendar event creation failed.', 502);
    }

    const meetLink = event?.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri || event?.hangoutLink || null;
    let meeting;
    try {
      meeting = await strapi.db.transaction(async ({ trx }) => {
        const created = await strapi.db.query('api::meeting.meeting').create({ data: {
          lead: lead.id, start: start.toISOString(), end: end.toISOString(), duration: Math.round((end - start) / 60000), status: 'scheduled',
          meetLink, googleEventId: event?.id || null, googleHtmlLink: event?.htmlLink || null,
        }, transacting: trx });
        await strapi.db.query('api::lead.lead').update({ where: { id: lead.id }, data: { status: 'booked', meetingDate: start.toISOString(), meetingLink: meetLink, lastActivityAt: new Date().toISOString() }, transacting: trx });
        return created;
      });
    } catch (error) {
      await repository.fail(reservation.id, 'LOCAL_FINALIZATION_FAILED', 'Local booking finalization failed.', event?.id);
      if (event?.id) try { await provider.cancel({ eventId: event.id, calendarId: setting.calendarId, notifyAttendees: false }); } catch { /* reconciliation retries compensation */ }
      throw new BookingError('BOOKING_FAILED', 'Booking could not be finalized.', 500);
    }
    const response = { meetingId: meeting.id, reservationId: reservation.id, status: 'booked', start: start.toISOString(), end: end.toISOString(), duration: Math.round((end - start) / 60000), timezone: setting.timezone, meetLink, googleEventId: event?.id || null, googleHtmlLink: event?.htmlLink || null, email: lead.email || null };
    const finalized = await repository.finalize(reservation.id, { meetingId: meeting.id, providerEventId: event?.id || null, responseJson: response });
    await repository.audit(finalized, 'confirmed', 'lead', {}, requestId);
    return response;
  },

  async cancel(meetingId, payload, idempotencyHeader, requestId = '') {
    const repository = this.service('repository');
    const leadId = Number(payload.leadId);
    await strapi.service('api::lead.lead').validateSession(leadId, payload.sessionToken);
    const reservation = await strapi.db.query('plugin::booking.reservation').findOne({ where: { meetingId: Number(meetingId), leadId } });
    if (!reservation) throw new BookingError('BOOKING_NOT_FOUND', 'Booking was not found.', 404);
    const idem = requireString(idempotencyHeader || payload.idempotencyKey, 'Idempotency-Key', 200);
    const reason = String(payload.reason || '').trim().slice(0, 1000);
    const mutationKey = this.service('security').requestHash({ leadId, idempotencyRaw: idem, action: 'cancel' });
    const mutationHash = this.service('security').requestHash({ meetingId: Number(meetingId), leadId, reason });
    if (reservation.lastMutationKey === mutationKey) {
      if (reservation.lastMutationHash !== mutationHash) throw new BookingError('IDEMPOTENCY_CONFLICT', 'Idempotency key was already used for another request.', 409);
      return reservation.responseJson || { meetingId: Number(meetingId), status: 'canceled' };
    }
    if (reservation.state === 'canceled') return reservation.responseJson || { meetingId: Number(meetingId), status: 'canceled' };
    if (reservation.providerEventId) await this.service('google-provider').cancel({ eventId: reservation.providerEventId, calendarId: reservation.calendarId, notifyAttendees: true });
    await strapi.db.transaction(async ({ trx }) => {
      await strapi.db.query('api::meeting.meeting').update({ where: { id: Number(meetingId) }, data: { status: 'canceled', cancelReason: reason }, transacting: trx });
      await strapi.db.query('api::lead.lead').update({ where: { id: leadId }, data: { status: 'qualified', meetingDate: null, meetingLink: null, lastActivityAt: new Date().toISOString() }, transacting: trx });
    });
    const response = { meetingId: Number(meetingId), status: 'canceled' };
    const canceled = await repository.cancel(reservation.id, reason);
    await repository.update(canceled.id, { responseJson: response, lastMutationKey: mutationKey, lastMutationHash: mutationHash });
    await repository.audit(canceled, 'canceled', 'lead', { reason }, requestId);
    return response;
  },

  async reschedule(meetingId, payload, idempotencyHeader, requestId = '') {
    const leadId = Number(payload.leadId);
    await strapi.service('api::lead.lead').validateSession(leadId, payload.sessionToken);
    const old = await strapi.db.query('plugin::booking.reservation').findOne({ where: { meetingId: Number(meetingId), leadId, state: 'confirmed' } });
    if (!old) throw new BookingError('BOOKING_NOT_FOUND', 'Booking was not found.', 404);
    const prepared = await this.prepare(payload, idempotencyHeader, { allowExistingMeeting: true, supersedesReservationId: old.id });
    if (prepared.replay) return prepared.replay;
    const { setting, start, end, reservation } = prepared;
    const repository = this.service('repository');
    try {
      if (old.providerEventId) await this.service('google-provider').update({ eventId: old.providerEventId, start: start.toISOString(), end: end.toISOString(), timezone: setting.timezone, calendarId: setting.calendarId });
      const meeting = await strapi.db.transaction(async ({ trx }) => {
        await strapi.db.query('api::meeting.meeting').update({ where: { id: Number(meetingId) }, data: { status: 'canceled', cancelReason: 'rescheduled' }, transacting: trx });
        const created = await strapi.db.query('api::meeting.meeting').create({ data: { lead: leadId, start: start.toISOString(), end: end.toISOString(), duration: Math.round((end - start) / 60000), status: 'scheduled', googleEventId: old.providerEventId || null }, transacting: trx });
        await strapi.db.query('api::lead.lead').update({ where: { id: leadId }, data: { status: 'booked', meetingDate: start.toISOString(), lastActivityAt: new Date().toISOString() }, transacting: trx });
        return created;
      });
      await repository.cancel(old.id, 'rescheduled');
      const response = { meetingId: meeting.id, previousMeetingId: Number(meetingId), reservationId: reservation.id, status: 'booked', start: start.toISOString(), end: end.toISOString(), timezone: setting.timezone };
      const finalized = await repository.finalize(reservation.id, { meetingId: meeting.id, providerEventId: old.providerEventId || null, responseJson: response });
      await repository.audit(finalized, 'rescheduled', 'lead', { previousReservationId: old.id }, requestId);
      return response;
    } catch (error) {
      await repository.fail(reservation.id, 'RESCHEDULE_FAILED', 'Rescheduling failed.');
      throw error instanceof BookingError ? error : new BookingError('RESCHEDULE_FAILED', 'Rescheduling failed.', 502);
    }
  },
});
