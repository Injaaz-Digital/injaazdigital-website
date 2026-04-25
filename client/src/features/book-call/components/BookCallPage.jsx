'use client';

import { useMemo, useState } from 'react';
import Button from '@/shared/ui/Button';
import { normalizeQuestions } from '../utils/normalizeQuestions';
import { FUNNEL_STATES } from '../constants/bookCall.constants';
import { useLeadSession } from '../hooks/useLeadSession';
import LeadStepper from './LeadStepper';
import BookingCalendar from './BookingCalendar';
import BookingConfirmation from './BookingConfirmation';
import BookingFallback from './BookingFallback';

export default function BookCallPage({ initialQuestions, sourcePage = '/book-call' }) {
  const questions = useMemo(() => normalizeQuestions(initialQuestions), [initialQuestions]);
  const session = useLeadSession({ sourcePage });
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
    <div className="mx-auto w-[min(1160px,calc(100%-1rem))] px-0 md:w-[min(1160px,calc(100%-2rem))]">
      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-[2rem] border border-[#d9e6f2] bg-[linear-gradient(180deg,#eff6fd_0%,#f8fbff_48%,#ffffff_100%)] shadow-[0_28px_80px_rgba(8,41,89,0.10)]">
          <div className="border-b border-[#d9e6f2] px-6 py-6 md:px-7">
            <p className="text-xs uppercase tracking-[0.24em] text-[#5d7393]">Injaaz Digital</p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[#0a2546]">
              Book your strategy call.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#516b89]">
              A focused call to understand your current digital system, clarify gaps, and identify the best next step.
            </p>
          </div>

          <div className="space-y-4 px-6 py-6 md:px-7">
            <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-[0_10px_30px_rgba(8,41,89,0.06)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6a809d]">Call format</p>
              <div className="mt-3 space-y-3 text-sm text-[#17314d]">
                <div className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-[#0b5da8]" /><span>30-minute Google Meet session.</span></div>
                <div className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-[#0b5da8]" /><span>Timezone: Africa/Casablanca.</span></div>
                <div className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-[#0b5da8]" /><span>Clear next step at the end of the call.</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d9e6f2] bg-[#f8fbff] p-4 text-sm text-[#4f6784]">
              <p className="font-medium text-[#17314d]">Before you choose a time</p>
              <p className="mt-1 leading-7">A few quick questions help us prepare and keep the call useful.</p>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {funnelState === FUNNEL_STATES.ERROR ? (
            <section className="rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_28px_80px_rgba(8,41,89,0.14)] md:p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-[#0a2546]">The booking funnel is not ready yet.</h2>
                <p className="text-[#607693]">No active lead questions were returned from Strapi. Add at least one active question to launch the stepper.</p>
              </div>
            </section>
          ) : null}

          {funnelState === FUNNEL_STATES.STEPPER ? (
            <LeadStepper
              key={sessionResetKey}
              questions={questions}
              session={session}
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
              qualificationResult={qualificationResult}
              onBooked={(result) => {
                setBookingResult(result);
                setFunnelState(FUNNEL_STATES.CONFIRMED);
              }}
            />
          ) : null}

          {funnelState === FUNNEL_STATES.UNQUALIFIED ? (
            <BookingFallback result={qualificationResult} onRestart={handleRestart} />
          ) : null}

          {funnelState === FUNNEL_STATES.CONFIRMED ? (
            <BookingConfirmation booking={bookingResult} onRestart={handleRestart} />
          ) : null}

          {funnelState !== FUNNEL_STATES.ERROR ? (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={handleRestart}>Reset funnel</Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
