import { factories } from '@strapi/strapi';
import crypto from 'node:crypto';

const DEFAULT_QUALIFICATION_THRESHOLD = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PROTOCOL_REGEX = /^https?:\/\//i;
const PHONE_REGEX = /^[\d\s+()\-]{7,25}$/;
const MAX_FIELD_LENGTH = 2000;

type UnknownRecord = Record<string, any>;

const SESSION_POPULATE = {
  lead: {
    fields: ['id'],
  },
};

const CONTACT_FIELDS = ['name', 'fullName', 'email', 'phone', 'companyName', 'websiteUrl', 'website'] as const;
const LEGACY_QUALIFICATION_FIELDS = [
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

const sanitizeString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_FIELD_LENGTH);
};

const sanitizeText = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, MAX_FIELD_LENGTH);
};

const normalizeLocale = (value: unknown): 'en' | 'ar' => {
  const lowered = String(value || '').toLowerCase();
  return lowered.startsWith('ar') ? 'ar' : 'en';
};

const normalizeBoolean = (value: unknown, fallback = true): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }

  return fallback;
};

const normalizeThreshold = (value: unknown, fallback = DEFAULT_QUALIFICATION_THRESHOLD): number => {
  const threshold = Number(value);
  return Number.isFinite(threshold) && threshold >= 0 ? threshold : fallback;
};

const normalizeSourcePath = (value: unknown): string => {
  const raw = sanitizeString(value);
  if (!raw) {
    return '/';
  }

  if (raw.startsWith('/')) {
    return raw;
  }

  try {
    const asUrl = new URL(raw);
    return asUrl.pathname || '/';
  } catch {
    return '/';
  }
};

const normalizeUrlValue = (value: unknown): string => {
  const raw = sanitizeString(value);
  if (!raw) {
    return '';
  }

  const candidate = URL_PROTOCOL_REGEX.test(raw) ? raw : `https://${raw}`;

  try {
    new URL(candidate);
    return candidate;
  } catch {
    return '';
  }
};

const normalizeScalarAnswer = (value: unknown): string => sanitizeText(value);

const normalizeAnswer = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeScalarAnswer(item)).filter(Boolean);
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return normalizeScalarAnswer(value);
};

const isEmptyAnswer = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'number') {
    return Number.isNaN(value);
  }

  return !value;
};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const normalizeComparableValue = (value: unknown) => String(value ?? '').trim().toLowerCase();

const getOptionScore = (option: unknown): number | null => {
  if (!option || typeof option !== 'object' || Array.isArray(option)) {
    return null;
  }

  const maybeScore = Number((option as UnknownRecord).score ?? (option as UnknownRecord).weight);
  return Number.isFinite(maybeScore) ? maybeScore : null;
};

const optionMatchesAnswer = (option: unknown, answer: unknown): boolean => {
  const normalizedAnswer = normalizeComparableValue(answer);
  if (!normalizedAnswer) {
    return false;
  }

  if (!option || typeof option !== 'object' || Array.isArray(option)) {
    return normalizeComparableValue(option) === normalizedAnswer;
  }

  const record = option as UnknownRecord;
  return [record.value, record.label, record.title].some((candidate) => normalizeComparableValue(candidate) === normalizedAnswer);
};

const resolveScoreValue = (question: UnknownRecord | null, answer: unknown): number => {
  if (!question || isEmptyAnswer(answer)) {
    return 0;
  }

  const options = asArray(question.options);
  const answers = Array.isArray(answer) ? answer : [answer];
  let matchedScore = 0;
  let matchedScoredOption = false;

  for (const item of answers) {
    for (const option of options) {
      if (optionMatchesAnswer(option, item)) {
        const optionScore = getOptionScore(option);
        if (optionScore !== null) {
          matchedScoredOption = true;
          matchedScore += optionScore;
        }
      }
    }
  }

  if (matchedScoredOption) {
    return matchedScore;
  }

  const weight = Number(question.weight ?? 0);
  return Number.isFinite(weight) ? weight : 0;
};

const buildAnswersJson = (responses: UnknownRecord[]) =>
  responses.reduce<Record<string, unknown>>((accumulator, response) => {
    accumulator[String(response.questionKey)] = response.answer;
    return accumulator;
  }, {});

const toJsonField = (value: unknown) => JSON.stringify(value ?? null);

const nowIso = () => new Date().toISOString();
const hashSessionToken = (token: string) => {
  const pepper = process.env.BOOKING_SESSION_PEPPER || process.env.APP_KEYS?.split(',')[0] || '';
  return crypto.createHash('sha256').update(`${pepper}|${token}`).digest('hex');
};

export default factories.createCoreService('api::lead.lead', ({ strapi }) => ({
  sanitizeString,
  normalizeSourcePath,
  normalizeUrlValue,

  async getBookingQuestionSettings(_localeValue: unknown = 'en') {
    const calendarSetting = (await strapi.entityService.findMany(
      'api::calendar-setting.calendar-setting'
    )) as UnknownRecord | null;
    return {
      questionsBeforeBookingEnabled: normalizeBoolean(
        calendarSetting?.questionsBeforeBookingEnabled,
        true
      ),
      qualificationThreshold: normalizeThreshold(
        calendarSetting?.qualificationThreshold,
        DEFAULT_QUALIFICATION_THRESHOLD
      ),
    };
  },

  async startSession(payload: UnknownRecord = {}) {
    const sourcePage = normalizeSourcePath(payload.sourcePage || payload.sourcePath || '/');
    const ctaSource = sanitizeString(payload.ctaSource);
    const locale = normalizeLocale(payload.locale);
    const timestamp = nowIso();
    const stepperKey = sanitizeString(payload.stepperKey);
    let stepperSnapshot: UnknownRecord | null = null;
    if (stepperKey) {
      stepperSnapshot = await strapi.plugin('booking').service('stepper').getRuntime(stepperKey, locale, true);
      if (Number(payload.stepperVersion) !== Number(stepperSnapshot.version)) {
        const error = new Error('STEPPER_VERSION_CHANGED');
        (error as any).status = 409;
        throw error;
      }
    }
    const globalQuestionSettings = await this.getBookingQuestionSettings(locale);
    const questionsBeforeBookingEnabled = stepperSnapshot
      ? stepperSnapshot.qualificationEnabled !== false
      : globalQuestionSettings.questionsBeforeBookingEnabled;
    const qualificationThreshold = stepperSnapshot
      ? normalizeThreshold(stepperSnapshot.qualificationThreshold, 0)
      : globalQuestionSettings.qualificationThreshold;

    const lead = await strapi.entityService.create('api::lead.lead', {
      data: {
        status: 'in_progress',
        score: 0,
        questionsBeforeBookingEnabled,
        qualificationThreshold,
        sourcePage,
        sourcePath: sourcePage,
        ctaSource,
        locale,
        stepperKey: stepperSnapshot?.key || null,
        stepperVersion: stepperSnapshot?.version || null,
        lastActivityAt: timestamp,
      },
    });

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionTokenHash = hashSessionToken(sessionToken);
    const sessionTtlHours = Number(process.env.BOOKING_SESSION_TTL_HOURS || 24);
    await strapi.entityService.create('api::lead-session.lead-session', {
      data: {
        lead: lead.id,
        sessionToken: sessionTokenHash,
        sessionTokenHash,
        expiresAt: new Date(Date.now() + sessionTtlHours * 3600000).toISOString(),
        currentStep: Math.max(0, Number(payload.currentStep) || 0),
        completed: false,
        startedAt: timestamp,
        lastSeenAt: timestamp,
        stepperKey: stepperSnapshot?.key || null,
        stepperVersion: stepperSnapshot?.version || null,
        stepperSnapshot: stepperSnapshot || null,
      },
    });

    return {
      leadId: lead.id,
      sessionToken,
      stepperKey: stepperSnapshot?.key || null,
      stepperVersion: stepperSnapshot?.version || null,
    };
  },

  async validateSession(leadId: unknown, sessionToken: unknown) {
    const normalizedLeadId = Number(leadId);
    const normalizedToken = sanitizeString(sessionToken);

    if (!Number.isInteger(normalizedLeadId) || normalizedLeadId <= 0 || !normalizedToken) {
      throw new Error('INVALID_SESSION');
    }

    const tokenHash = hashSessionToken(normalizedToken);
    const legacyUntil = process.env.BOOKING_LEGACY_TOKEN_UNTIL ? new Date(process.env.BOOKING_LEGACY_TOKEN_UNTIL) : null;
    const allowLegacy = Boolean(legacyUntil && !Number.isNaN(legacyUntil.valueOf()) && legacyUntil > new Date());
    const session = await strapi.db.query('api::lead-session.lead-session').findOne({
      where: {
        lead: normalizedLeadId,
        revokedAt: { $null: true },
        $or: [
          { sessionTokenHash: tokenHash },
          { sessionToken: tokenHash },
          ...(allowLegacy ? [{ sessionToken: normalizedToken }] : []),
        ],
      },
      populate: SESSION_POPULATE,
    });

    if (!session?.id || (session.expiresAt && new Date(session.expiresAt) <= new Date())) {
      throw new Error('INVALID_SESSION');
    }

    if (!session.sessionTokenHash && allowLegacy) {
      await strapi.db.query('api::lead-session.lead-session').update({
        where: { id: session.id },
        data: { sessionToken: tokenHash, sessionTokenHash: tokenHash, expiresAt: new Date(Date.now() + Number(process.env.BOOKING_SESSION_TTL_HOURS || 24) * 3600000).toISOString() },
      });
    }

    return session;
  },

  async saveResponse(payload: UnknownRecord = {}) {
    const leadId = Number(payload.leadId);
    const session = await this.validateSession(leadId, payload.sessionToken);
    const questionKey = sanitizeString(payload.questionKey);
    const currentStep = Number(payload.currentStep);

    if (!questionKey) {
      throw new Error('QUESTION_KEY_REQUIRED');
    }

    const lead = (await strapi.entityService.findOne('api::lead.lead', leadId, {
      fields: ['locale', 'questionsBeforeBookingEnabled', 'qualificationThreshold'],
    })) as UnknownRecord | null;
    const globalQuestionSettings = await this.getBookingQuestionSettings(lead?.locale);
    const bookingQuestionSettings = {
      questionsBeforeBookingEnabled: normalizeBoolean(
        lead?.questionsBeforeBookingEnabled,
        globalQuestionSettings.questionsBeforeBookingEnabled
      ),
      qualificationThreshold: normalizeThreshold(
        lead?.qualificationThreshold,
        globalQuestionSettings.qualificationThreshold
      ),
    };

    if (!bookingQuestionSettings.questionsBeforeBookingEnabled) {
      throw new Error('QUESTION_NOT_FOUND');
    }

    const sessionSnapshot = typeof session.stepperSnapshot === 'string'
      ? JSON.parse(session.stepperSnapshot)
      : session.stepperSnapshot;
    const snapshotQuestion = sessionSnapshot?.questions?.find((item: UnknownRecord) => item.key === questionKey);
    const question = snapshotQuestion ||
      (await strapi.db.query('api::lead-question.lead-question').findOne({
        where: {
          key: questionKey,
          active: true,
          locale: normalizeLocale(lead?.locale),
        },
      })) ||
      (await strapi.db.query('api::lead-question.lead-question').findOne({
        where: {
          key: questionKey,
          active: true,
        },
      }));

    if (!question?.key) {
      throw new Error('QUESTION_NOT_FOUND');
    }

    const answer = normalizeAnswer(payload.answer);
    if (question.required && isEmptyAnswer(answer)) {
      throw new Error('ANSWER_REQUIRED');
    }

    const questionTitle = sanitizeString(payload.questionTitle || question.title);
    const scoreValue = resolveScoreValue(question, answer);
    const timestamp = nowIso();
    const existingResponse = await strapi.db.query('api::lead-response.lead-response').findOne({
      where: {
        lead: leadId,
        questionKey,
      },
    });

    const responseData = {
      lead: leadId,
      question: question.id || null,
      questionKey,
      questionTitle,
      answer: toJsonField(answer),
      scoreValue,
      answeredAt: timestamp,
    } as any;

    const response = existingResponse?.id
      ? await strapi.entityService.update('api::lead-response.lead-response', existingResponse.id, {
          data: responseData,
        })
      : await strapi.entityService.create('api::lead-response.lead-response', {
          data: responseData,
        });

    await strapi.entityService.update('api::lead.lead', leadId, {
      data: {
        lastActivityAt: timestamp,
      },
    });

    await strapi.entityService.update('api::lead-session.lead-session', session.id, {
      data: {
        currentStep: Number.isFinite(currentStep) ? Math.max(0, currentStep) : session.currentStep,
        lastSeenAt: timestamp,
      },
    });

    return {
      id: response.id,
      questionKey: response.questionKey,
      answer,
      scoreValue: response.scoreValue,
      answeredAt: response.answeredAt,
    };
  },

  async updateContact(leadId: unknown, payload: UnknownRecord = {}) {
    const session = await this.validateSession(leadId, payload.sessionToken);
    const sessionSnapshot = typeof session.stepperSnapshot === 'string' ? JSON.parse(session.stepperSnapshot) : session.stepperSnapshot;
    const contactFields = sessionSnapshot?.contactFields || {};

    const data: UnknownRecord = {};
    const fieldErrors: Record<string, string> = {};

    for (const field of CONTACT_FIELDS) {
      const configKey = field === 'fullName' ? 'name' : field === 'website' ? 'websiteUrl' : field;
      if (field in payload && contactFields?.[configKey]?.visible !== false) {
        data[field] = sanitizeString(payload[field]);
      }
    }

    const name = data.name || data.fullName;
    const email = sanitizeString(payload.email);
    const phone = sanitizeString(data.phone);
    const websiteUrl = normalizeUrlValue(data.websiteUrl || data.website);

    if (!name) {
      fieldErrors.name = 'Name is required.';
    }

    if (!email) {
      fieldErrors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      fieldErrors.phone = 'Please enter a valid phone number.';
    }

    if ((data.websiteUrl || data.website) && !websiteUrl) {
      fieldErrors.websiteUrl = 'Please enter a valid URL.';
    }
    for (const field of ['phone', 'companyName', 'websiteUrl']) {
      if (contactFields?.[field]?.visible !== false && contactFields?.[field]?.required && !sanitizeString(data[field])) {
        fieldErrors[field] = `${field} is required.`;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      const error = new Error('VALIDATION_ERROR');
      (error as any).details = { fieldErrors };
      throw error;
    }

    const updatedLead = await strapi.entityService.update('api::lead.lead', Number(leadId), {
      data: {
        name,
        fullName: name,
        email,
        phone,
        companyName: sanitizeString(data.companyName),
        websiteUrl,
        website: websiteUrl,
        status: 'partial',
        lastActivityAt: nowIso(),
      },
    });

    return {
      id: updatedLead.id,
      name: updatedLead.name || updatedLead.fullName,
      email: updatedLead.email,
      phone: updatedLead.phone,
      companyName: updatedLead.companyName,
      websiteUrl: updatedLead.websiteUrl || updatedLead.website,
      status: updatedLead.status,
    };
  },

  async completeLead(leadId: unknown, payload: UnknownRecord = {}) {
    const session = await this.validateSession(leadId, payload.sessionToken);
    const normalizedLeadId = Number(leadId);
    const [lead, responses] = await Promise.all([
      strapi.entityService.findOne('api::lead.lead', normalizedLeadId, {
        populate: {
          meetings: true,
        },
      }),
      strapi.entityService.findMany('api::lead-response.lead-response', {
        filters: {
          lead: {
            id: {
              $eq: normalizedLeadId,
            },
          },
        },
        sort: ['answeredAt:asc'],
      }),
    ]);

    const globalQuestionSettings = await this.getBookingQuestionSettings((lead as UnknownRecord)?.locale);
    const bookingQuestionSettings = {
      questionsBeforeBookingEnabled: normalizeBoolean(
        (lead as UnknownRecord)?.questionsBeforeBookingEnabled,
        globalQuestionSettings.questionsBeforeBookingEnabled
      ),
      qualificationThreshold: normalizeThreshold(
        (lead as UnknownRecord)?.qualificationThreshold,
        globalQuestionSettings.qualificationThreshold
      ),
    };
    const sessionSnapshot = typeof session.stepperSnapshot === 'string' ? JSON.parse(session.stepperSnapshot) : session.stepperSnapshot;
    const activeQuestions = sessionSnapshot?.questions || (bookingQuestionSettings.questionsBeforeBookingEnabled
      ? await strapi.entityService.findMany('api::lead-question.lead-question', {
          locale: normalizeLocale((lead as UnknownRecord)?.locale),
          filters: {
            active: {
              $eq: true,
            },
          },
          sort: ['order:asc'],
        })
      : []);

    const questionsByKey = new Map(activeQuestions.map((question: UnknownRecord) => [question.key, question]));
    let totalScore = 0;
    const normalizedResponses = responses.map((response: UnknownRecord) => {
      const question = questionsByKey.get(response.questionKey) || null;
      const scoreValue = resolveScoreValue(question, response.answer);
      totalScore += scoreValue;
      return {
        ...response,
        scoreValue,
      };
    });

    await Promise.all(
      normalizedResponses.map((response: UnknownRecord) =>
        strapi.entityService.update('api::lead-response.lead-response', response.id, {
          data: {
            scoreValue: response.scoreValue,
          },
        })
      )
    );

    const answersJson = buildAnswersJson(normalizedResponses);
    const serviceInterest = String(
      answersJson.service_interest ?? answersJson.serviceInterest ?? answersJson.service ?? lead?.serviceInterest ?? ''
    ).trim();
    const qualified =
      !bookingQuestionSettings.questionsBeforeBookingEnabled ||
      totalScore >= bookingQuestionSettings.qualificationThreshold;
    const status = qualified ? 'qualified' : 'unqualified';
    const timestamp = nowIso();

    await Promise.all([
      strapi.entityService.update('api::lead.lead', normalizedLeadId, {
        data: {
          score: totalScore,
          status,
          serviceInterest: serviceInterest || lead?.serviceInterest || null,
          answersJson: toJsonField(answersJson),
          qualificationAnswers: toJsonField(answersJson),
          submittedAt: lead?.submittedAt || timestamp,
          lastActivityAt: timestamp,
        },
      }),
      strapi.entityService.update('api::lead-session.lead-session', session.id, {
        data: {
          completed: true,
          completedAt: timestamp,
          lastSeenAt: timestamp,
          currentStep: activeQuestions.length,
        },
      }),
    ]);

    return {
      leadId: normalizedLeadId,
      qualified,
      score: totalScore,
      status,
      serviceInterest: serviceInterest || null,
    };
  },

  async submitLegacy(rawData: UnknownRecord = {}) {
    const payload = Object.entries(rawData).reduce<UnknownRecord>((accumulator, [key, value]) => {
      accumulator[key] = sanitizeText(value);
      return accumulator;
    }, {});

    const name = sanitizeString(payload.fullName || payload.name);
    const email = sanitizeString(payload.email);
    const websiteUrl = normalizeUrlValue(payload.website || payload.websiteUrl);
    const fieldErrors: Record<string, string> = {};

    if (!name) {
      fieldErrors.fullName = 'This field is required.';
    }

    if (!email) {
      fieldErrors.email = 'This field is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }

    if ((payload.website || payload.websiteUrl) && !websiteUrl) {
      fieldErrors.website = 'Please enter a valid URL.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      const error = new Error('VALIDATION_ERROR');
      (error as any).details = { fieldErrors, globalErrors: [] };
      throw error;
    }

    const qualificationAnswers = LEGACY_QUALIFICATION_FIELDS.reduce<Record<string, string>>((accumulator, fieldName) => {
      if (payload[fieldName]) {
        accumulator[fieldName] = payload[fieldName];
      }
      return accumulator;
    }, {});

    const createdLead = await strapi.entityService.create('api::lead.lead', {
      data: {
        name,
        fullName: name,
        email,
        phone: sanitizeString(payload.phone),
        companyName: sanitizeString(payload.companyName),
        websiteUrl,
        website: websiteUrl,
        sourcePage: normalizeSourcePath(payload.sourcePath),
        sourcePath: normalizeSourcePath(payload.sourcePath),
        locale: normalizeLocale(payload.locale),
        qualificationAnswers: toJsonField(qualificationAnswers),
        answersJson: toJsonField(qualificationAnswers),
        submittedAt: nowIso(),
        lastActivityAt: nowIso(),
        status: 'completed',
        service: sanitizeText(payload.service),
        audience: sanitizeText(payload.audience),
        experience: sanitizeString(payload.experience),
        current_dislikes: sanitizeText(payload.current_dislikes),
        challenge: sanitizeText(payload.challenge),
        prev_investment: sanitizeString(payload.prev_investment),
        goal: sanitizeText(payload.goal),
        success_metric: sanitizeText(payload.success_metric),
        vision: sanitizeText(payload.vision),
        platform_type: sanitizeString(payload.platform_type),
        features: sanitizeText(payload.features),
        examples: sanitizeText(payload.examples),
        budget: sanitizeString(payload.budget),
        timeline: sanitizeString(payload.timeline),
        decision_maker: sanitizeString(payload.decision_maker),
      },
    });

    return {
      id: createdLead.id,
      submittedAt: createdLead.submittedAt || null,
    };
  },
}));
