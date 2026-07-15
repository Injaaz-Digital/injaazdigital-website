'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const createStepperService = require('../services/stepper');

const questions = ['en', 'ar'].flatMap((locale) => [
  { id: locale === 'en' ? 1 : 2, locale, key: 'budget', title: locale === 'en' ? 'Budget?' : 'الميزانية؟', type: 'radio', order: 1, required: true, active: true, weight: 0, options: [{ label: 'Ready', value: 'ready', score: 8 }] },
]);

const makeService = (questionRecords = questions) => {
  let stepper = { id: 1, name: 'Sales', key: 'sales', status: 'draft', version: 0, qualificationEnabled: true, qualificationThreshold: 8, contactFields: {} };
  const strapi = { db: { query: (uid) => ({
    findOne: async () => stepper,
    findMany: async () => uid === 'api::lead-question.lead-question' ? questionRecords : [],
    update: async ({ data }) => (stepper = { ...stepper, ...data }),
  }) } };
  return createStepperService({ strapi });
};

test('publishing creates an immutable bilingual version and runtime hides scoring', async () => {
  const service = makeService();
  const published = await service.publish(1);
  assert.equal(published.version, 1);
  assert.equal(published.status, 'published');
  const runtime = await service.getRuntime('sales', 'en', false);
  assert.equal(runtime.questions[0].options[0].score, undefined);
  assert.equal(runtime.qualificationThreshold, undefined);
});

test('server runtime retains scoring for session snapshots', async () => {
  const service = makeService();
  await service.publish(1);
  const runtime = await service.getRuntime('sales', 'ar', true);
  assert.equal(runtime.questions[0].options[0].score, 8);
  assert.equal(runtime.qualificationThreshold, 8);
});

test('publishing accepts matching translations saved in a different row order', async () => {
  const translatedQuestions = [
    { ...questions[0], key: 'budget', order: 1 },
    { ...questions[0], id: 3, key: 'timeline', title: 'Timeline?', order: 2 },
    { ...questions[1], key: 'budget', order: 2 },
    { ...questions[1], id: 4, key: 'timeline', title: 'المدة؟', order: 1 },
  ];
  const service = makeService(translatedQuestions);
  await service.publish(1);
  const runtime = await service.getRuntime('sales', 'ar', true);
  assert.deepEqual(runtime.questions.map((question) => question.key), ['budget', 'timeline']);
});

test('publishing repairs invalid and duplicate legacy keys by bilingual document pair', async () => {
  const legacyQuestions = [
    { ...questions[0], id: 1, documentId: 'doc-a', key: '', order: 1 },
    { ...questions[0], id: 3, documentId: 'doc-b', key: '', title: 'Timeline?', order: 2 },
    { ...questions[1], id: 2, documentId: 'doc-a', key: 'مفتاح', order: 1 },
    { ...questions[1], id: 4, documentId: 'doc-b', key: 'مفتاح', title: 'المدة؟', order: 2 },
  ];
  const service = makeService(legacyQuestions);
  await service.publish(1);
  const english = await service.getRuntime('sales', 'en', true);
  const arabic = await service.getRuntime('sales', 'ar', true);
  assert.deepEqual(english.questions.map((question) => question.key), ['question_1', 'question_2']);
  assert.deepEqual(arabic.questions.map((question) => question.key), ['question_1', 'question_2']);
});

test('publishing identifies duplicate stored option values', async () => {
  const invalidQuestions = questions.map((question) => ({
    ...question,
    options: [
      { label: 'First', value: 'option_1', score: 1 },
      { label: 'Second', value: 'option_1', score: 2 },
    ],
  }));
  const service = makeService(invalidQuestions);
  await assert.rejects(() => service.publish(1), { message: 'STEPPER_OPTION_VALUES_INVALID' });
});

test('checkbox maximum score includes every selectable positive option', async () => {
  const checkboxQuestions = questions.map((question) => ({
    ...question,
    type: 'checkbox',
    options: [
      { label: 'First', value: 'option_1', score: 4 },
      { label: 'Second', value: 'option_2', score: 4 },
    ],
  }));
  const service = makeService(checkboxQuestions);
  const published = await service.publish(1);
  assert.equal(published.status, 'published');
});
