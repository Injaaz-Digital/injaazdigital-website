'use strict';

const RESOURCES = {
  leads: { uid: 'api::lead.lead', populate: { meetings: true, leadNotes: true, responses: true }, orderBy: { updatedAt: 'desc' } },
  meetings: { uid: 'api::meeting.meeting', populate: { lead: true }, orderBy: { start: 'desc' } },
  notes: { uid: 'api::lead-note.lead-note', populate: { lead: true }, orderBy: { createdAt: 'desc' } },
  questions: { uid: 'api::lead-question.lead-question', populate: {}, orderBy: { order: 'asc' } },
  responses: { uid: 'api::lead-response.lead-response', populate: { lead: true, question: true }, orderBy: { answeredAt: 'desc' } },
  sessions: { uid: 'api::lead-session.lead-session', populate: { lead: true }, orderBy: { updatedAt: 'desc' } },
  reservations: { uid: 'plugin::booking.reservation', populate: {}, orderBy: { updatedAt: 'desc' } },
  audits: { uid: 'plugin::booking.audit', populate: {}, orderBy: { createdAt: 'desc' } },
};

const safeInt = (value, fallback, max = 100) => Math.min(max, Math.max(1, Number.parseInt(String(value || ''), 10) || fallback));
const resource = (key) => {
  const config = RESOURCES[key];
  if (!config) {
    const error = new Error('Unknown Injaaz Cal resource.');
    error.status = 404;
    throw error;
  }
  return config;
};

const publicFields = (body) => {
  const value = body?.data && typeof body.data === 'object' ? body.data : body;
  const data = { ...(value || {}) };
  for (const field of ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'createdBy', 'updatedBy']) delete data[field];
  return data;
};

const questionData = (body) => {
  const data = publicFields(body);
  const locale = data.locale === 'ar' ? 'ar' : 'en';
  delete data.locale;
  return { data, locale };
};

const saveQuestionTranslation = async ({ data, locale, documentId }) => {
  const service = strapi.documents('api::lead-question.lead-question');
  return documentId
    ? service.update({ documentId, locale, data, status: 'published' })
    : service.create({ locale, data, status: 'published' });
};

const otherLocale = (locale) => locale === 'ar' ? 'en' : 'ar';
const nextQuestionKey = async (stepperId) => {
  const records = await strapi.db.query('api::lead-question.lead-question').findMany({
    where: { stepper: Number(stepperId) },
    select: ['key'],
  });
  const keys = new Set(records.map((record) => String(record.key || '').trim()));
  let number = 1;
  while (keys.has(`question_${number}`)) number += 1;
  return `question_${number}`;
};
const normalizeQuestionOptions = (options) => Array.isArray(options)
  ? options.map((option, index) => ({
    label: String(option?.label || ''),
    value: `option_${index + 1}`,
    score: Number(option?.score ?? option?.weight ?? 0) || 0,
  }))
  : [];
const localizedQuestionClone = (data) => ({
  ...data,
  options: Array.isArray(data.options)
    ? data.options.map((option) => ({ ...option }))
    : data.options,
});
const sharedQuestionPatch = (data, counterpart) => {
  const shared = {};
  for (const field of ['key', 'type', 'order', 'weight', 'required', 'active', 'stepper']) {
    if (Object.prototype.hasOwnProperty.call(data, field)) shared[field] = data[field];
  }
  if (Array.isArray(data.options)) {
    const translatedOptions = Array.isArray(counterpart?.options) ? counterpart.options : [];
    shared.options = data.options.map((option, index) => ({
      label: translatedOptions[index]?.label || option.label || '',
      value: option.value,
      score: Number(option.score ?? option.weight ?? 0) || 0,
    }));
  }
  return shared;
};
const localizedQuestionPatch = (data, existing) => {
  const patch = {};
  for (const field of ['title', 'helpText', 'placeholder']) {
    if (Object.prototype.hasOwnProperty.call(data, field)) patch[field] = data[field];
  }
  if (Array.isArray(data.options)) {
    const sharedOptions = Array.isArray(existing?.options) ? existing.options : [];
    patch.options = sharedOptions.map((option, index) => ({
      ...option,
      label: data.options[index]?.label ?? option.label ?? '',
    }));
  }
  return patch;
};

module.exports = {
  async listSteppers(ctx) {
    ctx.body = { data: await strapi.plugin('booking').service('stepper').list(), error: null };
  },

  async createStepper(ctx) {
    const data = publicFields(ctx.request.body);
    const result = await strapi.db.query('plugin::booking.stepper').create({ data: {
      name: data.name, key: data.key, description: data.description || '', status: 'draft', version: 0,
      qualificationEnabled: data.qualificationEnabled !== false,
      qualificationThreshold: Math.max(0, Number(data.qualificationThreshold) || 0),
      contactFields: strapi.plugin('booking').service('stepper').normalizeContactFields(data.contactFields),
    } });
    ctx.status = 201; ctx.body = { data: result, error: null };
  },

  async updateStepper(ctx) {
    const data = publicFields(ctx.request.body);
    delete data.status; delete data.version; delete data.publishedSnapshot; delete data.publishedAt;
    if (data.contactFields) data.contactFields = strapi.plugin('booking').service('stepper').normalizeContactFields(data.contactFields);
    const result = await strapi.db.query('plugin::booking.stepper').update({ where: { id: Number(ctx.params.id) }, data: { ...data, status: 'draft' } });
    ctx.body = { data: result, error: null };
  },

  async publishStepper(ctx) {
    try { ctx.body = { data: await strapi.plugin('booking').service('stepper').publish(ctx.params.id), error: null }; }
    catch (error) { ctx.status = error.status || 400; ctx.body = { data: null, error: { code: error.message, message: error.message, details: error.details || null } }; }
  },

  async duplicateStepper(ctx) {
    const source = await strapi.db.query('plugin::booking.stepper').findOne({ where: { id: Number(ctx.params.id) } });
    if (!source) return ctx.notFound('Stepper not found.');
    const copy = await strapi.db.query('plugin::booking.stepper').create({ data: {
      name: `${source.name} Copy`, key: `${source.key}-copy-${Date.now()}`, description: source.description,
      status: 'draft', version: 0, qualificationEnabled: source.qualificationEnabled,
      qualificationThreshold: source.qualificationThreshold, contactFields: source.contactFields,
    } });
    const questions = await strapi.db.query('api::lead-question.lead-question').findMany({ where: { stepper: source.id }, orderBy: { order: 'asc' } });
    const groups = questions.reduce((result, question) => {
      if (!result.has(question.key)) result.set(question.key, []);
      result.get(question.key).push(question);
      return result;
    }, new Map());
    for (const translations of groups.values()) {
      let documentId = null;
      for (const question of translations.sort((left, right) => left.locale === 'en' ? -1 : right.locale === 'en' ? 1 : 0)) {
        const data = publicFields(question); delete data.stepper; delete data.responses; delete data.locale; data.stepper = copy.id;
        const saved = await saveQuestionTranslation({ data, locale: question.locale === 'ar' ? 'ar' : 'en', documentId });
        documentId = saved.documentId || documentId;
      }
    }
    ctx.status = 201; ctx.body = { data: copy, error: null };
  },

  async archiveStepper(ctx) {
    const result = await strapi.db.query('plugin::booking.stepper').update({ where: { id: Number(ctx.params.id) }, data: { status: 'archived', archivedAt: new Date().toISOString() } });
    ctx.body = { data: result, error: null };
  },
  async overview(ctx) {
    const counts = {};
    await Promise.all(Object.entries(RESOURCES).map(async ([key, config]) => {
      counts[key] = await strapi.db.query(config.uid).count();
    }));
    const recentMeetings = await strapi.db.query('api::meeting.meeting').findMany({
      populate: { lead: true }, orderBy: { start: 'desc' }, limit: 6,
    });
    ctx.body = { data: { counts, recentMeetings }, error: null };
  },

  async list(ctx) {
    const config = resource(ctx.params.resource);
    const page = safeInt(ctx.query.page, 1, 100000);
    const pageSize = safeInt(ctx.query.pageSize, 25, 100);
    const search = String(ctx.query.search || '').trim();
    const status = String(ctx.query.status || '').trim();
    const locale = String(ctx.query.locale || '').trim().toLowerCase();
    const where = {};
    if (status) where.status = status;
    if (ctx.params.resource === 'questions') {
      where.locale = locale === 'ar' ? 'ar' : 'en';
      if (ctx.query.stepperId) where.stepper = Number(ctx.query.stepperId);
    }
    if (search && ctx.params.resource === 'leads') {
      where.$or = [
        { name: { $containsi: search } }, { fullName: { $containsi: search } },
        { email: { $containsi: search } }, { companyName: { $containsi: search } },
      ];
    }
    if (search && ctx.params.resource === 'questions') {
      where.$or = [{ title: { $containsi: search } }, { key: { $containsi: search } }];
    }
    const [results, total] = await Promise.all([
      strapi.db.query(config.uid).findMany({ where, populate: config.populate, orderBy: config.orderBy, offset: (page - 1) * pageSize, limit: pageSize }),
      strapi.db.query(config.uid).count({ where }),
    ]);
    ctx.body = { data: { results, pagination: { page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)), total } }, error: null };
  },

  async findOne(ctx) {
    const config = resource(ctx.params.resource);
    const result = await strapi.db.query(config.uid).findOne({ where: { id: Number(ctx.params.id) }, populate: config.populate });
    if (!result) return ctx.notFound('Record not found.');
    ctx.body = { data: result, error: null };
  },

  async create(ctx) {
    const config = resource(ctx.params.resource);
    if (!['notes', 'questions'].includes(ctx.params.resource)) return ctx.forbidden('This resource is read-only in Injaaz Cal.');
    let result;
    if (ctx.params.resource === 'questions') {
      const { data } = questionData(ctx.request.body);
      const locale = 'en';
      if (!data.stepper) return ctx.badRequest('A stepper is required.');
      data.key = await nextQuestionKey(data.stepper);
      data.options = normalizeQuestionOptions(data.options);
      result = await saveQuestionTranslation({ data, locale });
      await saveQuestionTranslation({
        data: localizedQuestionClone(data),
        locale: otherLocale(locale),
        documentId: result.documentId,
      });
    } else {
      result = await strapi.entityService.create(config.uid, { data: publicFields(ctx.request.body) });
    }
    ctx.status = 201;
    ctx.body = { data: result, error: null };
  },

  async update(ctx) {
    const config = resource(ctx.params.resource);
    if (!['leads', 'meetings', 'notes', 'questions'].includes(ctx.params.resource)) return ctx.forbidden('This resource is read-only in Injaaz Cal.');
    let result;
    if (ctx.params.resource === 'questions') {
      const existing = await strapi.db.query(config.uid).findOne({ where: { id: Number(ctx.params.id) } });
      if (!existing) return ctx.notFound('Question not found.');
      const { data } = questionData(ctx.request.body);
      const locale = existing.locale === 'ar' ? 'ar' : 'en';
      delete data.key;
      if (locale === 'en' && Array.isArray(data.options)) data.options = normalizeQuestionOptions(data.options);
      const savedData = locale === 'ar' ? localizedQuestionPatch(data, existing) : data;
      result = await saveQuestionTranslation({ data: savedData, locale, documentId: existing.documentId });
      if (locale === 'en') {
        const counterpart = await strapi.db.query(config.uid).findOne({
          where: { documentId: existing.documentId, locale: 'ar' },
        });
        if (counterpart) {
          await saveQuestionTranslation({
            data: sharedQuestionPatch(data, counterpart),
            locale: 'ar',
            documentId: existing.documentId,
          });
        }
      }
    } else {
      result = await strapi.entityService.update(config.uid, Number(ctx.params.id), { data: publicFields(ctx.request.body) });
    }
    ctx.body = { data: result, error: null };
  },

  async remove(ctx) {
    const config = resource(ctx.params.resource);
    if (!['notes', 'questions'].includes(ctx.params.resource)) return ctx.forbidden('This resource cannot be deleted here.');
    let result;
    if (ctx.params.resource === 'questions') {
      const existing = await strapi.db.query(config.uid).findOne({ where: { id: Number(ctx.params.id) } });
      if (!existing) return ctx.notFound('Question not found.');
      const documents = strapi.documents(config.uid);
      const deleted = [];
      for (const locale of ['en', 'ar']) {
        deleted.push(await documents.delete({ documentId: existing.documentId, locale }));
      }
      result = deleted;
    } else {
      result = await strapi.entityService.delete(config.uid, Number(ctx.params.id));
    }
    ctx.body = { data: result, error: null };
  },

  async getSettings(ctx) {
    const result = await strapi.entityService.findMany('api::calendar-setting.calendar-setting');
    ctx.body = { data: result || {}, error: null };
  },

  async updateSettings(ctx) {
    const existing = await strapi.entityService.findMany('api::calendar-setting.calendar-setting');
    const data = publicFields(ctx.request.body);
    const result = existing?.id
      ? await strapi.entityService.update('api::calendar-setting.calendar-setting', existing.id, { data })
      : await strapi.entityService.create('api::calendar-setting.calendar-setting', { data });
    ctx.body = { data: result, error: null };
  },
};
