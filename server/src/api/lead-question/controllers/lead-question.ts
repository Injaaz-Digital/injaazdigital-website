import { factories } from '@strapi/strapi';

const publicQuestion = (question: any) => {
  const options = Array.isArray(question?.options)
    ? question.options.map((option: any) => ({ label: option?.label || String(option || ''), value: option?.value || option?.label || String(option || '') }))
    : [];
  const { weight: _weight, stepper: _stepper, ...safe } = question || {};
  return { ...safe, options };
};

export default factories.createCoreController('api::lead-question.lead-question', () => ({
  async find(ctx) {
    const response = await super.find(ctx);
    response.data = Array.isArray(response.data) ? response.data.map(publicQuestion) : [];
    return response;
  },
  async findOne(ctx) {
    const response = await super.findOne(ctx);
    response.data = response.data ? publicQuestion(response.data) : null;
    return response;
  },
}));
