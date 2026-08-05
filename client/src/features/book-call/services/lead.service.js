import { bookingRequest } from '@/lib/booking/client';
import { fetchLeadQuestions as fetchLeadQuestionsFromStrapi, fetchWithLocaleFallback } from '@/lib/strapi/queries';

export const fetchLeadQuestions = async (locale = 'en') => {
  const result = await fetchWithLocaleFallback(
    (nextLocale) => fetchLeadQuestionsFromStrapi({ locale: nextLocale }),
    locale
  );

  return result.data || [];
};

export const fetchBookingStepper = async ({ key, locale = 'en' }) => {
  if (!key) return null;
  return bookingRequest(`/flows/${encodeURIComponent(key)}/runtime`, { query: { locale }, cache: 'no-store' });
};

export const startLeadSession = async (payload) => {
  const { stepperKey, stepperVersion, ...rest } = payload;
  return bookingRequest('/sessions', {
    method: 'POST',
    body: { ...rest, flowKey: stepperKey || undefined, flowVersion: stepperVersion || undefined },
    cache: 'no-store',
  });
};

export const saveLeadAnswer = async (payload) => {
  const { leadId, questionTitle: _questionTitle, ...body } = payload;
  return bookingRequest(`/sessions/${encodeURIComponent(leadId)}/answers`, {
    method: 'POST',
    body,
    cache: 'no-store',
  });
};

export const updateLeadContact = async ({ leadId, ...payload }) => {
  return bookingRequest(`/sessions/${encodeURIComponent(leadId)}/contact`, {
    method: 'PATCH',
    body: payload,
    cache: 'no-store',
  });
};

export const completeLead = async ({ leadId, ...payload }) => {
  return bookingRequest(`/sessions/${encodeURIComponent(leadId)}/complete`, {
    method: 'POST',
    body: payload,
    cache: 'no-store',
  });
};

export {
  completeLead as completeLeadRequest,
  saveLeadAnswer as saveLeadResponseRequest,
  startLeadSession as startLeadSessionRequest,
  updateLeadContact as updateLeadContactRequest,
};
