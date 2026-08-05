const normalizeOption = (option) => {
  if (typeof option === 'string') {
    return { value: option, label: option };
  }

  if (!option || typeof option !== 'object') {
    return null;
  }

  const value = String(option.value ?? option.label ?? option.title ?? '').trim();
  if (!value) {
    return null;
  }

  return {
    value,
    label: String(option.label ?? option.title ?? option.value ?? value).trim(),
  };
};

export const normalizeQuestions = (questions = []) =>
  questions
    .map((question, index) => ({
      id: question.id,
      key: String(question.key || `question_${index + 1}`).trim(),
      title: String(question.title || '').trim(),
      type: String(question.type || 'text').trim(),
      order: Number(question.order ?? index + 1),
      required: question.required !== false,
      helpText: typeof question.helpText === 'string' ? question.helpText : '',
      placeholder: typeof question.placeholder === 'string' ? question.placeholder : '',
      category: typeof question.category === 'string' ? question.category : '',
      stepKey: typeof question.stepKey === 'string' ? question.stepKey : '',
      options: Array.isArray(question.options) ? question.options.map(normalizeOption).filter(Boolean) : [],
    }))
    .filter((question) => question.title && question.key)
    .sort((left, right) => left.order - right.order);
