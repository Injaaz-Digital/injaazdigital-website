const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

const isLocalDevOrigin = (origin: string) => {
  try {
    const parsed = new URL(origin);
    return ['http:', 'https:'].includes(parsed.protocol) && LOCAL_DEV_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
};

export default ({ env }) => {
  const allowedOrigins = env('CORS_ORIGIN', 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowLocalDevOrigins = env('NODE_ENV') !== 'production';

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
            'media-src': ["'self'", 'data:', 'blob:'],
            'connect-src': ["'self'", 'https:'],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: (ctx) => {
          const requestOrigin = ctx.get('Origin');

          if (!requestOrigin) {
            return '*';
          }

          if (allowedOrigins.includes(requestOrigin)) {
            return requestOrigin;
          }

          if (allowLocalDevOrigins && isLocalDevOrigin(requestOrigin)) {
            return requestOrigin;
          }

          return '';
        },
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'Idempotency-Key', 'X-Request-Id'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'global::admin-forgot-password-debug',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
