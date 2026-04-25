import Link from 'next/link';
import { CalendarDays, Clock, Mail, Video } from 'lucide-react';
import { BOOK_CALL_TIMEZONE } from '../constants/bookCall.constants';

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

const labels = {
  en: { date: 'Date', time: 'Time', meet: 'Google Meet', pending: 'Link pending', email: 'Email' },
  ar: { date: 'التاريخ', time: 'الوقت', meet: 'Google Meet', pending: 'الرابط قيد التجهيز', email: 'البريد الإلكتروني' },
};

export default function BookingConfirmation({ booking, copy, locale = 'en' }) {
  const ui = labels[locale] || labels.en;
  const timezone = booking?.timezone || BOOK_CALL_TIMEZONE;

  return (
    <section className="space-y-7">
      <div className="rounded-2xl border border-[#cfeedd] bg-[#f4fff8] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#23724c]">{copy?.meetingName}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0f5132]">{copy?.successTitle}</h2>
        <p className="mt-3 text-sm leading-7 text-[#416655]">{copy?.successDescription}</p>
      </div>

      <div className="space-y-6">
          <div className="grid gap-3 text-sm text-[#17314d] md:grid-cols-2">
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <CalendarDays className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">{ui.date}</p>
              <p className="mt-1 font-semibold">{formatDate(booking?.start, timezone, locale)}</p>
            </div>
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <Clock className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">{ui.time}</p>
              <p className="mt-1 font-semibold">
                {formatTime(booking?.start, timezone, locale)} - {formatTime(booking?.end, timezone, locale)}
              </p>
              <p className="mt-1 text-xs text-[#607693]">{copy?.durationLabel}, {timezone}</p>
            </div>
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <Video className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">{ui.meet}</p>
              {booking?.meetLink ? (
                <a className="mt-1 block font-semibold text-[#0b5da8] underline" href={booking.meetLink} target="_blank" rel="noreferrer">
                  {copy?.openMeetLabel}
                </a>
              ) : (
                <p className="mt-1 font-semibold">{ui.pending}</p>
              )}
            </div>
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <Mail className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">{ui.email}</p>
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
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/65 px-4 text-sm text-[color:var(--ink-2)] shadow-[0_8px_20px_rgba(13,25,46,0.08)] transition hover:border-[var(--line-strong)] hover:bg-white/90"
            >
              {copy?.backHomeLabel}
            </Link>
          </div>
      </div>
    </section>
  );
}
