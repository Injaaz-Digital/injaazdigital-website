'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, Mail, Video } from 'lucide-react';
import { BOOK_CALL_TIMEZONE } from '../constants/bookCall.constants';
import { cancelMeeting } from '../services/calendar.service';

const formatDate = (value, timezone, locale) =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'en', {
    dateStyle: 'full',
    timeZone: timezone,
  }).format(new Date(value));

const formatTime = (value, timezone, locale) =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'en', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(value));

export default function BookingConfirmation({ booking, copy = {}, locale = 'en', leadId, sessionToken, onCanceled, onReschedule }) {
  const timezone = booking?.timezone || BOOK_CALL_TIMEZONE;
  const [isCanceling, setIsCanceling] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleCancel = async () => {
    if (!booking?.meetingId || isCanceling) return;
    setIsCanceling(true);
    setActionError('');
    try {
      await cancelMeeting({ meetingId: booking.meetingId, leadId, sessionToken, reason: 'Canceled by lead' });
      onCanceled?.();
    } catch (error) {
      setActionError(error?.message || 'The booking could not be canceled.');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#cfeedd] bg-[#f4fff8] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#23724c]">{copy?.meetingName}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#0f5132]">{copy?.successTitle}</h2>
      </div>

      <div className="space-y-4">
          <div className="grid gap-2 text-sm text-[#17314d] sm:grid-cols-2">
            <div className="rounded-xl border border-[#d6e1ee] bg-[#f8fbff] p-3">
              <CalendarDays className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#607693]">{copy.confirmationDateLabel || 'Date'}</p>
              <p className="mt-1 font-semibold">{formatDate(booking?.start, timezone, locale)}</p>
            </div>
            <div className="rounded-xl border border-[#d6e1ee] bg-[#f8fbff] p-3">
              <Clock className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#607693]">{copy.confirmationTimeLabel || 'Time'}</p>
              <p className="mt-1 font-semibold">
                {formatTime(booking?.start, timezone, locale)} - {formatTime(booking?.end, timezone, locale)}
              </p>
              <p className="mt-1 text-xs text-[#607693]">{copy?.durationLabel}, {timezone}</p>
            </div>
            <div className="rounded-xl border border-[#d6e1ee] bg-[#f8fbff] p-3">
              <Video className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#607693]">{copy.confirmationMeetLabel || 'Google Meet'}</p>
              {booking?.meetLink ? (
                <a className="mt-1 block font-semibold text-[#0b5da8] underline" href={booking.meetLink} target="_blank" rel="noreferrer">
                  {copy?.openMeetLabel}
                </a>
              ) : (
                <p className="mt-1 font-semibold">{copy.confirmationPendingLabel || 'Link pending'}</p>
              )}
            </div>
            <div className="rounded-xl border border-[#d6e1ee] bg-[#f8fbff] p-3">
              <Mail className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#607693]">{copy.confirmationEmailLabel || 'Email'}</p>
              <p className="mt-1 font-semibold">{booking?.email || '-'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {booking?.meetLink ? (
              <a
                href={booking.meetLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-secondary)] bg-brand-gradient px-4 text-sm text-white shadow-[0_16px_32px_rgba(8,66,153,0.32)] transition hover:brightness-110"
            >
                {copy?.openMeetLabel}
              </a>
            ) : null}
            <button
              type="button"
              onClick={onReschedule}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#b8c9dc] bg-white px-4 text-sm text-[#17314d] transition hover:bg-[#f3f7fb]"
            >
              {copy.rescheduleLabel || 'Reschedule'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCanceling}
              className="inline-flex h-10 items-center justify-center rounded-full border border-red-200 bg-white px-4 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              {isCanceling ? (copy.cancelingLabel || 'Canceling...') : (copy.cancelBookingLabel || 'Cancel booking')}
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/65 px-4 text-sm text-[color:var(--ink-2)] shadow-[0_8px_20px_rgba(13,25,46,0.08)] transition hover:border-[var(--line-strong)] hover:bg-white/90"
            >
              {copy?.backHomeLabel}
            </Link>
          </div>
          {actionError ? <p className="text-sm font-medium text-red-600">{actionError}</p> : null}
      </div>
    </section>
  );
}
