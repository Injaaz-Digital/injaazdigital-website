'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import Button from '@/shared/ui/Button';
import { bookMeetingRequest, fetchAvailabilityRange, rescheduleMeeting } from '../services/calendar.service';
import { useBookingAvailability } from '../hooks/useBookingAvailability';
import { BOOK_CALL_TIMEZONE } from '../constants/bookCall.constants';
import { addMonths, buildMonthDays, buildWeekdayLabels, formatDateLabel, formatLocalDateValue, formatMonthLabel, formatSlotLabel, parseLocalDate, sameMonth } from './BookingCalendar/calendar-date';
import { getBookingError } from './BookingCalendar/booking-errors';
import BookingCalendarSkeleton from './BookingCalendar/BookingCalendarSkeleton';

export default function BookingCalendar({ leadId, sessionToken, copy = {}, locale = 'en', onBooked, rescheduleMeetingId = null }) {
  const bookingAttemptRef = useRef(null);
  const todayValue = useMemo(() => formatLocalDateValue(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(todayValue);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [monthAvailability, setMonthAvailability] = useState({});
  const [monthAvailabilityStatus, setMonthAvailabilityStatus] = useState('loading');

  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
  const weekdayLabels = useMemo(() => buildWeekdayLabels(locale), [locale]);
  const {
    slots,
    availability,
    isLoading,
    error: availabilityError,
    retry,
  } = useBookingAvailability(selectedDate);
  const timezone = availability?.timezone || BOOK_CALL_TIMEZONE;
  const selectedDateLabel = selectedDate ? formatDateLabel(selectedDate, 'long', locale) : '';

  useEffect(() => {
    let cancelled = false;
    const inMonthDays = monthDays.filter((day) => day.inMonth && day.value >= todayValue);

    const loadMonthAvailability = async () => {
      if (inMonthDays.length === 0) return;
      try {
        const result = await fetchAvailabilityRange({ from: inMonthDays[0].value, to: inMonthDays[inMonthDays.length - 1].value });
        const entries = (result.days || []).map((day) => [day.date, (day.slots || []).length > 0]);
        if (!cancelled) {
          const nextAvailability = Object.fromEntries(entries);
          const firstAvailableDate = entries.find(([, hasSlots]) => hasSlots)?.[0];
          setMonthAvailability(nextAvailability);
          setMonthAvailabilityStatus('ready');
          setSelectedDate((current) => nextAvailability[current] === false && firstAvailableDate ? firstAvailableDate : current);
        }
      } catch {
        if (!cancelled) {
          // A range request is an enhancement. Keep every future day selectable
          // so the visitor can still load that day's live availability.
          setMonthAvailability({});
          setMonthAvailabilityStatus('error');
        }
      }
    };

    setMonthAvailability({});
    setMonthAvailabilityStatus('loading');
    void loadMonthAvailability();

    return () => {
      cancelled = true;
    };
  }, [monthDays, todayValue]);

  const handleBook = async () => {
    if (!selectedSlot || isBooking || isLoading) {
      return;
    }

    setIsBooking(true);
    setError('');

    try {
      const bookingPayload = {
        leadId,
        sessionToken,
        start: selectedSlot.start,
        end: selectedSlot.end,
        slotToken: selectedSlot.slotToken,
        idempotencyKey: bookingAttemptRef.current?.slot === selectedSlot.start
          ? bookingAttemptRef.current.key
          : crypto.randomUUID(),
      };
      bookingAttemptRef.current = { slot: selectedSlot.start, key: bookingPayload.idempotencyKey };
      const result = rescheduleMeetingId
        ? await rescheduleMeeting({ meetingId: rescheduleMeetingId, ...bookingPayload })
        : await bookMeetingRequest(bookingPayload);

      onBooked(result);
      bookingAttemptRef.current = null;
    } catch (nextError) {
      setError(getBookingError(nextError, copy));
      retry();
    } finally {
      setIsBooking(false);
    }
  };

  const canGoPrevious = !sameMonth(visibleMonth, parseLocalDate(todayValue));
  const moveMonth = (offset) => {
    setVisibleMonth((current) => {
      const nextMonth = addMonths(current, offset);
      const firstOfMonth = formatLocalDateValue(nextMonth);
      setSelectedDate(firstOfMonth < todayValue ? todayValue : firstOfMonth);
      setSelectedSlot(null);
      setError('');
      return nextMonth;
    });
  };

  return (
    <section className="flex min-h-0 flex-col gap-4 xl:h-full">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#617894]">{copy.chooseDateLabel || 'Choose date'}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#0a2546] md:text-2xl">{copy?.bookingTitle}</h2>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 rounded-2xl corner-squircle border border-[#d8e3ef] bg-white p-2.5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold tracking-[-0.03em] text-[#0a2546]">
              {formatMonthLabel(visibleMonth, locale)}
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={copy.previousMonthLabel || 'Previous month'}
                disabled={!canGoPrevious}
                onClick={() => moveMonth(-1)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#d6e1ee] text-[#17314d] transition hover:border-[#30a2c3] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={copy.nextMonthLabel || 'Next month'}
                onClick={() => moveMonth(1)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#d6e1ee] text-[#17314d] transition hover:border-[#30a2c3]"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8fa7]">
            {weekdayLabels.map((weekday) => (
              <div key={weekday} className="py-1.5">
                {weekday}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const isPast = day.value < todayValue;
              const isSelected = day.value === selectedDate;
              const hasSlots = monthAvailability[day.value] === true;
              const availabilityKnown = Object.prototype.hasOwnProperty.call(monthAvailability, day.value);
              const disabled = !day.inMonth || isPast || (availabilityKnown && !hasSlots && day.value !== selectedDate);

              return (
                <button
                  key={day.value}
                  type="button"
                  disabled={disabled}
                  aria-label={formatDateLabel(day.value, 'long', locale)}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedDate(day.value);
                    setSelectedSlot(null);
                    setError('');
                  }}
                  className={`relative grid aspect-square min-h-10 place-items-center rounded-xl corner-squircle border text-sm font-semibold transition sm:min-h-12 ${
                    isSelected
                      ? 'border-[#0b5da8] bg-[#0b5da8] text-white shadow-[0_12px_26px_rgba(11,93,168,0.24)]'
                      : hasSlots
                        ? 'border-[#d8e0e8] bg-[#e8edf2] text-[#17314d] hover:border-[#0b5da8] hover:bg-[#dfe8f1]'
                        : day.inMonth && !isPast
                          ? 'border-transparent bg-transparent text-[#b3c0cc]'
                          : 'border-transparent bg-transparent text-[#d1d9e2]'
                  } disabled:cursor-not-allowed`}
                >
                  <span>{day.day}</span>
                  {hasSlots && !isSelected ? (
                    <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#0b5da8]" />
                  ) : null}
                </button>
              );
            })}
          </div>
          {monthAvailabilityStatus === 'error' ? (
            <p className="mt-2 px-1 text-xs leading-5 text-[#607693]">
              {copy.chooseAnyDayLabel || 'Choose any future day to check its live times.'}
            </p>
          ) : null}
        </div>

        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl corner-squircle border border-[#d8e3ef] bg-[#fbfdff]">
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-3 pt-3 pb-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">{copy.availableTimesLabel || 'Available times'}</p>
              <h3 className="mt-1 text-base font-semibold text-[#15314f]">{selectedDateLabel}</h3>
            </div>
            {availabilityError ? (
              <Button variant="outline" size="sm" onClick={retry}>
                <RotateCw className="me-2 h-4 w-4" aria-hidden="true" />
                {copy?.retryLabel}
              </Button>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            {isLoading ? <BookingCalendarSkeleton label={copy?.loadingSlotsLabel || 'Loading'} /> : null}

            {!isLoading && availabilityError ? (
              <div className="rounded-xl border border-[#f5c8c8] bg-[#fff6f6] px-4 py-3 text-sm text-[#9b1c1c]">
                <p className="font-semibold">{copy?.errorTitle}</p>
                <p className="mt-1 text-[#9b1c1c]/80">{copy?.errorDescription}</p>
              </div>
            ) : null}

            {!isLoading && !availabilityError && slots.length === 0 ? (
              <div className="rounded-xl border border-[#d6e1ee] bg-white px-4 py-3 text-sm text-[#607693]">
                <p className="font-semibold text-[#15314f]">{copy?.noSlotsTitle}</p>
                <p className="mt-1">{copy?.noSlotsDescription}</p>
              </div>
            ) : null}

            {!isLoading && !availabilityError && slots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot) => {
                  const isActive = selectedSlot?.start === slot.start;
                  return (
                    <button
                      key={slot.start}
                      type="button"
                      className={`w-full rounded-xl corner-squircle border py-2.5 text-center text-sm font-semibold transition ${
                        isActive
                          ? 'border-[#0b5da8] bg-[#edf6ff] text-[#0a2546] shadow-[0_10px_24px_rgba(11,93,168,0.12)]'
                          : 'border-[#d6e1ee] bg-white text-[#15314f] hover:border-[#30a2c3] hover:bg-[#f8fbff]'
                      }`}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setError('');
                      }}
                    >
                      <span>{slot.label || formatSlotLabel(slot.start, timezone, locale)}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#f5c8c8] bg-[#fff6f6] px-4 py-2.5 text-sm text-[#9b1c1c]">
          {error}
        </div>
      ) : null}

      <div className="sticky bottom-2 z-10 flex shrink-0 items-center gap-3 rounded-2xl border border-[#d6e1ee] bg-white/95 p-2.5 shadow-[0_14px_36px_rgba(8,41,89,0.12)] backdrop-blur md:static md:justify-between md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        <p className="hidden text-xs text-[#607693] sm:block">
          {selectedSlot
            ? `${copy?.selectedTimeLabel}: ${formatSlotLabel(selectedSlot.start, timezone, locale)} - ${selectedDateLabel}`
            : (copy.selectTimeLabel || 'Select a time to continue.')}
        </p>
        <Button
          variant="primary"
          onClick={handleBook}
          disabled={!selectedSlot || isBooking || isLoading}
          className="w-full shrink-0 sm:w-auto"
        >
          {isBooking ? (copy.bookingLabel || 'Booking...') : copy?.confirmButtonLabel}
        </Button>
      </div>
    </section>
  );
}
