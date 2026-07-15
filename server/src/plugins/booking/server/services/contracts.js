'use strict';

/**
 * Runtime documentation for the plugin's extraction boundary. Implementations are
 * duck-typed so the local plugin remains consumable without a TypeScript build.
 *
 * CalendarProvider: busy(), create(), update(), cancel(), get()
 * NotificationProvider: bookingCreated(), bookingChanged(), bookingCanceled()
 * BookingRepository: acquire(), finalize(), fail(), cancel(), findIdempotent()
 * EligibilityPolicy: assertCanBook()
 */
module.exports = Object.freeze({
  CalendarProvider: ['busy', 'create', 'update', 'cancel', 'get'],
  NotificationProvider: ['bookingCreated', 'bookingChanged', 'bookingCanceled'],
  BookingRepository: ['acquire', 'finalize', 'fail', 'cancel', 'findIdempotent'],
  EligibilityPolicy: ['assertCanBook'],
});
