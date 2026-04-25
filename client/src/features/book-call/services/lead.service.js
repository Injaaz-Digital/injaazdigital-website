import { requestJson } from '@/lib/strapi/client';
import { fetchLeadQuestions as fetchLeadQuestionsFromStrapi, fetchWithLocaleFallback } from '@/lib/strapi/queries';

export const fetchLeadQuestions = async (locale = 'en') => {
  const result = await fetchWithLocaleFallback(
    (nextLocale) => fetchLeadQuestionsFromStrapi({ locale: nextLocale }),
    locale
  );

  return result.data || [];
};

export const startLeadSession = async (payload) => {
  const response = await requestJson('/api/lead-sessions/start', {
    method: 'POST',
    body: payload,
  });

  return response?.data || null;
};

export const saveLeadAnswer = async (payload) => {
  const response = await requestJson('/api/lead-responses/save', {
    method: 'POST',
    body: payload,
  });

  return response?.data || null;
};

export const updateLeadContact = async ({ leadId, ...payload }) => {
  const response = await requestJson(`/api/leads/${leadId}/contact`, {
    method: 'PUT',
    body: payload,
  });

  return response?.data || null;
};

export const completeLead = async ({ leadId, ...payload }) => {
  const response = await requestJson(`/api/leads/${leadId}/complete`, {
    method: 'POST',
    body: payload,
  });

  return response?.data || null;
};

export {
  completeLead as completeLeadRequest,
  saveLeadAnswer as saveLeadResponseRequest,
  startLeadSession as startLeadSessionRequest,
  updateLeadContact as updateLeadContactRequest,
};
