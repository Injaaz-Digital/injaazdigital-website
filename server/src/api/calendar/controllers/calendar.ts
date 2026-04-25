import { CalendarApiError } from '../services/calendar';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_SESSION: 'Invalid session token.',
  VALIDATION_ERROR: 'Please check the submitted fields.',
  GOOGLE_CALENDAR_NOT_CONFIGURED:
    'Google Calendar is not configured. Set Google calendar env vars or enable CALENDAR_MOCK_MODE=true for local testing.',
  GOOGLE_CALENDAR_FAILED: 'Google Calendar availability lookup failed.',
};

const errorResponse = (ctx, status: number, code: string, message: string, details?: Record<string, unknown>) => {
  ctx.status = status;
  ctx.body = {
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
};

const handleCalendarError = (ctx, error: unknown) => {
  if (error instanceof CalendarApiError) {
    return errorResponse(ctx, error.status, error.code, error.message, error.details);
  }

  const code = (error as any)?.message;
  if (code === 'INVALID_SESSION') {
    return errorResponse(ctx, 401, 'INVALID_SESSION', ERROR_MESSAGES.INVALID_SESSION);
  }

  if (code === 'GOOGLE_CALENDAR_NOT_CONFIGURED') {
    return errorResponse(ctx, 503, 'GOOGLE_CALENDAR_NOT_CONFIGURED', ERROR_MESSAGES.GOOGLE_CALENDAR_NOT_CONFIGURED);
  }

  throw error;
};

export default {
  async availability(ctx) {
    try {
      if (!ctx.query?.date) {
        return errorResponse(ctx, 400, 'INVALID_DATE', 'date query param is required in YYYY-MM-DD format');
      }

      ctx.body = await strapi.service('api::calendar.calendar').getAvailability(ctx.query || {});
    } catch (error) {
      return handleCalendarError(ctx, error);
    }
  },

  async book(ctx) {
    try {
      ctx.status = 201;
      ctx.body = await strapi.service('api::calendar.calendar').bookMeeting(ctx.request.body || {});
    } catch (error) {
      return handleCalendarError(ctx, error);
    }
  },
};
