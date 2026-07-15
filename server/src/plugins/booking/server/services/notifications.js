'use strict';

// Google Calendar sends attendee updates for create/update/delete operations.
module.exports = () => ({
  async bookingCreated() {},
  async bookingChanged() {},
  async bookingCanceled() {},
});
