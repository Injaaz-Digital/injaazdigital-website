import { exchangeGoogleCalendarCode, getGoogleCalendarAuthUrl } from '../../../services/google-calendar';

const setupEnabled = () =>
  process.env.NODE_ENV !== 'production' &&
  String(process.env.GOOGLE_CALENDAR_OAUTH_SETUP_ENABLED || '').toLowerCase() === 'true';

const html = (body: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Google Calendar Setup</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 760px; margin: 48px auto; padding: 0 24px; line-height: 1.6; color: #0a2546; }
      code, pre { background: #f3f7fb; border: 1px solid #d6e1ee; border-radius: 12px; padding: 12px; display: block; white-space: pre-wrap; overflow-wrap: anywhere; }
      a { color: #0b5da8; }
    </style>
  </head>
  <body>${body}</body>
</html>`;

export default {
  async start(ctx) {
    if (!setupEnabled()) {
      ctx.status = 404;
      ctx.body = 'Google Calendar OAuth setup is disabled.';
      return;
    }

    ctx.redirect(getGoogleCalendarAuthUrl());
  },

  async callback(ctx) {
    if (!setupEnabled()) {
      ctx.status = 404;
      ctx.body = 'Google Calendar OAuth setup is disabled.';
      return;
    }

    const code = String(ctx.query?.code || '');
    if (!code) {
      ctx.status = 400;
      ctx.type = 'html';
      ctx.body = html('<h1>Missing OAuth code</h1><p>Open <a href="/api/google-calendar/auth">/api/google-calendar/auth</a> to restart setup.</p>');
      return;
    }

    const tokens = await exchangeGoogleCalendarCode(code);
    ctx.type = 'html';
    ctx.body = html(`<h1>Google Calendar connected</h1>
      <p>Copy this value into <code>server/.env</code> as <strong>GOOGLE_CALENDAR_REFRESH_TOKEN</strong>, then restart Strapi.</p>
      <pre>GOOGLE_CALENDAR_REFRESH_TOKEN=${tokens.refresh_token || ''}</pre>
      <p>If the token is empty, revoke app access in your Google account and retry; Google only returns a refresh token on consent.</p>`);
  },
};
