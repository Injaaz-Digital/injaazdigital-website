import Link from 'next/link';
import { CalendarDays, Clock, Mail, Video } from 'lucide-react';
import Button from '@/shared/ui/Button';
import { BOOK_CALL_TIMEZONE } from '../constants/bookCall.constants';

const formatDate = (value, timezone) =>
  new Intl.DateTimeFormat('en', {
    dateStyle: 'full',
    timeZone: timezone,
  }).format(new Date(value));

const formatTime = (value, timezone) =>
  new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(value));

export default function BookingConfirmation({ booking, onRestart }) {
  const timezone = booking?.timezone || BOOK_CALL_TIMEZONE;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#d4f0de] bg-white shadow-[0_28px_80px_rgba(17,94,59,0.12)]">
      <div className="grid lg:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="bg-[linear-gradient(180deg,#0f5132_0%,#17643f_100%)] p-6 text-white md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#bcefd2]">Booked</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Your strategy call is booked.</h2>
          <p className="mt-4 text-sm leading-7 text-[#ddf7e7]">
            We saved your meeting in Injaaz Digital and created the Google Calendar event.
          </p>
        </aside>

        <div className="space-y-6 p-6 md:p-8">
          <div className="grid gap-3 text-sm text-[#17314d] md:grid-cols-2">
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <CalendarDays className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">Date</p>
              <p className="mt-1 font-semibold">{formatDate(booking?.start, timezone)}</p>
            </div>
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <Clock className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">Time</p>
              <p className="mt-1 font-semibold">
                {formatTime(booking?.start, timezone)} - {formatTime(booking?.end, timezone)}
              </p>
              <p className="mt-1 text-xs text-[#607693]">{booking?.duration || 30} min, {timezone}</p>
            </div>
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <Video className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">Google Meet</p>
              {booking?.meetLink ? (
                <a className="mt-1 block font-semibold text-[#0b5da8] underline" href={booking.meetLink} target="_blank" rel="noreferrer">
                  Open meeting link
                </a>
              ) : (
                <p className="mt-1 font-semibold">Link pending</p>
              )}
            </div>
            <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] p-4">
              <Mail className="h-4 w-4 text-[#0b5da8]" aria-hidden="true" />
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#607693]">Email</p>
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
                Open Google Meet
              </a>
            ) : null}
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/65 px-4 text-sm text-[color:var(--ink-2)] shadow-[0_8px_20px_rgba(13,25,46,0.08)] transition hover:border-[var(--line-strong)] hover:bg-white/90"
            >
              Back to website
            </Link>
            <Button variant="ghost" onClick={onRestart}>Book another call</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
