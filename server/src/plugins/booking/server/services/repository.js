'use strict';

const { BookingError } = require('./errors');
const UID = 'plugin::booking.reservation';

const isUniqueViolation = (error) => ['23505', 'SQLITE_CONSTRAINT_UNIQUE'].includes(String(error?.code)) || /unique/i.test(String(error?.message || ''));

module.exports = ({ strapi }) => ({
  async findIdempotent(idempotencyKey) {
    return strapi.db.query(UID).findOne({ where: { idempotencyKey } });
  },

  async acquire(data) {
    try {
      return await strapi.db.transaction(async ({ trx }) => strapi.db.query(UID).create({ data, transacting: trx }));
    } catch (error) {
      if (isUniqueViolation(error)) {
        const replay = await this.findIdempotent(data.idempotencyKey);
        if (replay) return replay;
        throw new BookingError('SLOT_UNAVAILABLE', 'Selected slot is no longer available.', 409);
      }
      throw error;
    }
  },

  async update(id, data) {
    return strapi.db.query(UID).update({ where: { id }, data });
  },

  async finalize(id, data) {
    return this.update(id, { ...data, state: 'confirmed', providerSyncState: 'synced' });
  },

  async fail(id, code, message, providerEventId) {
    return this.update(id, {
      state: 'failed', activeSlotKey: null, failureCode: code, failureMessage: String(message || '').slice(0, 2000),
      providerEventId: providerEventId || null, providerSyncState: providerEventId ? 'compensate' : 'retry',
      nextRetryAt: new Date(Date.now() + 60000).toISOString(),
    });
  },

  async cancel(id, reason) {
    return this.update(id, { state: 'canceled', activeSlotKey: null, canceledAt: new Date().toISOString(), cancelReason: reason, providerSyncState: 'synced' });
  },

  async audit(reservation, action, actor, metadata = {}, requestId = '') {
    return strapi.db.query('plugin::booking.audit').create({ data: {
      reservationId: reservation.id, meetingId: reservation.meetingId || null, leadId: reservation.leadId,
      action, actor, requestId, metadata,
    }});
  },
});
