'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Clock, Video } from 'lucide-react';
import { getLocaleDirection } from '@/lib/i18n/locale';
import { normalizeQuestions } from '../utils/normalizeQuestions';
import { FUNNEL_STATES } from '../constants/bookCall.constants';
import { useLeadSession } from '../hooks/useLeadSession';
import { getBookingFallbackCopy } from '../services/booking.service';
import LeadStepper from './LeadStepper';
import BookingCalendar from './BookingCalendar';
import BookingConfirmation from './BookingConfirmation';
import BookingFallback from './BookingFallback';

export default function BookCallPage({ locale = 'en', initialQuestions, bookingCopy, sourcePage = '/book-call', stepperKey = '', stepperVersion = 0, stepperSteps = [], contactFields = null }) {
  const questions = useMemo(() => normalizeQuestions(initialQuestions), [initialQuestions]);
  const copy = useMemo(
    () => ({ ...getBookingFallbackCopy(locale), ...(bookingCopy || {}) }),
    [bookingCopy, locale]
  );
  const questionsBeforeBookingEnabled = copy.questionsBeforeBookingEnabled !== false;
  const direction = getLocaleDirection(locale);
  const session = useLeadSession({ sourcePage, locale, stepperKey, stepperVersion });
  const [sessionResetKey, setSessionResetKey] = useState(0);
  const [funnelState, setFunnelState] = useState(
    questionsBeforeBookingEnabled && questions.length === 0 ? FUNNEL_STATES.ERROR : FUNNEL_STATES.STEPPER
  );
  const [qualificationResult, setQualificationResult] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [rescheduleMeetingId, setRescheduleMeetingId] = useState(null);

  const handleRestart = () => {
    session.clearSession();
    setQualificationResult(null);
    setBookingResult(null);
    setFunnelState(FUNNEL_STATES.STEPPER);
    setSessionResetKey((previous) => previous + 1);
  };

  return (
    <div dir={direction} className="mx-auto px-3 sm:px-0" style={{ width: '100%', maxWidth: '1120px' }}>
      <div className="overflow-hidden rounded-[1.25rem] corner-squircle border border-[#d8e3ef] bg-white shadow-[0_20px_60px_rgba(8,41,89,0.1)] sm:rounded-[1.5rem] xl:h-[calc(100svh-var(--header-height)-3rem)] xl:min-h-[36rem] xl:max-h-[46rem]">
        <div className="grid h-full xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="border-b border-[#d8e3ef] bg-[#f7fafc] p-3 sm:p-4 md:p-5 xl:border-b-0 xl:border-r">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5d7393] sm:text-xs">{copy.introEyebrow}</p>
          <h1 className="booking-title mt-1.5 text-lg font-semibold leading-tight tracking-[-0.025em] text-[#0a2546] sm:text-xl md:text-2xl xl:text-[1.85rem]">
            <span style={{ fontFamily: 'var(--font-sans)' }}>{copy.pageTitle}</span>
          </h1>
          <div className="mt-2 grid grid-cols-2 gap-1.5 sm:gap-2 xl:mt-4 xl:flex xl:flex-col">
              <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full corner-squircle border border-[#d8e3ef] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#17314d] sm:px-3 sm:py-2 sm:text-xs">
                <Clock className="h-3.5 w-3.5 text-[#0b5da8] sm:h-4 sm:w-4" aria-hidden="true" />
                <span>{copy.durationLabel}</span>
              </div>
              <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full corner-squircle border border-[#d8e3ef] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#17314d] sm:px-3 sm:py-2 sm:text-xs">
                <Video className="h-3.5 w-3.5 text-[#0b5da8] sm:h-4 sm:w-4" aria-hidden="true" />
                <span>{copy.meetingLocation || 'Google Meet'}</span>
              </div>
              <div className="col-span-2 inline-flex min-w-0 items-center gap-1.5 rounded-full corner-squircle border border-[#d8e3ef] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#17314d] sm:px-3 sm:py-2 sm:text-xs xl:col-auto">
                <CalendarDays className="h-3.5 w-3.5 text-[#0b5da8] sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="min-w-0 truncate">{copy.timezoneLabel}</span>
              </div>
          </div>

          <p className="mt-3 hidden text-sm font-semibold text-[#0a2546] xl:block">{copy.meetingName}</p>
        </aside>

        <div className="min-h-0 min-w-0 bg-white p-3 sm:p-4 md:p-5 xl:overflow-y-auto">
          {funnelState === FUNNEL_STATES.ERROR ? (
            <section className="rounded-2xl border border-[#d8e3ef] bg-[#f8fbff] p-6 md:p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#0a2546]">{copy.errorTitle}</h2>
                <p className="text-[#607693]">{copy.errorDescription}</p>
              </div>
            </section>
          ) : null}

          {funnelState === FUNNEL_STATES.STEPPER ? (
            <LeadStepper
              key={sessionResetKey}
              questions={questions}
              session={session}
              copy={copy}
              locale={locale}
              flowSteps={stepperSteps}
              flowVersion={stepperVersion}
              contactFields={contactFields}
              onQualified={(result) => {
                setQualificationResult(result);
                setFunnelState(FUNNEL_STATES.BOOKING);
              }}
              onUnqualified={(result) => {
                setQualificationResult(result);
                setFunnelState(FUNNEL_STATES.UNQUALIFIED);
              }}
            />
          ) : null}

          {funnelState === FUNNEL_STATES.BOOKING ? (
            <BookingCalendar
              leadId={session.leadId}
              sessionToken={session.sessionToken}
              copy={copy}
              locale={locale}
              qualificationResult={qualificationResult}
              rescheduleMeetingId={rescheduleMeetingId}
              onBooked={(result) => {
                setBookingResult(result);
                setRescheduleMeetingId(null);
                setFunnelState(FUNNEL_STATES.CONFIRMED);
              }}
            />
          ) : null}

          {funnelState === FUNNEL_STATES.UNQUALIFIED ? (
            <BookingFallback result={qualificationResult} copy={copy} />
          ) : null}

          {funnelState === FUNNEL_STATES.CONFIRMED ? (
            <BookingConfirmation
              booking={bookingResult}
              copy={copy}
              locale={locale}
              leadId={session.leadId}
              sessionToken={session.sessionToken}
              onCanceled={() => { setBookingResult(null); setFunnelState(FUNNEL_STATES.BOOKING); }}
              onReschedule={() => { setRescheduleMeetingId(bookingResult?.meetingId); setFunnelState(FUNNEL_STATES.BOOKING); }}
            />
          ) : null}
        </div>
        </div>
      </div>
    </div>
  );
}
