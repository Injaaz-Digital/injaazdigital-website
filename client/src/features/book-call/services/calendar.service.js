import { bookingRequest } from '@/lib/booking/client';

const normalizeSlot = (slot) => ({
  start: String(slot?.start || ''),
  end: String(slot?.end || ''),
  label: String(slot?.label || '').trim(),
});

export const fetchAvailability = async ({ date }) => {
  const payload = await bookingRequest('/availability', { query: { date }, cache: 'no-store' });

  if (Array.isArray(payload)) {
    return {
      date,
      timezone: 'Africa/Casablanca',
      slots: payload.map(normalizeSlot).filter((slot) => slot.start && slot.end),
    };
  }

  return {
    date: payload?.date || date,
    timezone: payload?.timezone || 'Africa/Casablanca',
    slots: Array.isArray(payload?.slots)
      ? payload.slots.map((slot) => ({ ...normalizeSlot(slot), slotToken: slot.slotToken || '' })).filter((slot) => slot.start && slot.end)
      : [],
  };
};

export const fetchAvailabilityRange = async ({ from, to }) => {
  return bookingRequest('/availability', { query: { from, to }, cache: 'no-store' });
};

export const fetchBookingPresentationConfig = async () => {
  return bookingRequest('/config', { cache: 'no-store' });
};

export const bookMeeting = async (payload) => {
  const idempotencyKey = payload.idempotencyKey || crypto.randomUUID();
  const { idempotencyKey: _discarded, ...body } = payload;
  return bookingRequest('/meetings', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body,
    cache: 'no-store',
  });
};

export const cancelMeeting = async ({ meetingId, ...payload }) => {
  const idempotencyKey = payload.idempotencyKey || crypto.randomUUID();
  const { idempotencyKey: _discarded, ...body } = payload;
  return bookingRequest(`/meetings/${encodeURIComponent(meetingId)}/cancel`, {
    method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body, cache: 'no-store',
  });
};

export const rescheduleMeeting = async ({ meetingId, ...payload }) => {
  const idempotencyKey = payload.idempotencyKey || crypto.randomUUID();
  const { idempotencyKey: _discarded, ...body } = payload;
  return bookingRequest(`/meetings/${encodeURIComponent(meetingId)}/reschedule`, {
    method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body, cache: 'no-store',
  });
};

export const fetchAvailabilityRequest = (date) => fetchAvailability({ date });
export const bookMeetingRequest = bookMeeting;
