import { request, requestJson } from '@/lib/strapi/client';

const normalizeSlot = (slot) => ({
  start: String(slot?.start || ''),
  end: String(slot?.end || ''),
  label: String(slot?.label || '').trim(),
});

export const fetchAvailability = async ({ date }) => {
  const response = await request('/api/calendar/availability', {
    date,
  });
  const payload = response?.data || response;

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
  const response = await request('/api/calendar/availability', { from, to });
  return response?.data || response;
};

export const fetchBookingPresentationConfig = async () => {
  const response = await request('/api/calendar/config');
  return response?.data || response || null;
};

export const bookMeeting = async (payload) => {
  const idempotencyKey = payload.idempotencyKey || crypto.randomUUID();
  const { idempotencyKey: _discarded, ...body } = payload;
  const response = await requestJson('/api/calendar/book', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body,
  });

  return response?.data || response || null;
};

export const cancelMeeting = async ({ meetingId, ...payload }) => {
  const response = await requestJson(`/api/calendar/bookings/${meetingId}/cancel`, {
    method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() }, body: payload,
  });
  return response?.data || response;
};

export const rescheduleMeeting = async ({ meetingId, ...payload }) => {
  const response = await requestJson(`/api/calendar/bookings/${meetingId}/reschedule`, {
    method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() }, body: payload,
  });
  return response?.data || response;
};

export const fetchAvailabilityRequest = (date) => fetchAvailability({ date });
export const bookMeetingRequest = bookMeeting;
