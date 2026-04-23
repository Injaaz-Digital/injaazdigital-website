import { factories } from '@strapi/strapi';

const LEAD_FIELDS = [
  'fullName',
  'email',
  'phone',
  'companyName',
  'website',
  'service',
  'audience',
  'experience',
  'current_dislikes',
  'challenge',
  'prev_investment',
  'goal',
  'success_metric',
  'vision',
  'platform_type',
  'features',
  'examples',
  'budget',
  'timeline',
  'decision_maker',
  'sourcePath',
  'locale',
] as const;

const QUALIFICATION_FIELDS = [
  'service',
  'audience',
  'experience',
  'current_dislikes',
  'challenge',
  'prev_investment',
  'goal',
  'success_metric',
  'vision',
  'platform_type',
  'features',
  'examples',
  'budget',
  'timeline',
  'decision_maker',
] as const;

const BASE_REQUIRED_FIELDS = ['fullName', 'email'] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /(https?:\/\/|www\.)/gi;
const URL_PROTOCOL_REGEX = /^https?:\/\//i;
const MAX_FIELD_LENGTH = 2000;

type UnknownRecord = Record<string, string>;

const sanitizeString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
};

const normalizeSourcePath = (value: string): string => {
  if (!value) {
    return '/';
  }

  if (value.startsWith('/')) {
    return value;
  }

  try {
    const asUrl = new URL(value);
    return asUrl.pathname || '/';
  } catch {
    return '/';
  }
};

const normalizeLocale = (value: unknown): 'en' | 'ar' => {
  const lowered = String(value || '').toLowerCase();
  if (lowered.startsWith('ar')) {
    return 'ar';
  }

  return 'en';
};

const normalizeUrlValue = (value: string): string => {
  const trimmed = sanitizeString(value);
  if (!trimmed) {
    return '';
  }

  return URL_PROTOCOL_REGEX.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const isSpamLike = (payload: UnknownRecord): boolean => {
  const combined = Object.values(payload).join(' ');
  const urlHits = combined.match(URL_REGEX)?.length || 0;

  if (urlHits > 4) {
    return true;
  }

  return /(.)\1{11,}/.test(combined);
};

const buildValidationErrors = (payload: UnknownRecord): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  BASE_REQUIRED_FIELDS.forEach((field) => {
    if (!payload[field]) {
      fieldErrors[field] = 'This field is required.';
    }
  });

  if (payload.email && !EMAIL_REGEX.test(payload.email)) {
    fieldErrors.email = 'Please enter a valid email address.';
  }

  if (payload.website) {
    try {
      new URL(payload.website);
    } catch {
      fieldErrors.website = 'Please enter a valid URL.';
    }
  }

  return fieldErrors;
};

export default factories.createCoreController('api::lead.lead', ({ strapi }) => ({
  async create(ctx, next) {
    return this.submit(ctx, next);
  },

  async submit(ctx, _next) {
    const rawData = (ctx.request.body && ctx.request.body.data) || {};

    const payload = Object.entries(rawData).reduce<UnknownRecord>((accumulator, [key, value]) => {
      accumulator[key] = sanitizeString(value);
      return accumulator;
    }, {});

    payload.sourcePath = normalizeSourcePath(payload.sourcePath || '');
    payload.locale = normalizeLocale(payload.locale || ctx.request.headers['accept-language'] || 'en');
    payload.website = normalizeUrlValue(payload.website || '');

    const fieldErrors = buildValidationErrors(payload);

    if (isSpamLike(payload)) {
      return ctx.badRequest('Validation failed', {
        fieldErrors,
        globalErrors: ['Submission rejected by anti-spam protection.'],
      });
    }

    if (Object.keys(fieldErrors).length > 0) {
      return ctx.badRequest('Validation failed', {
        fieldErrors,
        globalErrors: [],
      });
    }

    const qualificationAnswers = QUALIFICATION_FIELDS.reduce<Record<string, string>>((accumulator, fieldName) => {
      if (payload[fieldName] !== undefined && payload[fieldName] !== '') {
        accumulator[fieldName] = payload[fieldName];
      }
      return accumulator;
    }, {});

    const leadData: Record<string, unknown> = {
      submittedAt: new Date().toISOString(),
      sourcePath: payload.sourcePath,
      locale: payload.locale,
      qualificationAnswers,
    };

    LEAD_FIELDS.forEach((field) => {
      if (payload[field] !== undefined && payload[field] !== '') {
        leadData[field] = payload[field];
      }
    });

    const createdLead = await strapi.entityService.create('api::lead.lead', {
      data: leadData as any,
    });

    ctx.status = 201;
    ctx.body = {
      data: {
        id: createdLead.id,
        submittedAt: createdLead.submittedAt || null,
      },
      error: null,
    };
  },
}));
