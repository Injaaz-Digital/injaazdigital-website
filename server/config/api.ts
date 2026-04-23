export default ({ env }) => ({
  rest: {
    defaultLimit: env.int('API_DEFAULT_LIMIT', 24),
    maxLimit: env.int('API_MAX_LIMIT', 100),
    withCount: true,
  },
});
