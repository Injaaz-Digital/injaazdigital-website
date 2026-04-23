const boolFromEnv = (name: string, fallback: boolean) => {
  const value = process.env[name];

  if (value === undefined) {
    return fallback;
  }

  return value === 'true';
};

const normalizeEmail = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

export default (_config: unknown, { strapi }: { strapi: any }) => {
  const logEnabled = boolFromEnv(
    'LOG_FORGOT_PASSWORD_LINKS',
    process.env.NODE_ENV !== 'production'
  );
  const exposeInResponse = boolFromEnv(
    'EXPOSE_ADMIN_RESET_URL_IN_RESPONSE',
    process.env.NODE_ENV !== 'production'
  );
  const adminPath = strapi.config.get('admin.path', '/admin');

  if (logEnabled) {
    console.log(
      `[forgot-password-debug] middleware active (expose-admin-url-response=${exposeInResponse})`
    );
  }

  return async (ctx: any, next: () => Promise<unknown>) => {
    const requestPath = ctx?.path;

    if (ctx?.method !== 'POST' || requestPath !== `${adminPath}/forgot-password`) {
      await next();
      return;
    }

    if (!logEnabled) {
      await next();
      return;
    }

    const email = normalizeEmail(ctx?.request?.body?.email);

    console.log(`[admin-forgot-password] middleware request for ${email ?? '<empty email>'}`);

    if (!email) {
      if (exposeInResponse) {
        ctx.status = 200;
        ctx.body = { ok: true, resetUrl: null, reason: 'empty-email' };
      } else {
        ctx.status = 204;
      }

      return;
    }

    const activeAdmins = await strapi.db.query('admin::user').findMany({
      where: { isActive: true },
      select: ['id', 'email'],
    });

    const adminUser = activeAdmins.find(
      (user: { id?: number; email?: string }) =>
        typeof user?.email === 'string' && user.email.trim().toLowerCase() === email
    );

    if (!adminUser?.id || !adminUser?.email) {
      console.log(`[admin-forgot-password] no active admin user found for ${email}`);

      if (exposeInResponse) {
        ctx.status = 200;
        ctx.body = { ok: true, resetUrl: null, reason: 'admin-not-found' };
      } else {
        ctx.status = 204;
      }

      return;
    }

    const resetPasswordToken = strapi.service('admin::token').createToken();

    await strapi.service('admin::user').updateById(adminUser.id, {
      resetPasswordToken,
    });

    const resetUrl = `${strapi.config.get('admin.absoluteUrl')}/auth/reset-password?code=${resetPasswordToken}`;

    console.log(`[admin-forgot-password] reset link for ${adminUser.email}: ${resetUrl}`);

    ctx.set('x-admin-reset-url', resetUrl);
    ctx.set('x-forgot-password-debug', 'middleware-override');

    if (exposeInResponse) {
      ctx.status = 200;
      ctx.body = { ok: true, email: adminUser.email, resetUrl };
    } else {
      ctx.status = 204;
    }
  };
};
