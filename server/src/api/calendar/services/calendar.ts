import { DateTime, IANAZone, Interval } from 'luxon';
import { createMeetingEvent, getBusyEvents, isGoogleCalendarConfigured } from '../../../services/google-calendar';

const DEFAULT_TIMEZONE = process.env.GOOGLE_CALENDAR_TIMEZONE || 'Africa/Casablanca';
const DATE_PARAM_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_VALUE_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const OPEN_MEETING_STATUSES = new Set(['scheduled', 'rescheduled']);

type CalendarSetting = {
  id?: number;
  workingDays?: unknown;
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
  bufferTime?: number;
  timezone?: string;
  minNoticeHours?: number;
  maxDaysAhead?: number;
  calendarId?: string;
};

type ValidatedCalendarSetting = {
  id?: number;
  workingDays: string[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
  timezone: string;
  minNoticeHours: number;
  maxDaysAhead: number;
  calendarId: string;
};

type CalendarErrorCode =
  | 'INVALID_DATE'
  | 'CALENDAR_SETTING_MISSING'
  | 'CALENDAR_SETTING_INVALID'
  | 'GOOGLE_CALENDAR_NOT_CONFIGURED'
  | 'GOOGLE_CALENDAR_AUTH_FAILED'
  | 'SLOT_UNAVAILABLE'
  | 'LEAD_NOT_QUALIFIED'
  | 'LEAD_ALREADY_BOOKED';

export class CalendarApiError extends Error {
  code: CalendarErrorCode;
  status: number;
  details?: Record<string, unknown>;

  constructor(code: CalendarErrorCode, message: string, status = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = 'CalendarApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const normalizeWeekday = (value: string) => value.trim().toLowerCase();
const weekdayName = (date: DateTime) => normalizeWeekday(date.toFormat('cccc'));

const normalizeWorkingDays = (value: unknown) => {
  const rawDays =
    Array.isArray(value)
      ? value
      : value && typeof value === 'object' && Array.isArray((value as { workingDays?: unknown }).workingDays)
        ? (value as { workingDays: unknown[] }).workingDays
        : [];

  return rawDays
    .map((day) => {
      if (typeof day === 'string') {
        return day;
      }

      if (day && typeof day === 'object') {
        const dayConfig = day as { day?: unknown; enabled?: unknown };
        if (dayConfig.enabled === false) {
          return '';
        }
        return typeof dayConfig.day === 'string' ? dayConfig.day : '';
      }

      return '';
    })
    .map(normalizeWeekday)
    .filter(Boolean);
};

const normalizeTimeValue = (value: unknown) => {
  const match = String(value || '').match(TIME_VALUE_REGEX);
  if (!match) {
    return '';
  }

  return `${match[1].padStart(2, '0')}:${match[2]}`;
};

const parseStrictDateParam = (value: unknown, timezone: string) => {
  if (typeof value !== 'string' || !DATE_PARAM_REGEX.test(value)) {
    throw new CalendarApiError('INVALID_DATE', 'date query param is required in YYYY-MM-DD format');
  }

  const parsed = DateTime.fromISO(value, { zone: timezone });
  if (!parsed.isValid || parsed.toISODate() !== value) {
    throw new CalendarApiError('INVALID_DATE', 'date query param must be a valid calendar date in YYYY-MM-DD format');
  }

  return parsed.startOf('day');
};

const parseDateTime = (value: unknown, timezone: string) => {
  const parsed = DateTime.fromISO(String(value || ''), { zone: timezone });
  return parsed.isValid ? parsed : null;
};

const parseTime = (date: DateTime, timeValue: string) => {
  const match = String(timeValue || '').match(TIME_VALUE_REGEX);
  if (!match) {
    return null;
  }

  return date.set({
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: 0,
    millisecond: 0,
  });
};

const mapBusyIntervals = (busy: { start?: string; end?: string }[], timezone: string) =>
  busy
    .map((slot) => {
      const start = parseDateTime(slot.start, timezone);
      const end = parseDateTime(slot.end, timezone);
      if (!start || !end || end <= start) {
        return null;
      }
      return Interval.fromDateTimes(start, end);
    })
    .filter(Boolean) as Interval[];

const slotLabel = (date: DateTime) => date.toFormat('HH:mm');

const isMockModeEnabled = () => String(process.env.CALENDAR_MOCK_MODE || '').toLowerCase() === 'true';
const isAvailabilityDebugEnabled = () =>
  String(process.env.CALENDAR_AVAILABILITY_DEBUG || '').toLowerCase() === 'true';
const shouldIgnoreGoogleBusy = () =>
  String(process.env.CALENDAR_IGNORE_GOOGLE_BUSY || '').toLowerCase() === 'true';

const serializeIntervals = (intervals: Interval[]) =>
  intervals.map((interval) => ({
    start: interval.start?.toISO(),
    end: interval.end?.toISO(),
  }));

const generateMockSlots = (date: string) => ({
  date,
  timezone: 'Africa/Casablanca',
  slots: [
    {
      label: '10:00',
      start: `${date}T10:00:00+01:00`,
      end: `${date}T10:30:00+01:00`,
    },
    {
      label: '11:00',
      start: `${date}T11:00:00+01:00`,
      end: `${date}T11:30:00+01:00`,
    },
    {
      label: '14:00',
      start: `${date}T14:00:00+01:00`,
      end: `${date}T14:30:00+01:00`,
    },
  ],
});

const mockCalendarSetting = (): CalendarSetting => ({
  id: 0,
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  startTime: '10:00',
  endTime: '14:30',
  slotDuration: 30,
  bufferTime: 0,
  timezone: 'Africa/Casablanca',
  minNoticeHours: 0,
  maxDaysAhead: 365,
  calendarId: 'primary',
});

const normalizeAnswersJson = (value: unknown): Record<string, unknown> => {
  if (!value) {
    return {};
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

export default ({ strapi }) => ({
  async getCalendarSetting(): Promise<CalendarSetting> {
    if (isMockModeEnabled()) {
      return mockCalendarSetting();
    }

    const setting = (await strapi.entityService.findMany('api::calendar-setting.calendar-setting')) as unknown as
      | CalendarSetting
      | null;

    if (!setting?.id) {
      throw new CalendarApiError(
        'CALENDAR_SETTING_MISSING',
        'Calendar settings are not configured in Strapi.',
        503
      );
    }

    return setting;
  },

  validateCalendarSetting(setting: CalendarSetting): ValidatedCalendarSetting {
    const invalidFields: string[] = [];
    const timezone = setting.timezone || DEFAULT_TIMEZONE;
    const workingDays = normalizeWorkingDays(setting.workingDays);
    const startTime = normalizeTimeValue(setting.startTime);
    const endTime = normalizeTimeValue(setting.endTime);
    const slotDuration = Number(setting.slotDuration);
    const bufferTime = Number(setting.bufferTime ?? 0);
    const minNoticeHours = Number(setting.minNoticeHours ?? 4);
    const maxDaysAhead = Number(setting.maxDaysAhead ?? 21);

    if (workingDays.length === 0) invalidFields.push('workingDays');
    if (!startTime) invalidFields.push('startTime');
    if (!endTime) invalidFields.push('endTime');
    if (!Number.isFinite(slotDuration) || slotDuration <= 0) invalidFields.push('slotDuration');
    if (!Number.isFinite(bufferTime) || bufferTime < 0) invalidFields.push('bufferTime');
    if (!timezone || !IANAZone.isValidZone(timezone)) invalidFields.push('timezone');
    if (!Number.isFinite(minNoticeHours) || minNoticeHours < 0) invalidFields.push('minNoticeHours');
    if (!Number.isFinite(maxDaysAhead) || maxDaysAhead < 0) invalidFields.push('maxDaysAhead');

    if (invalidFields.length > 0) {
      throw new CalendarApiError('CALENDAR_SETTING_INVALID', 'Calendar settings are incomplete or invalid.', 503, {
        invalidFields,
      });
    }

    return {
      id: setting.id,
      workingDays,
      startTime,
      endTime,
      slotDuration,
      bufferTime,
      timezone,
      minNoticeHours,
      maxDaysAhead,
      calendarId: setting.calendarId || process.env.GOOGLE_CALENDAR_ID || 'primary',
    };
  },

  async getBusyIntervals(dayStart: DateTime, dayEnd: DateTime, setting: ValidatedCalendarSetting) {
    if (shouldIgnoreGoogleBusy()) {
      strapi.log.warn('[calendar availability] CALENDAR_IGNORE_GOOGLE_BUSY=true, skipping Google busy lookup.');
      return [];
    }

    if (!isGoogleCalendarConfigured()) {
      if (isMockModeEnabled()) {
        return [];
      }

      throw new CalendarApiError(
        'GOOGLE_CALENDAR_NOT_CONFIGURED',
        'Google Calendar is not configured. Set Google calendar env vars or enable CALENDAR_MOCK_MODE=true for local testing.',
        503
      );
    }

    let busy: { start?: string; end?: string }[];
    try {
      busy = await getBusyEvents({
        start: dayStart.toUTC().toISO() || '',
        end: dayEnd.toUTC().toISO() || '',
        calendarId: setting.calendarId,
        timezone: setting.timezone,
      });
    } catch (error) {
      const message = (error as { message?: string })?.message || 'Google Calendar rejected the free/busy request.';
      strapi.log.error('[calendar availability] Google busy lookup failed', error);
      throw new CalendarApiError(
        'GOOGLE_CALENDAR_AUTH_FAILED',
        'Google Calendar authorization failed. Reconnect Google Calendar or enable CALENDAR_IGNORE_GOOGLE_BUSY=true for local slot-generation testing.',
        502,
        {
          providerMessage: message,
        }
      );
    }

    const intervals = mapBusyIntervals(busy, setting.timezone);

    if (isAvailabilityDebugEnabled()) {
      strapi.log.info('[calendar availability] Google busy response', {
        calendarId: setting.calendarId,
        busy,
        busyIntervals: serializeIntervals(intervals),
      });
    }

    return intervals;
  },

  async buildAvailabilityForDate(dateValue: unknown) {
    if (typeof dateValue !== 'string' || !DATE_PARAM_REGEX.test(dateValue)) {
      throw new CalendarApiError('INVALID_DATE', 'date query param is required in YYYY-MM-DD format');
    }

    if (isMockModeEnabled()) {
      const date = parseStrictDateParam(dateValue, 'Africa/Casablanca');
      return generateMockSlots(date.toISODate() || dateValue);
    }

    const rawSetting = await this.getCalendarSetting();
    const setting = this.validateCalendarSetting(rawSetting);
    const date = parseStrictDateParam(dateValue, setting.timezone);
    const today = DateTime.now().setZone(setting.timezone).startOf('day');

    if (date < today) {
      throw new CalendarApiError('INVALID_DATE', 'date cannot be in the past');
    }

    if (date > today.plus({ days: setting.maxDaysAhead })) {
      throw new CalendarApiError('INVALID_DATE', `date cannot be more than ${setting.maxDaysAhead} days ahead`);
    }

    if (!setting.workingDays.includes(weekdayName(date))) {
      return {
        date: date.toISODate(),
        timezone: setting.timezone,
        slots: [],
      };
    }

    const dayStart = parseTime(date, setting.startTime);
    const dayEnd = parseTime(date, setting.endTime);
    if (!dayStart || !dayEnd || dayEnd <= dayStart) {
      throw new CalendarApiError('CALENDAR_SETTING_INVALID', 'Calendar startTime must be before endTime.', 503, {
        invalidFields: ['startTime', 'endTime'],
      });
    }

    const minStart = DateTime.now().setZone(setting.timezone).plus({ hours: setting.minNoticeHours });
    const busyIntervals = await this.getBusyIntervals(dayStart, dayEnd, setting);
    const generatedSlots: Array<{ start: string; end: string; label: string }> = [];
    const slots: Array<{ start: string; end: string; label: string }> = [];

    let cursor = dayStart;
    while (cursor.plus({ minutes: setting.slotDuration }) <= dayEnd) {
      const slotEnd = cursor.plus({ minutes: setting.slotDuration });
      generatedSlots.push({
        start: cursor.toISO(),
        end: slotEnd.toISO(),
        label: slotLabel(cursor),
      });

      const blockedByBuffer = Interval.fromDateTimes(
        cursor.minus({ minutes: setting.bufferTime }),
        slotEnd.plus({ minutes: setting.bufferTime })
      );
      const overlapsBusy = busyIntervals.some((busyInterval) => busyInterval.overlaps(blockedByBuffer));

      if (cursor >= minStart && !overlapsBusy) {
        slots.push({
          start: cursor.toISO(),
          end: slotEnd.toISO(),
          label: slotLabel(cursor),
        });
      }

      cursor = cursor.plus({ minutes: setting.slotDuration + setting.bufferTime });
    }

    if (isAvailabilityDebugEnabled()) {
      strapi.log.info('[calendar availability] Slot generation result', {
        date: date.toISODate(),
        timezone: setting.timezone,
        workingDays: setting.workingDays,
        weekday: weekdayName(date),
        startTime: setting.startTime,
        endTime: setting.endTime,
        slotDuration: setting.slotDuration,
        bufferTime: setting.bufferTime,
        minNoticeHours: setting.minNoticeHours,
        minStart: minStart.toISO(),
        generatedSlots,
        busyIntervals: serializeIntervals(busyIntervals),
        finalSlots: slots,
      });
    }

    return {
      date: date.toISODate(),
      timezone: setting.timezone,
      slots,
    };
  },

  async getAvailability(query: Record<string, unknown> = {}) {
    return this.buildAvailabilityForDate(query.date);
  },

  async ensureSlotFree(start: string, end: string) {
    const rawSetting = await this.getCalendarSetting();
    const setting = this.validateCalendarSetting(rawSetting);
    const slotStart = DateTime.fromISO(start, { zone: setting.timezone });
    const slotEnd = DateTime.fromISO(end, { zone: setting.timezone });
    if (!slotStart.isValid || !slotEnd.isValid || slotEnd <= slotStart) {
      throw new CalendarApiError('INVALID_DATE', 'Booking slot start/end must be valid ISO datetimes');
    }

    const availability = await this.buildAvailabilityForDate(slotStart.toISODate());
    const exists = availability.slots.some((slot) => {
      const availableStart = DateTime.fromISO(slot.start, { zone: setting.timezone });
      const availableEnd = DateTime.fromISO(slot.end, { zone: setting.timezone });
      return (
        availableStart.isValid &&
        availableEnd.isValid &&
        availableStart.toMillis() === slotStart.toMillis() &&
        availableEnd.toMillis() === slotEnd.toMillis()
      );
    });
    if (!exists) {
      throw new CalendarApiError('SLOT_UNAVAILABLE', 'Selected slot is no longer available.', 409);
    }

    const overlappingMeeting = await strapi.db.query('api::meeting.meeting').findOne({
      where: {
        status: {
          $in: Array.from(OPEN_MEETING_STATUSES),
        },
        start: {
          $lt: slotEnd.toUTC().toISO(),
        },
        end: {
          $gt: slotStart.toUTC().toISO(),
        },
      },
    });

    if (overlappingMeeting?.id) {
      throw new CalendarApiError('SLOT_UNAVAILABLE', 'Selected slot is no longer available.', 409);
    }

    return { setting, slotStart, slotEnd };
  },

  async bookMeeting(payload: Record<string, unknown> = {}) {
    const leadId = Number(payload.leadId);
    const start = String(payload.start || '');
    const end = String(payload.end || '');
    const leadService = strapi.service('api::lead.lead');
    await leadService.validateSession(leadId, payload.sessionToken);

    const lead = (await strapi.entityService.findOne('api::lead.lead', leadId, {
      populate: {
        meetings: true,
      },
    })) as any;

    if (!lead?.id || lead.status !== 'qualified') {
      throw new CalendarApiError('LEAD_NOT_QUALIFIED', 'Lead is not qualified for booking.', 403);
    }

    const alreadyBooked = Array.isArray(lead.meetings)
      ? lead.meetings.some((meeting: Record<string, unknown>) => OPEN_MEETING_STATUSES.has(String(meeting.status || '')))
      : false;
    if (alreadyBooked) {
      throw new CalendarApiError('LEAD_ALREADY_BOOKED', 'Lead already has an open meeting.', 409);
    }

    const { setting, slotStart, slotEnd } = await this.ensureSlotFree(start, end);
    const event = isMockModeEnabled()
      ? null
      : await createMeetingEvent({
          lead,
          start: slotStart.toISO() || start,
          end: slotEnd.toISO() || end,
          timezone: setting.timezone,
          calendarId: setting.calendarId,
          serviceInterest: lead.serviceInterest,
          score: lead.score,
          answersJson: normalizeAnswersJson(lead.answersJson),
        });

    const meetLink =
      event?.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri ||
      event?.hangoutLink ||
      null;

    const meeting = await strapi.entityService.create('api::meeting.meeting', {
      data: {
        lead: lead.id,
        start: slotStart.toUTC().toISO(),
        end: slotEnd.toUTC().toISO(),
        duration: Math.round(slotEnd.diff(slotStart, 'minutes').minutes),
        status: 'scheduled',
        meetLink,
        googleEventId: event?.id || null,
        googleHtmlLink: event?.htmlLink || null,
      },
    });

    await strapi.entityService.update('api::lead.lead', lead.id, {
      data: {
        status: 'booked',
        meetingDate: slotStart.toUTC().toISO(),
        meetingLink: meetLink,
        lastActivityAt: new Date().toISOString(),
      },
    });

    return {
      meetingId: meeting.id,
      status: 'booked',
      start: slotStart.toISO(),
      end: slotEnd.toISO(),
      duration: Math.round(slotEnd.diff(slotStart, 'minutes').minutes),
      timezone: setting.timezone,
      meetLink,
      googleEventId: event?.id || null,
      googleHtmlLink: event?.htmlLink || null,
      email: lead.email || null,
    };
  },
});
