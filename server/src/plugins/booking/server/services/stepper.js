'use strict';

const DEFAULT_CONTACT_FIELDS = Object.freeze({
  name: { visible: true, required: true },
  email: { visible: true, required: true },
  phone: { visible: true, required: false },
  companyName: { visible: true, required: false },
  websiteUrl: { visible: true, required: false },
});
const CHOICE_TYPES = new Set(['radio', 'select', 'checkbox']);
const VALID_QUESTION_KEY = /^[a-z][a-z0-9_]*$/;

const jsonValue = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return fallback; }
};
const normalizeContactFields = (value) => {
  const input = jsonValue(value, {});
  return Object.fromEntries(Object.entries(DEFAULT_CONTACT_FIELDS).map(([key, fallback]) => [
    key,
    key === 'name' || key === 'email'
      ? { visible: true, required: true }
      : { ...fallback, ...(input?.[key] || {}) },
  ]));
};
const sanitizeQuestion = (question, includeScoring = false) => {
  const options = jsonValue(question.options, []).map((option) => ({
    label: String(option?.label || option || ''),
    value: String(option?.value || option?.label || option || ''),
    ...(includeScoring ? { score: Number(option?.score ?? option?.weight ?? 0) || 0 } : {}),
  }));
  return {
    key: question.key,
    title: question.title,
    type: question.type,
    order: Number(question.order) || 0,
    required: question.required !== false,
    helpText: question.helpText || '',
    placeholder: question.placeholder || '',
    options,
    ...(includeScoring ? { weight: Number(question.weight) || 0 } : {}),
  };
};
const maximumQuestionScore = (question) => {
  const weight = Math.max(0, Number(question.weight) || 0);
  const scores = jsonValue(question.options, []).map((option) => Number(option?.score ?? option?.weight ?? 0) || 0);
  if (question.type === 'checkbox') return scores.reduce((total, score) => total + Math.max(0, score), 0);
  if (question.type === 'radio' || question.type === 'select') return Math.max(0, ...scores);
  return weight;
};

module.exports = ({ strapi }) => ({
  normalizeContactFields,
  async findByKey(key) {
    return strapi.db.query('plugin::booking.stepper').findOne({ where: { key }, populate: { questions: true } });
  },
  async list() {
    const results = await strapi.db.query('plugin::booking.stepper').findMany({ populate: { questions: true }, orderBy: { updatedAt: 'desc' } });
    return results.map((item) => ({ ...item, publishedSnapshot: undefined, questionCount: item.questions?.length || 0 }));
  },
  async getRuntime(key, locale = 'en', includeScoring = false) {
    const stepper = await this.findByKey(key);
    if (!stepper || stepper.status !== 'published') {
      const error = new Error('STEPPER_NOT_PUBLISHED'); error.status = 404; throw error;
    }
    const snapshot = jsonValue(stepper.publishedSnapshot, {});
    const localized = snapshot.locales?.[locale] || snapshot.locales?.en;
    if (!localized) { const error = new Error('STEPPER_TRANSLATION_MISSING'); error.status = 503; throw error; }
    return {
      key: stepper.key,
      name: stepper.name,
      version: Number(stepper.version),
      qualificationEnabled: stepper.qualificationEnabled !== false,
      contactFields: normalizeContactFields(stepper.contactFields),
      questions: localized.questions.map((question) => includeScoring ? question : sanitizeQuestion(question, false)),
      ...(includeScoring ? { qualificationThreshold: Number(stepper.qualificationThreshold) || 0 } : {}),
    };
  },
  async publish(id) {
    const stepper = await strapi.db.query('plugin::booking.stepper').findOne({ where: { id: Number(id) } });
    if (!stepper) { const error = new Error('STEPPER_NOT_FOUND'); error.status = 404; throw error; }
    const questions = await strapi.db.query('api::lead-question.lead-question').findMany({ where: { stepper: Number(id), active: true }, orderBy: { order: 'asc' } });
    const englishQuestions = questions.filter((question) => (question.locale || 'en') === 'en');
    const arabicQuestions = questions.filter((question) => question.locale === 'ar');
    if (!englishQuestions.length) { const error = new Error('STEPPER_EN_QUESTIONS_REQUIRED'); error.status = 400; throw error; }
    if (!arabicQuestions.length) { const error = new Error('STEPPER_AR_QUESTIONS_REQUIRED'); error.status = 400; throw error; }

    const arabicByDocument = new Map(arabicQuestions.filter((question) => question.documentId).map((question) => [question.documentId, question]));
    const arabicByKey = new Map(arabicQuestions.filter((question) => question.key).map((question) => [question.key, question]));
    const usedKeys = new Set();
    let generatedNumber = 1;
    const nextGeneratedKey = () => {
      while (usedKeys.has(`question_${generatedNumber}`)) generatedNumber += 1;
      const key = `question_${generatedNumber}`;
      usedKeys.add(key);
      generatedNumber += 1;
      return key;
    };
    const repairs = [];
    const pairedQuestions = englishQuestions.map((english) => {
      let key = String(english.key || '').trim();
      if (!VALID_QUESTION_KEY.test(key) || usedKeys.has(key)) key = nextGeneratedKey();
      else usedKeys.add(key);
      const arabic = (english.documentId && arabicByDocument.get(english.documentId)) || arabicByKey.get(english.key);
      if (english.key !== key) repairs.push({ question: english, locale: 'en', key });
      if (arabic && arabic.key !== key) repairs.push({ question: arabic, locale: 'ar', key });
      return [{ ...english, key }, arabic ? { ...arabic, key } : null];
    });
    if (repairs.length && typeof strapi.documents === 'function') {
      await Promise.all(repairs.map(({ question, locale, key }) => strapi
        .documents('api::lead-question.lead-question')
        .update({ documentId: question.documentId, locale, data: { key }, status: 'published' })));
    }

    const missingInArabic = pairedQuestions.filter(([, arabic]) => !arabic).map(([english]) => english.key);
    const pairedArabicDocuments = new Set(pairedQuestions.map(([, arabic]) => arabic?.documentId || arabic?.id).filter(Boolean));
    const missingInEnglish = arabicQuestions
      .filter((question) => !pairedArabicDocuments.has(question.documentId || question.id))
      .map((question) => question.key || `record_${question.id}`);
    if (missingInArabic.length || missingInEnglish.length) {
      const error = new Error('STEPPER_TRANSLATIONS_MISMATCH');
      error.status = 400;
      error.details = { missingInArabic, missingInEnglish };
      throw error;
    }

    const normalizedQuestions = {
      en: pairedQuestions.map(([english]) => english),
      ar: pairedQuestions.map(([, arabic]) => arabic),
    };
    const locales = {};
    for (const locale of ['en', 'ar']) {
      const localized = normalizedQuestions[locale];
      const keys = new Set();
      localized.forEach((question) => {
        if (!question.title?.trim()) { const error = new Error('STEPPER_QUESTION_TEXT_REQUIRED'); error.status = 400; error.details = { locale, questionKey: question.key }; throw error; }
        if (!VALID_QUESTION_KEY.test(question.key) || keys.has(question.key)) { const error = new Error('STEPPER_QUESTION_KEYS_INVALID'); error.status = 400; error.details = { locale, questionKey: question.key }; throw error; }
        keys.add(question.key);
        if (CHOICE_TYPES.has(question.type)) {
          const options = jsonValue(question.options, []);
          if (!options.length) { const error = new Error('STEPPER_OPTIONS_REQUIRED'); error.status = 400; error.details = { locale, questionKey: question.key }; throw error; }
          const values = options.map((option) => String(option?.value || '').trim());
          if (values.some((value) => !value) || new Set(values).size !== values.length) { const error = new Error('STEPPER_OPTION_VALUES_INVALID'); error.status = 400; error.details = { locale, questionKey: question.key }; throw error; }
        }
      });
      locales[locale] = { questions: localized.map((question) => sanitizeQuestion(question, true)) };
    }
    const maxScore = locales.en.questions.reduce((total, question) => total + maximumQuestionScore(question), 0);
    if (stepper.qualificationEnabled !== false && Number(stepper.qualificationThreshold) > maxScore) {
      const error = new Error('STEPPER_THRESHOLD_UNREACHABLE');
      error.status = 400;
      error.details = { qualificationThreshold: Number(stepper.qualificationThreshold) || 0, maximumScore: maxScore };
      throw error;
    }
    const version = Number(stepper.version || 0) + 1;
    return strapi.db.query('plugin::booking.stepper').update({ where: { id: stepper.id }, data: {
      status: 'published', version, publishedAt: new Date().toISOString(), archivedAt: null,
      contactFields: normalizeContactFields(stepper.contactFields),
      publishedSnapshot: { version, locales },
    } });
  },
});
