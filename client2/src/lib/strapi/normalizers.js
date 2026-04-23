export const normalizeValue = (value) => {
  if (Array.isArray(value)) return value.map((item) => normalizeValue(item));
  if (!value || typeof value !== 'object') return value;

  if ('data' in value && Object.keys(value).length === 1) {
    return normalizeValue(value.data);
  }

  if ('attributes' in value) {
    return normalizeValue({ id: value.id, ...value.attributes });
  }

  return Object.entries(value).reduce((accumulator, [key, item]) => {
    accumulator[key] = normalizeValue(item);
    return accumulator;
  }, {});
};

