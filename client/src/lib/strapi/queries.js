import { request, requestJson, StrapiRequestError } from './client';
import { normalizeValue } from './normalizers';

const isSoftContentError = (error) => {
  const status = Number(error?.status);
  return (error instanceof StrapiRequestError || Number.isFinite(status)) && (status === 401 || status === 403 || status === 404);
};

export const fetchSingleType = async (contentType, locale, params = {}) => {
  try {
    const response = await request(`/api/${contentType}`, {
      locale,
      status: 'published',
      populate: '*',
      ...params,
    });

    return normalizeValue(response?.data);
  } catch (error) {
    if (isSoftContentError(error)) {
      return null;
    }
    throw error;
  }
};

export const fetchCollection = async (contentType, locale, params = {}) => {
  try {
    const response = await request(`/api/${contentType}`, {
      locale,
      status: 'published',
      populate: '*',
      ...params,
    });

    const entries = Array.isArray(response?.data) ? response.data : [];
    return entries.map((entry) => normalizeValue(entry));
  } catch (error) {
    if (isSoftContentError(error)) {
      return [];
    }
    throw error;
  }
};

export const fetchContentIndex = async (contentType, locale, params = {}) => {
  try {
    const response = await request(`/api/${contentType}`, {
      locale,
      status: 'published',
      ...params,
    });

    const entries = Array.isArray(response?.data) ? response.data : [];
    return entries.map((entry) => normalizeValue(entry));
  } catch (error) {
    if (isSoftContentError(error)) {
      return [];
    }
    throw error;
  }
};

export const fetchFirstBySlug = async (contentType, locale, slug, params = {}) => {
  const entries = await fetchCollection(contentType, locale, {
    ...params,
    filters: {
      ...(params.filters || {}),
      slug: {
        $eq: slug,
      },
    },
    pagination: {
      ...(params.pagination || {}),
      pageSize: 1,
    },
  });

  return entries[0] || null;
};

export const getPageBySlug = async (slug, locale, params = {}) =>
  fetchFirstBySlug('pages', locale, slug, params);

const hasMeaningfulData = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

export const fetchWithLocaleFallback = async (loader, locale, options = {}) => {
  const acceptEmpty = options.acceptEmpty === true;
  const primary = await loader(locale);
  if (acceptEmpty || hasMeaningfulData(primary)) {
    return { data: primary, locale, fallback: false };
  }

  if (locale === 'en') {
    return { data: null, locale, fallback: false };
  }

  const fallback = await loader('en');
  return {
    data: fallback || (acceptEmpty ? fallback : null),
    locale: hasMeaningfulData(fallback) || acceptEmpty ? 'en' : locale,
    fallback: hasMeaningfulData(fallback) || acceptEmpty,
  };
};

export const createLeadSubmission = async (data) =>
  requestJson('/api/lead-submissions', {
    method: 'POST',
    body: {
      data,
    },
  });

export const fetchLeadQuestions = async (params = {}) => {
  try {
    const response = await request('/api/lead-questions', {
      sort: ['order:asc'],
      filters: {
        active: {
          $eq: true,
        },
      },
      pagination: {
        pageSize: 100,
      },
      ...params,
    });

    const entries = Array.isArray(response?.data) ? response.data : [];
    return entries.map((entry) => normalizeValue(entry));
  } catch (error) {
    if (isSoftContentError(error)) {
      return [];
    }
    throw error;
  }
};
