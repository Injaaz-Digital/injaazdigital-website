import { CalendarApiError } from '../services/calendar';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_SESSION: 'Invalid session token.',
  VALIDATION_ERROR: 'Please check the submitted fields.',
  GOOGLE_CALENDAR_AUTH_INVALID:
    'Google Calendar refresh token is invalid or expired. Reconnect Google Calendar and update GOOGLE_CALENDAR_REFRESH_TOKEN.',
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
  if ((error as any)?.code && Number((error as any)?.status)) {
    return errorResponse(ctx, Number((error as any).status), String((error as any).code), String((error as any).message), (error as any).details);
  }
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
  async config(ctx) {
    try {
      const result = await strapi.service('api::calendar.calendar').getPublicConfig();
      ctx.body = { data: result, error: null };
    } catch (error) {
      return handleCalendarError(ctx, error);
    }
  },

  async availability(ctx) {
    try {
      const useV2 = String(process.env.BOOKING_ENGINE_V2 || '').toLowerCase() === 'true';
      const limiter = useV2 ? strapi.plugin('booking').service('rate-limit') : null;
      limiter?.consume(`availability:${ctx.ip}`, Number(process.env.BOOKING_AVAILABILITY_RATE_LIMIT || 90));
      const result = useV2
        ? await strapi.plugin('booking').service('engine').availability(ctx.query || {})
        : await strapi.service('api::calendar.calendar').getAvailability(ctx.query || {});
      ctx.body = { data: result, error: null };
    } catch (error) {
      return handleCalendarError(ctx, error);
    }
  },

  async book(ctx) {
    try {
      const useV2 = String(process.env.BOOKING_ENGINE_V2 || '').toLowerCase() === 'true';
      const requestId = ctx.get('X-Request-Id') || ctx.state?.requestId || '';
      const idempotencyKey = ctx.get('Idempotency-Key');
      if (useV2) strapi.plugin('booking').service('rate-limit').consume(`book:${ctx.ip}`, Number(process.env.BOOKING_MUTATION_RATE_LIMIT || 20));
      ctx.status = 201;
      const result = useV2
        ? await strapi.plugin('booking').service('engine').book(ctx.request.body || {}, idempotencyKey, requestId)
        : await strapi.service('api::calendar.calendar').bookMeeting(ctx.request.body || {});
      ctx.body = { data: result, error: null };
    } catch (error) {
      return handleCalendarError(ctx, error);
    }
  },

  async cancel(ctx) {
    try {
      strapi.plugin('booking').service('rate-limit').consume(`cancel:${ctx.ip}`, Number(process.env.BOOKING_MUTATION_RATE_LIMIT || 20));
      const result = await strapi.plugin('booking').service('engine').cancel(ctx.params.id, ctx.request.body || {}, ctx.get('Idempotency-Key'), ctx.get('X-Request-Id'));
      ctx.body = { data: result, error: null };
    } catch (error) { return handleCalendarError(ctx, error); }
  },

  async reschedule(ctx) {
    try {
      strapi.plugin('booking').service('rate-limit').consume(`reschedule:${ctx.ip}`, Number(process.env.BOOKING_MUTATION_RATE_LIMIT || 20));
      const result = await strapi.plugin('booking').service('engine').reschedule(ctx.params.id, ctx.request.body || {}, ctx.get('Idempotency-Key'), ctx.get('X-Request-Id'));
      ctx.body = { data: result, error: null };
    } catch (error) { return handleCalendarError(ctx, error); }
  },
};
