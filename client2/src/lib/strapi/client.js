export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

export class StrapiRequestError extends Error {
  constructor(message, status, path) {
    super(message);
    this.name = 'StrapiRequestError';
    this.status = status;
    this.path = path;
  }
}

const appendQuery = (searchParams, key, value) => {
  if (value === undefined || value === null || value === '') return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => appendQuery(searchParams, `${key}[${index}]`, item));
    return;
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendQuery(searchParams, `${key}[${childKey}]`, childValue);
    });
    return;
  }

  searchParams.append(key, String(value));
};

export const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => appendQuery(searchParams, key, value));
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const request = async (path, params) => {
  const query = buildQuery(params);
  const response = await fetch(`${API_BASE_URL}${path}${query}`, {
    headers: STRAPI_API_TOKEN
      ? {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        }
      : undefined,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new StrapiRequestError(`Request failed (${response.status}) for ${path}`, response.status, path);
  }

  return response.json();
};

export const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new StrapiRequestError(
      payload?.error?.message || payload?.message || `Request failed (${response.status}) for ${path}`,
      response.status,
      path
    );
    error.payload = payload;
    throw error;
  }

  return payload;
};
