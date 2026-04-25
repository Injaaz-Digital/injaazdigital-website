import { request, requestJson } from '@/lib/strapi/client';

export const fetchAvailabilityRequest = async (date) => {
  const response = await request('/api/calendar/availability', {
    date,
  });

  if (Array.isArray(response?.data)) {
    return {
      date,
      timezone: 'Africa/Casablanca',
      slots: response.data,
    };
  }

  return {
    date: response?.date || date,
    timezone: response?.timezone || 'Africa/Casablanca',
    slots: Array.isArray(response?.slots) ? response.slots : [],
  };
};

export const bookMeetingRequest = async (payload) => {
  const response = await requestJson('/api/calendar/book', {
    method: 'POST',
    body: payload,
  });

  return response?.data || response || null;
};
