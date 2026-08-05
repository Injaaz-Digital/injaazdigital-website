import { request, requestJson, StrapiRequestError } from './client';
import { normalizeValue } from './normalizers';
import { cmsCacheTags } from '@/features/cms/server/cms-cache';

const requestOptionsFor = (contentType, locale, params = {}) => {
  const activeLocale = locale === 'ar' ? 'ar' : 'en';
  const tags = [];
  if (contentType === 'site-setting') tags.push(cmsCacheTags.siteSettings(), cmsCacheTags.navigation(activeLocale), cmsCacheTags.footer(activeLocale));
  if (contentType === 'blog-page') tags.push(cmsCacheTags.blogIndex(activeLocale));
  if (contentType === 'home-page') tags.push(cmsCacheTags.page('/', activeLocale));
  if (contentType === 'about-page') tags.push(cmsCacheTags.page('/about', activeLocale));
  if (contentType === 'articles') {
    tags.push(cmsCacheTags.blogIndex(activeLocale));
    const slug = params?.filters?.slug?.$eq;
    if (slug) tags.push(cmsCacheTags.blogPost(String(slug), activeLocale));
  }
  if (contentType === 'pages') {
    const slug = params?.filters?.slug?.$eq;
    if (slug) tags.push(cmsCacheTags.page(`/${slug}`, activeLocale));
  }
  if (params?._sitemap === true) tags.push(cmsCacheTags.sitemap());
  return tags.length ? { next: { revalidate: 300, tags } } : undefined;
};

const withoutInternalParams = (params) => Object.fromEntries(Object.entries(params).filter(([key]) => !key.startsWith('_')));

const isSoftContentError = (error) => {
  const status = Number(error?.status);
  return (error instanceof StrapiRequestError || Number.isFinite(status)) && (status === 401 || status === 403 || status === 404);
};

export const fetchSingleType = async (contentType, locale, params = {}) => {
  try {
    const query = {
      locale,
      status: 'published',
      populate: '*',
      ...params,
    };
    const response = await request(`/api/${contentType}`, withoutInternalParams(query), requestOptionsFor(contentType, locale, params));

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
    const query = {
      locale,
      status: 'published',
      populate: '*',
      ...params,
    };
    const response = await request(`/api/${contentType}`, withoutInternalParams(query), requestOptionsFor(contentType, locale, params));

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
    const query = {
      locale,
      status: 'published',
      ...params,
    };
    const response = await request(`/api/${contentType}`, withoutInternalParams(query), requestOptionsFor(contentType, locale, params));

    const entries = Array.isArray(response?.data) ? response.data : [];
    return entries.map((entry) => normalizeValue(entry));
  } catch (error) {
    if (isSoftContentError(error)) {
      return [];
    }
    throw error;
  }
};

export const fetchDocument = async (contentType, documentId, locale, params = {}) => {
  if (!documentId) return null;
  try {
    const query = {
      locale,
      status: 'published',
      ...params,
    };
    const response = await request(`/api/${contentType}/${encodeURIComponent(documentId)}`, withoutInternalParams(query), requestOptionsFor(contentType, locale, params));
    return normalizeValue(response?.data);
  } catch (error) {
    if (isSoftContentError(error)) return null;
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
