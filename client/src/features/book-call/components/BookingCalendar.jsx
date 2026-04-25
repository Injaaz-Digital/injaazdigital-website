'use client';

import { useMemo, useState } from 'react';
import { Check, RotateCw } from 'lucide-react';
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
    slotTaken: 'That time was just taken. Please choose another slot.',
    calendarNotConfigured: 'Calendar connection is not configured yet.',
    leadNotQualified: 'This lead is not eligible to book a call yet.',
    bookingFailed: 'Something went wrong while booking. Please try again.',
  },
  ar: {
    chooseDate: 'اختر التاريخ',
    availableTimes: 'الأوقات المتاحة',
    selected: 'تم الاختيار',
    to: 'إلى',
    selectTime: 'اختر وقتا للمتابعة.',
    booking: 'جاري الحجز...',
    slotTaken: 'تم حجز هذا الوقت للتو. اختر وقتا آخر.',
    calendarNotConfigured: 'اتصال التقويم غير معد بعد.',
    leadNotQualified: 'هذا الطلب غير مؤهل للحجز حاليا.',
    bookingFailed: 'حدث خطأ أثناء الحجز. أعد المحاولة.',
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
  if (code === 'LEAD_NOT_QUALIFIED') {
    return ui.leadNotQualified;
  }
  return ui.bookingFailed;
};

function LoadingSkeleton({ label }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label={label}>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-[4.75rem] animate-pulse rounded-2xl bg-[#edf3f8]" />
      ))}
    </div>
  );
}

export default function BookingCalendar({ leadId, sessionToken, copy, locale = 'en', onBooked }) {
  const ui = labels[locale] || labels.en;
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
  const selectedDateLabel = selectedDate ? formatDateLabel(selectedDate, 'long', locale) : '';

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

  return (
    <section className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#617894]">{ui.chooseDate}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0a2546]">{copy?.bookingTitle}</h2>
        <p className="mt-2 text-sm leading-7 text-[#607693]">{copy?.bookingDescription}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {dateOptions.map((option) => {
          const active = option === selectedDate;
          return (
            <button
              key={option}
              type="button"
              className={`min-h-[4.25rem] rounded-2xl border px-3 py-3 text-start text-sm transition ${
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
              <span className="block font-semibold">{formatDateLabel(option, 'short', locale)}</span>
              {active ? (
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#0b5da8]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  {ui.selected}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">{ui.availableTimes}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#15314f]">
                  {formatDateLabel(selectedDate, 'long', locale)}
                </h3>
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
              <div className="rounded-2xl border border-[#f5c8c8] bg-[#fff6f6] px-5 py-4 text-sm text-[#9b1c1c]">
                <p className="font-semibold">{copy?.errorTitle}</p>
                <p className="mt-1 text-[#9b1c1c]/80">{copy?.errorDescription}</p>
              </div>
            ) : null}

            {!isLoading && !availabilityError && slots.length === 0 ? (
              <div className="rounded-2xl border border-[#d6e1ee] bg-[#f8fbff] px-5 py-4 text-sm text-[#607693]">
                <p className="font-semibold text-[#15314f]">{copy?.noSlotsTitle}</p>
                <p className="mt-1">{copy?.noSlotsDescription}</p>
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
                      className={`min-h-[4.75rem] rounded-2xl border px-4 py-3 text-start text-sm transition ${
                        isActive
                          ? 'border-[#0b5da8] bg-[#edf6ff] text-[#0a2546] shadow-[0_10px_24px_rgba(11,93,168,0.12)]'
                          : 'border-[#d6e1ee] bg-white text-[#15314f] hover:border-[#30a2c3] hover:bg-[#f8fbff]'
                      }`}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setError('');
                      }}
                    >
                      <span className="block font-semibold">
                        {slot.label || formatSlotLabel(slot.start, timezone, locale)}
                      </span>
                      <span className="mt-1 block text-xs text-[#607693]">
                        {ui.to} {formatSlotLabel(slot.end, timezone, locale)}
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
