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

  if (Array.isArray(response?.data)) {
    return {
      date,
      timezone: 'Africa/Casablanca',
      slots: response.data.map(normalizeSlot).filter((slot) => slot.start && slot.end),
    };
  }

  return {
    date: response?.date || date,
    timezone: response?.timezone || 'Africa/Casablanca',
    slots: Array.isArray(response?.slots)
      ? response.slots.map(normalizeSlot).filter((slot) => slot.start && slot.end)
      : [],
  };
};

export const bookMeeting = async (payload) => {
  const response = await requestJson('/api/calendar/book', {
    method: 'POST',
    body: payload,
  });

  return response?.data || response || null;
};

export const fetchAvailabilityRequest = (date) => fetchAvailability({ date });
export const bookMeetingRequest = bookMeeting;
