'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const securityFactory = require('../services/security');
const rateLimitFactory = require('../services/rate-limit');

test('slot tokens are signed and round-trip their normalized payload', () => {
  process.env.BOOKING_SLOT_SECRET = 'test-only-secret';
  process.env.BOOKING_SLOT_TOKEN_TTL_SECONDS = '600';
  const security = securityFactory({ strapi: {} });
  const token = security.signSlot({ calendarId: 'primary', start: '2026-07-13T08:00:00.000Z', end: '2026-07-13T08:30:00.000Z', timezone: 'Africa/Casablanca', duration: 30 });
  const payload = security.verifySlot(token);
  assert.equal(payload.calendarId, 'primary');
  assert.equal(payload.duration, 30);
});

test('slot token tampering is rejected', () => {
  process.env.BOOKING_SLOT_SECRET = 'test-only-secret';
  const security = securityFactory({ strapi: {} });
  const token = security.signSlot({ calendarId: 'primary', start: '2026-07-13T08:00:00.000Z', end: '2026-07-13T08:30:00.000Z' });
  assert.throws(() => security.verifySlot(`${token}x`), (error) => error.code === 'INVALID_SLOT_TOKEN');
});

test('expired slot tokens are rejected', () => {
  process.env.BOOKING_SLOT_SECRET = 'test-only-secret';
  process.env.BOOKING_SLOT_TOKEN_TTL_SECONDS = '-1';
  const security = securityFactory({ strapi: {} });
  const token = security.signSlot({ calendarId: 'primary', start: '2026-07-13T08:00:00.000Z', end: '2026-07-13T08:30:00.000Z' });
  assert.throws(() => security.verifySlot(token), (error) => error.code === 'SLOT_TOKEN_EXPIRED');
});

test('rate limiter rejects requests beyond the configured bucket capacity', () => {
  const limiter = rateLimitFactory();
  limiter.consume('test-bucket', 1, 60000);
  assert.throws(() => limiter.consume('test-bucket', 1, 60000), (error) => error.code === 'RATE_LIMITED');
});
