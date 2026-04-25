'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Clock, ShieldCheck, Video } from 'lucide-react';
import { getLocaleDirection } from '@/lib/i18n/locale';
import { normalizeQuestions } from '../utils/normalizeQuestions';
import { FUNNEL_STATES } from '../constants/bookCall.constants';
import { useLeadSession } from '../hooks/useLeadSession';
import { getBookingFallbackCopy } from '../services/booking.service';
import LeadStepper from './LeadStepper';
import BookingCalendar from './BookingCalendar';
import BookingConfirmation from './BookingConfirmation';
import BookingFallback from './BookingFallback';

export default function BookCallPage({ locale = 'en', initialQuestions, bookingCopy, sourcePage = '/book-call' }) {
  const questions = useMemo(() => normalizeQuestions(initialQuestions), [initialQuestions]);
  const copy = useMemo(
    () => ({ ...getBookingFallbackCopy(locale), ...(bookingCopy || {}) }),
    [bookingCopy, locale]
  );
  const direction = getLocaleDirection(locale);
  const session = useLeadSession({ sourcePage, locale });
  const [sessionResetKey, setSessionResetKey] = useState(0);
  const [funnelState, setFunnelState] = useState(
    questions.length > 0 ? FUNNEL_STATES.STEPPER : FUNNEL_STATES.ERROR
  );
  const [qualificationResult, setQualificationResult] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  const handleRestart = () => {
    session.clearSession();
    setQualificationResult(null);
    setBookingResult(null);
    setFunnelState(FUNNEL_STATES.STEPPER);
    setSessionResetKey((previous) => previous + 1);
  };

  return (
    <div dir={direction} className="mx-auto w-[min(1120px,calc(100%-1rem))] px-0 md:w-[min(1120px,calc(100%-2rem))]">
      <div className="overflow-hidden rounded-[2rem] border border-[#d8e3ef] bg-white shadow-[0_30px_90px_rgba(8,41,89,0.12)]">
        <div className="grid xl:grid-cols-[22.5rem_minmax(0,1fr)]">
        <aside className="border-b border-[#d8e3ef] bg-[#f7fafc] p-5 md:p-7 xl:border-b-0 xl:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5d7393]">{copy.introEyebrow}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#0a2546] md:text-[2.35rem]">
            {copy.pageTitle}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#536b87]">{copy.pageSubtitle}</p>

          <div className="mt-7 rounded-2xl border border-[#d8e3ef] bg-white p-4 shadow-[0_10px_28px_rgba(8,41,89,0.06)]">
            <h2 className="text-lg font-semibold text-[#0a2546]">{copy.meetingName}</h2>
            <p className="mt-2 text-sm leading-7 text-[#536b87]">{copy.meetingDescription}</p>
            <div className="mt-5 space-y-3 text-sm text-[#17314d]">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
                <span>{copy.durationLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
                <span>{copy.meetingLocation || 'Google Meet'}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
                <span>{copy.timezoneLabel}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#d8e3ef] bg-[#eef6fb] p-4 text-sm text-[#4f6784]">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0b5da8]" aria-hidden="true" />
              <div>
                <p className="font-medium text-[#17314d]">{copy.qualificationIntroTitle}</p>
                <p className="mt-1 leading-7">{copy.qualificationIntroDescription}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 bg-white p-4 md:p-7">
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
              onBooked={(result) => {
                setBookingResult(result);
                setFunnelState(FUNNEL_STATES.CONFIRMED);
              }}
            />
          ) : null}

          {funnelState === FUNNEL_STATES.UNQUALIFIED ? (
            <BookingFallback result={qualificationResult} copy={copy} />
          ) : null}

          {funnelState === FUNNEL_STATES.CONFIRMED ? (
            <BookingConfirmation booking={bookingResult} copy={copy} locale={locale} />
          ) : null}
        </div>
        </div>
      </div>
    </div>
  );
}
