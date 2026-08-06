import 'server-only';
import { bookingRequest } from '@/lib/booking/client';
import { requireServerEnv } from '@/lib/config/env';

export const fetchWebsiteBookingBootstrap = async ({ locale = 'en' } = {}) => {
  const siteId = requireServerEnv('CONTENT_ANALYZER_BOOKING_SITE_ID');
  const encodedSiteId = encodeURIComponent(siteId);
  const config = await bookingRequest(`/sites/${encodedSiteId}/config`, {
    query: { locale, mode: 'hosted', useDefault: true },
    cache: 'no-store',
  });
  const flowKey = String(config?.flowKey || '').trim();

  if (!flowKey) {
    throw new Error(`Flow website ${siteId} does not have a default question flow.`);
  }

  const runtime = await bookingRequest(`/sites/${encodedSiteId}/flows/${encodeURIComponent(flowKey)}/runtime`, {
    query: { locale, mode: 'hosted' },
    cache: 'no-store',
  });

  return {
    bookingConfig: {
      ...(config?.booking || {}),
      defaultFlowKey: flowKey,
      timezone: config?.timezone,
      calendarStatus: config?.calendarStatus,
    },
    stepper: runtime,
  };
};
