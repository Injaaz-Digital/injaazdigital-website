'use strict';

class BookingError extends Error {
  constructor(code, message, status = 400, details) {
    super(message);
    this.name = 'BookingError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

module.exports = () => ({ BookingError });
module.exports.BookingError = BookingError;
