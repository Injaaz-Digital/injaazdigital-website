type BookingQuery = Record<string, string | number | boolean | null | undefined>;
type BookingRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  query?: BookingQuery;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

export class BookingRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'BookingRequestError';
    this.status = status;
    this.payload = payload;
    const value = payload as { error?: { code?: string } } | null;
    this.code = value?.error?.code || '';
  }
}

const queryString = (query: BookingQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const value = params.toString();
  return value ? `?${value}` : '';
};

const endpoint = (path: string) => {
  if (typeof window !== 'undefined') return `/api/booking${path}`;
  const baseUrl = String(process.env.CONTENT_ANALYZER_API_URL || '').replace(/\/$/, '');
  if (!baseUrl) throw new Error('Missing required server environment variable: CONTENT_ANALYZER_API_URL');
  return `${baseUrl}/api/v1/booking/public${path}`;
};

const serverHeaders = (): Record<string, string> => {
  if (typeof window !== 'undefined') return {};
  const websiteKey = process.env.CONTENT_ANALYZER_BOOKING_KEY;
  return websiteKey ? { 'X-Website-Key': websiteKey } : {};
};

export async function bookingRequest<T = any>(path: string, options: BookingRequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  const response = await fetch(`${endpoint(path)}${queryString(options.query)}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
      ...serverHeaders(),
      ...(options.headers || {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: options.cache,
    next: options.next,
  });
  const payload = await response.json().catch(() => null) as { data?: T; error?: { message?: string } } | null;
  if (!response.ok) throw new BookingRequestError(payload?.error?.message || `Booking request failed (${response.status})`, response.status, payload);
  if (!payload || !('data' in payload)) throw new BookingRequestError('Booking API returned an invalid response.', 502, payload);
  return payload.data as T;
}
