'use strict';

const crypto = require('node:crypto');
const { BookingError } = require('./errors');

const stable = (value) => JSON.stringify(value, Object.keys(value).sort());
const digest = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');
const base64url = (value) => Buffer.from(value).toString('base64url');

module.exports = ({ strapi }) => ({
  requestHash(value) {
    return digest(stable(value));
  },

  slotKey(calendarId, start) {
    return digest(`${calendarId}|${new Date(start).toISOString()}`);
  },

  operationId(idempotencyKey, leadId) {
    return `injaaz-${digest(`${leadId}|${idempotencyKey}`).slice(0, 40)}`;
  },

  signSlot(input) {
    const ttlSeconds = Number(process.env.BOOKING_SLOT_TOKEN_TTL_SECONDS || 600);
    const payload = { ...input, exp: Math.floor(Date.now() / 1000) + ttlSeconds, v: 1 };
    const encoded = base64url(JSON.stringify(payload));
    const secret = process.env.BOOKING_SLOT_SECRET || process.env.APP_KEYS?.split(',')[0];
    if (!secret) throw new BookingError('BOOKING_NOT_CONFIGURED', 'Booking slot secret is not configured.', 503);
    const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
    return `${encoded}.${signature}`;
  },

  verifySlot(token) {
    const [encoded, signature] = String(token || '').split('.');
    const secret = process.env.BOOKING_SLOT_SECRET || process.env.APP_KEYS?.split(',')[0];
    if (!encoded || !signature || !secret) throw new BookingError('INVALID_SLOT_TOKEN', 'Slot token is invalid.', 400);
    const expected = crypto.createHmac('sha256', secret).update(encoded).digest();
    const supplied = Buffer.from(signature, 'base64url');
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
      throw new BookingError('INVALID_SLOT_TOKEN', 'Slot token is invalid.', 400);
    }
    let payload;
    try { payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')); } catch { throw new BookingError('INVALID_SLOT_TOKEN', 'Slot token is invalid.', 400); }
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      throw new BookingError('SLOT_TOKEN_EXPIRED', 'Slot token has expired.', 409);
    }
    return payload;
  },

  hashSessionToken(token) {
    const pepper = process.env.BOOKING_SESSION_PEPPER || process.env.APP_KEYS?.split(',')[0] || '';
    return digest(`${pepper}|${token}`);
  },
});
