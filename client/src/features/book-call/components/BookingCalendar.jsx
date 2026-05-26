'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import Button from '@/shared/ui/Button';
import { bookMeetingRequest, fetchAvailability } from '../services/calendar.service';
import { useBookingAvailability } from '../hooks/useBookingAvailability';
import { BOOK_CALL_TIMEZONE } from '../constants/bookCall.constants';

const formatLocalDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value) => {
  const [year, month, day] = String(value || '').split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const addMonths = (date, count) => new Date(date.getFullYear(), date.getMonth() + count, 1);

const sameMonth = (left, right) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

const buildMonthDays = (monthDate) => {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const leadingDays = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - leadingDays);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      value: formatLocalDateValue(date),
      day: date.getDate(),
      inMonth: date >= monthStart && date <= monthEnd,
      date,
    };
  });
};

const formatMonthLabel = (date, locale = 'en') =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'en', {
    month: 'long',
    year: 'numeric',
  }).format(date);

const formatDateLabel = (value, weekday = 'short', locale = 'en') =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'en', {
    weekday,
    month: 'short',
    day: 'numeric',
    timeZone: BOOK_CALL_TIMEZONE,
  }).format(new Date(`${value}T12:00:00`));

const formatSlotLabel = (value, timezone = BOOK_CALL_TIMEZONE, locale = 'en') =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'en', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(value));

const labels = {
  en: {
    chooseDate: 'Choose date',
    availableTimes: 'Available times',
    selected: 'Selected',
    to: 'to',
    selectTime: 'Select a time to continue.',
    booking: 'Booking...',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    slotTaken: 'That time was just taken. Please choose another slot.',
    calendarNotConfigured: 'Calendar connection is not configured yet.',
    calendarAuthInvalid: 'Calendar connection needs to be reconnected.',
    leadNotQualified: 'This lead is not eligible to book a call yet.',
    bookingFailed: 'Something went wrong while booking. Please try again.',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  ar: {
    chooseDate: 'اختر التاريخ',
    availableTimes: 'الأوقات المتاحة',
    selected: 'تم الاختيار',
    to: 'إلى',
    selectTime: 'اختر وقتا للمتابعة.',
    booking: 'جاري الحجز...',
    previousMonth: 'الشهر السابق',
    nextMonth: 'الشهر التالي',
    slotTaken: 'تم حجز هذا الوقت للتو. اختر وقتا آخر.',
    calendarNotConfigured: 'اتصال التقويم غير معد بعد.',
    calendarAuthInvalid: 'يجب إعادة ربط التقويم.',
    leadNotQualified: 'هذا الطلب غير مؤهل للحجز حاليا.',
    bookingFailed: 'حدث خطأ أثناء الحجز. أعد المحاولة.',
    weekdays: ['إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت', 'أحد'],
  },
};

const getBookingError = (error, ui) => {
  const code = error?.payload?.error?.code || error?.code;
  if (code === 'SLOT_UNAVAILABLE' || error?.status === 409) {
    return ui.slotTaken;
  }
  if (code === 'GOOGLE_CALENDAR_NOT_CONFIGURED') {
    return ui.calendarNotConfigured;
  }
  if (code === 'GOOGLE_CALENDAR_AUTH_INVALID') {
    return ui.calendarAuthInvalid;
  }
  if (code === 'LEAD_NOT_QUALIFIED') {
    return ui.leadNotQualified;
  }
  return ui.bookingFailed;
};

function LoadingSkeleton({ label }) {
  return (
    <div className="space-y-3" aria-label={label}>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-[3.75rem] animate-pulse rounded-xl bg-[#edf3f8]" />
      ))}
    </div>
  );
}

export default function BookingCalendar({ leadId, sessionToken, copy, locale = 'en', onBooked }) {
  const ui = labels[locale] || labels.en;
  const todayValue = useMemo(() => formatLocalDateValue(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(todayValue);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [monthAvailability, setMonthAvailability] = useState({});

  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
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
      const entries = [];

      for (const day of inMonthDays) {
        if (cancelled) {
          return;
        }

        try {
          const result = await fetchAvailability({ date: day.value });
          entries.push([day.value, (result.slots || []).length > 0]);
        } catch (nextError) {
          const code = nextError?.code || nextError?.payload?.error?.code;
          entries.push([day.value, false]);

          if (code === 'GOOGLE_CALENDAR_AUTH_INVALID' || code === 'GOOGLE_CALENDAR_NOT_CONFIGURED') {
            break;
          }
        }
      }

      if (!cancelled) {
        setMonthAvailability(Object.fromEntries(entries));
      }
    };

    setMonthAvailability({});
    loadMonthAvailability();

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
      const result = await bookMeetingRequest({
        leadId,
        sessionToken,
        start: selectedSlot.start,
        end: selectedSlot.end,
      });

      onBooked(result);
    } catch (nextError) {
      setError(getBookingError(nextError, ui));
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
    <section className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#617894]">{ui.chooseDate}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0a2546]">{copy?.bookingTitle}</h2>
        <p className="mt-2 text-sm leading-7 text-[#607693]">{copy?.bookingDescription}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 rounded-2xl border border-[#d8e3ef] bg-white p-4">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#0a2546]">
              {formatMonthLabel(visibleMonth, locale)}
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={ui.previousMonth}
                disabled={!canGoPrevious}
                onClick={() => moveMonth(-1)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#d6e1ee] text-[#17314d] transition hover:border-[#30a2c3] disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={ui.nextMonth}
                onClick={() => moveMonth(1)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#d6e1ee] text-[#17314d] transition hover:border-[#30a2c3]"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#7b8fa7]">
            {ui.weekdays.map((weekday) => (
              <div key={weekday} className="py-2">
                {weekday}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const isPast = day.value < todayValue;
              const isSelected = day.value === selectedDate;
              const hasSlots = monthAvailability[day.value] === true;
              const disabled = !day.inMonth || isPast || (!hasSlots && day.value !== selectedDate);

              return (
                <button
                  key={day.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedDate(day.value);
                    setSelectedSlot(null);
                    setError('');
                  }}
                  className={`relative grid aspect-square min-h-11 place-items-center rounded-xl border text-sm font-semibold transition sm:min-h-14 ${
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
        </div>

        <div className="min-w-0 space-y-4 rounded-2xl border border-[#d8e3ef] bg-[#fbfdff] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">{ui.availableTimes}</p>
              <h3 className="mt-2 text-xl font-semibold text-[#15314f]">{selectedDateLabel}</h3>
            </div>
            {availabilityError ? (
              <Button variant="outline" size="sm" onClick={retry}>
                <RotateCw className="me-2 h-4 w-4" aria-hidden="true" />
                {copy?.retryLabel}
              </Button>
            ) : null}
          </div>

          {isLoading ? <LoadingSkeleton label={copy?.loadingSlotsLabel} /> : null}

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
            <div className="space-y-3">
              {slots.map((slot) => {
                const isActive = selectedSlot?.start === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    className={`min-h-[3.75rem] w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
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

      {error ? (
        <div className="rounded-2xl border border-[#f5c8c8] bg-[#fff6f6] px-5 py-4 text-sm text-[#9b1c1c]">
          {error}
        </div>
      ) : null}

      <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border border-[#d6e1ee] bg-white/95 p-3 shadow-[0_18px_48px_rgba(8,41,89,0.14)] backdrop-blur md:static md:flex-row md:items-center md:justify-between md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        <p className="text-sm text-[#607693]">
          {selectedSlot
            ? `${copy?.selectedTimeLabel}: ${formatSlotLabel(selectedSlot.start, timezone, locale)} - ${selectedDateLabel}`
            : ui.selectTime}
        </p>
        <Button
          variant="primary"
          onClick={handleBook}
          disabled={!selectedSlot || isBooking || isLoading}
          className="w-full md:w-auto"
        >
          {isBooking ? ui.booking : copy?.confirmButtonLabel}
        </Button>
      </div>
    </section>
  );
}
