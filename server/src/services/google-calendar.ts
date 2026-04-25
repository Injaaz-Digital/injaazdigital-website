import { google } from 'googleapis';

type CalendarCredentials = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
  calendarId: string;
  timezone: string;
};

const readCredentials = (): CalendarCredentials => {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || '';
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || '';
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || '';
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || 'Africa/Casablanca';

  if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
    throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED');
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    refreshToken,
    calendarId,
    timezone,
  };
};

export const isGoogleCalendarConfigured = () =>
  Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID &&
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
      process.env.GOOGLE_CALENDAR_REDIRECT_URI &&
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN
  );

const getCalendarClient = () => {
  const credentials = readCredentials();
  const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
  );

  oauth2Client.setCredentials({
    refresh_token: credentials.refreshToken,
  });

  return {
    calendar: google.calendar({ version: 'v3', auth: oauth2Client }),
    credentials,
  };
};

export const getGoogleCalendarAuthUrl = () => {
  const credentials = {
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_CALENDAR_REDIRECT_URI || '',
  };

  if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
    throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED');
  }

  const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
  );

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
};

export const exchangeGoogleCalendarCode = async (code: string) => {
  const credentials = {
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_CALENDAR_REDIRECT_URI || '',
  };

  if (!credentials.clientId || !credentials.clientSecret || !credentials.redirectUri) {
    throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED');
  }

  const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
  );
  const response = await oauth2Client.getToken(code);
  return response.tokens;
};

export const getBusyEvents = async ({
  start,
  end,
  calendarId,
  timezone,
}: {
  start: string;
  end: string;
  calendarId?: string;
  timezone?: string;
}) => {
  const { calendar, credentials } = getCalendarClient();
  const targetCalendarId = calendarId || credentials.calendarId;
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      timeZone: timezone || credentials.timezone,
      items: [{ id: targetCalendarId }],
    },
  });

  return response.data.calendars?.[targetCalendarId]?.busy || [];
};

export const createMeetingEvent = async ({
  lead,
  start,
  end,
  timezone,
  calendarId,
  meetingTitle,
  meetingLocation,
  autoCreateGoogleMeet = true,
  serviceInterest,
  score,
  answersJson,
}: {
  lead: Record<string, any>;
  start: string;
  end: string;
  timezone?: string;
  calendarId?: string;
  meetingTitle?: string;
  meetingLocation?: string;
  autoCreateGoogleMeet?: boolean;
  serviceInterest?: string;
  score?: number;
  answersJson?: Record<string, unknown>;
}) => {
  const { calendar, credentials } = getCalendarClient();
  const requestId = `injaaz-${lead.id}-${Date.now()}`;
  const descriptionLines = [
    `Lead ID: ${lead.id}`,
    `Service interest: ${serviceInterest || lead.serviceInterest || 'N/A'}`,
    `Score: ${score ?? lead.score ?? 0}`,
    `Website: ${lead.websiteUrl || lead.website || 'N/A'}`,
  ];

  if (answersJson?.business_type) {
    descriptionLines.push(`Business type: ${answersJson.business_type}`);
  }

  if (answersJson?.main_problem) {
    descriptionLines.push(`Main problem: ${answersJson.main_problem}`);
  }

  const event = await calendar.events.insert({
    calendarId: calendarId || credentials.calendarId,
    conferenceDataVersion: autoCreateGoogleMeet ? 1 : 0,
    requestBody: {
      summary: `${meetingTitle || 'Injaaz Digital Strategy Call'} - ${lead.name || lead.fullName || 'Injaaz Lead'}`,
      description: descriptionLines.join('\n'),
      location: meetingLocation || undefined,
      start: {
        dateTime: start,
        timeZone: timezone || credentials.timezone,
      },
      end: {
        dateTime: end,
        timeZone: timezone || credentials.timezone,
      },
      attendees: lead.email ? [{ email: lead.email, displayName: lead.name || lead.fullName || undefined }] : undefined,
      conferenceData: autoCreateGoogleMeet
        ? {
            createRequest: {
              requestId,
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          }
        : undefined,
    },
  });

  return event.data;
};
