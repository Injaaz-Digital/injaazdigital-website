'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Check, Clock, RotateCw, Video } from 'lucide-react';
import Button from '@/shared/ui/Button';
import { bookMeetingRequest } from '../services/calendar.service';
import { useBookingAvailability } from '../hooks/useBookingAvailability';
import { BOOK_CALL_TIMEZONE } from '../constants/bookCall.constants';

const formatLocalDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildDateOptions = () => {
  const today = new Date();
  return Array.from({ length: 21 }, (_, index) => {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + index);
    return formatLocalDateValue(nextDate);
  });
};

const formatDateLabel = (value, weekday = 'short') =>
  new Intl.DateTimeFormat('en', {
    weekday,
    month: 'short',
    day: 'numeric',
    timeZone: BOOK_CALL_TIMEZONE,
  }).format(new Date(`${value}T12:00:00`));

const formatSlotLabel = (value, timezone = BOOK_CALL_TIMEZONE) =>
  new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(value));

const getBookingError = (error) => {
  const code = error?.payload?.error?.code || error?.code;
  if (code === 'SLOT_UNAVAILABLE' || error?.status === 409) {
    return 'That time was just taken. Please choose another slot.';
  }
  if (code === 'GOOGLE_CALENDAR_NOT_CONFIGURED') {
    return 'Calendar connection is not configured yet.';
  }
  if (code === 'LEAD_NOT_QUALIFIED') {
    return 'This lead is not eligible to book a call yet.';
  }
  return 'Something went wrong while booking. Please try again.';
};

function LoadingSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading available times">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-[4.75rem] animate-pulse rounded-2xl bg-[#edf3f8]" />
      ))}
    </div>
  );
}

export default function BookingCalendar({ leadId, sessionToken, onBooked }) {
  const dateOptions = useMemo(buildDateOptions, []);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0] || '');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const {
    slots,
    availability,
    isLoading,
    error: availabilityError,
    retry,
  } = useBookingAvailability(selectedDate);
  const timezone = availability?.timezone || BOOK_CALL_TIMEZONE;
  const selectedDateLabel = selectedDate ? formatDateLabel(selectedDate, 'long') : '';

  const handleBook = async () => {
    if (!selectedSlot || isBooking || isLoading) {
      return;
    }

    setIsBooking(true);
    setError('');

    try {
      const result = await bookMeetingRequest({
        leadId,
        sessionToken,
        start: selectedSlot.start,
        end: selectedSlot.end,
      });

      onBooked(result);
    } catch (nextError) {
      setError(getBookingError(nextError));
      retry();
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#d9e6f2] bg-white shadow-[0_28px_80px_rgba(8,41,89,0.12)]">
      <div className="grid lg:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="bg-[linear-gradient(180deg,#0a2546_0%,#123a63_100%)] p-6 text-white md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#9fd9ee]">Injaaz Digital</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Strategy Call</h2>
          <p className="mt-4 text-sm leading-7 text-[#d7e7f5]">
            A focused call to understand your current digital system, clarify gaps, and identify the best next step.
          </p>

          <div className="mt-8 space-y-4 text-sm text-[#e9f5ff]">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#8dd7ef]" aria-hidden="true" />
              <span>30 min</span>
            </div>
            <div className="flex items-center gap-3">
              <Video className="h-4 w-4 text-[#8dd7ef]" aria-hidden="true" />
              <span>Google Meet</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-[#8dd7ef]" aria-hidden="true" />
              <span>{timezone}</span>
            </div>
          </div>

          {selectedSlot ? (
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm">
              <p className="text-[#9fd9ee]">Selected time</p>
              <p className="mt-2 font-semibold">{selectedDateLabel}</p>
              <p className="mt-1">
                {formatSlotLabel(selectedSlot.start, timezone)} - {formatSlotLabel(selectedSlot.end, timezone)}
              </p>
            </div>
          ) : null}
        </aside>

        <div className="space-y-7 p-5 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">Choose date</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0a2546]">{selectedDateLabel}</h3>
            <p className="mt-2 text-sm text-[#607693]">Times are shown in {timezone}.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7">
            {dateOptions.map((option) => {
              const active = option === selectedDate;
              return (
                <button
                  key={option}
                  type="button"
                  className={`min-h-[4.25rem] rounded-2xl border px-3 py-3 text-left text-sm transition ${
                    active
                      ? 'border-[#0b5da8] bg-[#edf6ff] text-[#0a2546] shadow-[0_10px_24px_rgba(11,93,168,0.12)]'
                      : 'border-[#d6e1ee] bg-white text-[#17314d] hover:border-[#30a2c3]'
                  }`}
                  onClick={() => {
                    setSelectedDate(option);
                    setSelectedSlot(null);
                    setError('');
                  }}
                >
                  <span className="block font-semibold">{formatDateLabel(option)}</span>
                  {active ? (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#0b5da8]">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Selected
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">Available times</p>
                <h3 className="mt-2 text-xl font-semibold text-[#15314f]">{formatDateLabel(selectedDate, 'long')}</h3>
              </div>
              {availabilityError ? (
                <Button variant="outline" size="sm" onClick={retry}>
                  <RotateCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Retry
                </Button>
              ) : null}
            </div>

            {isLoading ? <LoadingSkeleton /> : null}

            {!isLoading && availabilityError ? (
              <div className="rounded-2xl border border-[#f5c8c8] bg-[#fff6f6] px-5 py-4 text-sm text-[#9b1c1c]">
                {availabilityError}
              </div>
            ) : null}

            {!isLoading && !availabilityError && slots.length === 0 ? (
              <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] px-5 py-4 text-sm text-[#607693]">
                No available slots for this day.
              </div>
            ) : null}

            {!isLoading && !availabilityError && slots.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {slots.map((slot) => {
                  const isActive = selectedSlot?.start === slot.start;
                  return (
                    <button
                      key={slot.start}
                      type="button"
                      className={`min-h-[4.75rem] rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        isActive
                          ? 'border-[#0b5da8] bg-[#edf6ff] text-[#0a2546] shadow-[0_10px_24px_rgba(11,93,168,0.12)]'
                          : 'border-[#d6e1ee] bg-white text-[#15314f] hover:border-[#30a2c3]'
                      }`}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setError('');
                      }}
                    >
                      <span className="block font-semibold">{slot.label || formatSlotLabel(slot.start, timezone)}</span>
                      <span className="mt-1 block text-xs text-[#607693]">
                        to {formatSlotLabel(slot.end, timezone)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-[#f5c8c8] bg-[#fff6f6] px-5 py-4 text-sm text-[#9b1c1c]">
              {error}
            </div>
          ) : null}

          <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border border-[#d6e1ee] bg-white/95 p-3 shadow-[0_18px_48px_rgba(8,41,89,0.14)] backdrop-blur md:static md:flex-row md:items-center md:justify-between md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <p className="text-sm text-[#607693]">
              {selectedSlot
                ? `${formatSlotLabel(selectedSlot.start, timezone)} on ${selectedDateLabel}`
                : 'Select a time to continue.'}
            </p>
            <Button
              variant="primary"
              onClick={handleBook}
              disabled={!selectedSlot || isBooking || isLoading}
              className="w-full md:w-auto"
            >
              {isBooking ? 'Booking...' : 'Confirm meeting'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
