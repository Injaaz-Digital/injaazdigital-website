'use client';

import { useEffect, useState } from 'react';
import {
  completeLeadRequest,
  saveLeadResponseRequest,
  startLeadSessionRequest,
  updateLeadContactRequest,
} from '../services/lead.service';
import { BOOK_CALL_CTA_SOURCE, BOOK_CALL_SESSION_STORAGE_KEY } from '../constants/bookCall.constants';

const loadStoredSession = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(BOOK_CALL_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const persistSession = (value) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!value) {
    window.localStorage.removeItem(BOOK_CALL_SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(BOOK_CALL_SESSION_STORAGE_KEY, JSON.stringify(value));
};

export function useLeadSession({ sourcePage }) {
  const [session, setSession] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSession(loadStoredSession());
  }, []);

  useEffect(() => {
    if (session) {
      persistSession(session);
    }
  }, [session]);

  const ensureSession = async () => {
    if (session?.leadId && session?.sessionToken) {
      return session;
    }

    const created = await startLeadSessionRequest({
      sourcePage,
      ctaSource: BOOK_CALL_CTA_SOURCE,
    });

    const nextSession = {
      leadId: created?.leadId,
      sessionToken: created?.sessionToken,
      answers: {},
      contact: {},
      currentStep: 0,
    };

    setSession(nextSession);
    persistSession(nextSession);
    return nextSession;
  };

  const saveAnswer = async ({ question, answer, currentStep }) => {
    setIsSaving(true);
    setError('');

    try {
      const activeSession = await ensureSession();
      const response = await saveLeadResponseRequest({
        leadId: activeSession.leadId,
        sessionToken: activeSession.sessionToken,
        questionKey: question.key,
        questionTitle: question.title,
        answer,
        currentStep,
      });

      const nextSession = {
        ...activeSession,
        answers: {
          ...(activeSession.answers || {}),
          [question.key]: answer,
        },
        currentStep,
      };

      setSession(nextSession);
      persistSession(nextSession);
      return response;
    } catch (nextError) {
      setError(nextError?.payload?.error?.message || nextError.message || 'Unable to save this step.');
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContact = async (contact) => {
    setIsSaving(true);
    setError('');

    try {
      const activeSession = await ensureSession();
      const response = await updateLeadContactRequest({
        leadId: activeSession.leadId,
        sessionToken: activeSession.sessionToken,
        ...contact,
      });

      const nextSession = {
        ...activeSession,
        contact,
      };
      setSession(nextSession);
      persistSession(nextSession);
      return response;
    } catch (nextError) {
      setError(nextError?.payload?.error?.message || nextError.message || 'Unable to save your contact info.');
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  };

  const completeLead = async () => {
    setIsSaving(true);
    setError('');

    try {
      const activeSession = await ensureSession();
      const response = await completeLeadRequest({
        leadId: activeSession.leadId,
        sessionToken: activeSession.sessionToken,
      });

      const nextSession = {
        ...activeSession,
        completed: true,
      };
      setSession(nextSession);
      persistSession(nextSession);
      return response;
    } catch (nextError) {
      setError(nextError?.payload?.error?.message || nextError.message || 'Unable to complete your qualification.');
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  };

  const clearSession = () => {
    setSession(null);
    persistSession(null);
  };

  return {
    leadId: session?.leadId || null,
    sessionToken: session?.sessionToken || '',
    answers: session?.answers || {},
    contact: session?.contact || {},
    currentStep: session?.currentStep || 0,
    isSaving,
    error,
    saveAnswer,
    updateContact,
    completeLead,
    clearSession,
  };
}
