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
    ctx.body = html(tokens.refresh_token
      ? `<h1>Google Calendar authorization succeeded</h1><p>A refresh credential was issued, but it is intentionally never rendered in the browser. Complete setup through the deployment secret-management workflow.</p>`
      : `<h1>Google Calendar authorization incomplete</h1><p>No refresh credential was issued. Revoke the application's access and repeat the secret-management setup workflow.</p>`);
  },
};
