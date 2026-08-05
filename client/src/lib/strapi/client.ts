export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

type QueryPrimitive = string | number | boolean | null | undefined;
export type QueryValue = QueryPrimitive | QueryValue[] | { [key: string]: QueryValue };
export type QueryParams = Record<string, QueryValue>;

type StrapiRequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

export class StrapiRequestError extends Error {
  readonly status: number;
  readonly path: string;
  readonly code: string;
  readonly payload: unknown;

  constructor(message: string, status: number, path: string, payload: unknown = null) {
    super(message);
    this.name = 'StrapiRequestError';
    this.status = status;
    this.path = path;
    this.payload = payload;
    const errorPayload = payload as { error?: { code?: string }; code?: string } | null;
    this.code = errorPayload?.error?.code || errorPayload?.code || '';
  }
}

const appendQuery = (searchParams: URLSearchParams, key: string, value: QueryValue): void => {
  if (value === undefined || value === null || value === '') return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendQuery(searchParams, `${key}[${index}]`, item));
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([childKey, childValue]) => appendQuery(searchParams, `${key}[${childKey}]`, childValue));
    return;
  }
  searchParams.append(key, String(value));
};

export const buildQuery = (params: QueryParams = {}): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => appendQuery(searchParams, key, value));
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

const serverAuthorizationHeader = (): Record<string, string> => {
  if (typeof window !== 'undefined') return {};
  const token = process.env.STRAPI_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parsePayload = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json().catch(() => null) : null;
};

const messageFromPayload = (payload: unknown): string | undefined => {
  const value = payload as { error?: { message?: string }; message?: string } | null;
  return value?.error?.message || value?.message;
};

const withDraftStatus = async (params: QueryParams): Promise<{ params: QueryParams; draft: boolean }> => {
  if (typeof window !== 'undefined' || params.status !== 'published') return { params, draft: false };
  try {
    const { draftMode } = await import('next/headers');
    const draft = await draftMode();
    return draft.isEnabled ? { params: { ...params, status: 'draft' }, draft: true } : { params, draft: false };
  } catch {
    return { params, draft: false };
  }
};

export const request = async (path: string, params: QueryParams = {}, options: StrapiRequestOptions = {}): Promise<any> => {
  const requestContext = await withDraftStatus(params);
  const response = await fetch(`${API_BASE_URL}${path}${buildQuery(requestContext.params)}`, {
    headers: serverAuthorizationHeader(),
    cache: requestContext.draft ? 'no-store' : options.cache,
    next: requestContext.draft ? undefined : (options.next || { revalidate: 60 }),
  });
  const payload = await parsePayload(response);
  if (!response.ok) {
    throw new StrapiRequestError(messageFromPayload(payload) || `Request failed (${response.status}) for ${path}`, response.status, path, payload);
  }
  return payload;
};

export const requestJson = async (path: string, options: StrapiRequestOptions = {}): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...serverAuthorizationHeader(), ...(options.headers || {}) },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: options.cache,
    next: options.next,
  });
  const payload = await parsePayload(response);
  if (!response.ok) {
    throw new StrapiRequestError(messageFromPayload(payload) || `Request failed (${response.status}) for ${path}`, response.status, path, payload);
  }
  return payload;
};
