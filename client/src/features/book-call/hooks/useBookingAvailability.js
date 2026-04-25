'use client';

import { useEffect, useState } from 'react';
import { fetchAvailabilityRequest } from '../services/calendar.service';
import { BOOK_CALL_TIMEZONE } from '../constants/bookCall.constants';

export function useBookingAvailability(date) {
  const [slots, setSlots] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!date) {
      setSlots([]);
      setAvailability(null);
      setError('');
      return undefined;
    }

    const run = async () => {
      setIsLoading(true);
      setError('');

      try {
        const nextAvailability = await fetchAvailabilityRequest(date);
        if (!cancelled) {
          setAvailability(nextAvailability);
          setSlots(nextAvailability.slots || []);
        }
      } catch (nextError) {
        if (!cancelled) {
          setSlots([]);
          setAvailability({
            date,
            timezone: BOOK_CALL_TIMEZONE,
            slots: [],
          });
          setError(nextError?.code || nextError?.payload?.error?.code || 'AVAILABILITY_ERROR');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [date, reloadKey]);

  return {
    slots,
    availability,
    isLoading,
    error,
    retry: () => setReloadKey((current) => current + 1),
  };
}
