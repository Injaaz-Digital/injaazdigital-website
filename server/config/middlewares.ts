export default ({ env }) => {
  const allowedOrigins = env('CORS_ORIGIN', 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

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
        origin: allowedOrigins,
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
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
