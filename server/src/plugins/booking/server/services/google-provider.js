'use strict';

const { google } = require('googleapis');

const credentials = () => ({
  clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '', clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_CALENDAR_REDIRECT_URI || '', refreshToken: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || '',
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary', timezone: process.env.GOOGLE_CALENDAR_TIMEZONE || 'Africa/Casablanca',
});

const configured = () => {
  const value = credentials();
  return Boolean(value.clientId && value.clientSecret && value.redirectUri && value.refreshToken);
};

const client = () => {
  const value = credentials();
  if (!configured()) throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED');
  const auth = new google.auth.OAuth2(value.clientId, value.clientSecret, value.redirectUri);
  auth.setCredentials({ refresh_token: value.refreshToken });
  return { calendar: google.calendar({ version: 'v3', auth }), credentials: value };
};

module.exports = () => ({
  isConfigured: configured,
  async busy({ start, end, calendarId, timezone }) {
    const { calendar, credentials: value } = client();
    const target = calendarId || value.calendarId;
    const response = await calendar.freebusy.query({ requestBody: { timeMin: start, timeMax: end, timeZone: timezone || value.timezone, items: [{ id: target }] } });
    return response.data.calendars?.[target]?.busy || [];
  },
  async create({ lead, start, end, timezone, calendarId, meetingTitle, meetingLocation, autoCreateGoogleMeet = true, operationId, serviceInterest, score }) {
    const { calendar, credentials: value } = client();
    const response = await calendar.events.insert({
      calendarId: calendarId || value.calendarId, conferenceDataVersion: autoCreateGoogleMeet ? 1 : 0, sendUpdates: 'all',
      requestBody: {
        summary: `${meetingTitle || 'Injaaz Digital Strategy Call'} - ${lead.name || lead.fullName || 'Injaaz Lead'}`,
        description: [`Lead ID: ${lead.id}`, `Service interest: ${serviceInterest || 'N/A'}`, `Score: ${score ?? 0}`].join('\n'),
        location: meetingLocation || undefined,
        start: { dateTime: start, timeZone: timezone || value.timezone }, end: { dateTime: end, timeZone: timezone || value.timezone },
        attendees: lead.email ? [{ email: lead.email, displayName: lead.name || lead.fullName || undefined }] : undefined,
        conferenceData: autoCreateGoogleMeet ? { createRequest: { requestId: operationId, conferenceSolutionKey: { type: 'hangoutsMeet' } } } : undefined,
        reminders: { useDefault: true },
      },
    });
    return response.data;
  },
  async update({ eventId, start, end, timezone, calendarId }) {
    const { calendar, credentials: value } = client();
    const response = await calendar.events.patch({ calendarId: calendarId || value.calendarId, eventId, sendUpdates: 'all', requestBody: {
      start: { dateTime: start, timeZone: timezone || value.timezone }, end: { dateTime: end, timeZone: timezone || value.timezone },
    }});
    return response.data;
  },
  async cancel({ eventId, calendarId, notifyAttendees = true }) {
    const { calendar, credentials: value } = client();
    await calendar.events.delete({ calendarId: calendarId || value.calendarId, eventId, sendUpdates: notifyAttendees ? 'all' : 'none' });
  },
  async get({ eventId, calendarId }) {
    const { calendar, credentials: value } = client();
    return (await calendar.events.get({ calendarId: calendarId || value.calendarId, eventId })).data;
  },
  errorInfo(error) { return { code: String(error?.code || ''), message: String(error?.message || ''), isAuthInvalid: String(error?.message || '').includes('invalid_grant') }; },
});
