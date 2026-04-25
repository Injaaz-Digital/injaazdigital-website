import { requestJson } from '@/lib/strapi/client';

export const startLeadSessionRequest = async (payload) => {
  const response = await requestJson('/api/lead-sessions/start', {
    method: 'POST',
    body: payload,
  });

  return response?.data || null;
};

export const saveLeadResponseRequest = async (payload) => {
  const response = await requestJson('/api/lead-responses/save', {
    method: 'POST',
    body: payload,
  });

  return response?.data || null;
};

export const updateLeadContactRequest = async ({ leadId, ...payload }) => {
  const response = await requestJson(`/api/leads/${leadId}/contact`, {
    method: 'PUT',
    body: payload,
  });

  return response?.data || null;
};

export const completeLeadRequest = async ({ leadId, ...payload }) => {
  const response = await requestJson(`/api/leads/${leadId}/complete`, {
    method: 'POST',
    body: payload,
  });

  return response?.data || null;
};
