'use strict';

const { BookingError } = require('./errors');
const buckets = new Map();

module.exports = () => ({
  consume(key, limit = 60, windowMs = 60000) {
    const now = Date.now();
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }
    current.count += 1;
    if (current.count > limit) throw new BookingError('RATE_LIMITED', 'Too many booking requests.', 429, { retryAfter: Math.ceil((current.resetAt - now) / 1000) });
    if (buckets.size > 10000) for (const [bucketKey, value] of buckets) if (value.resetAt <= now) buckets.delete(bucketKey);
  },
});
