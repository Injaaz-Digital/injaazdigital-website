export default {
  routes: [
    {
      method: 'POST',
      path: '/lead-sessions/start',
      handler: 'lead-session.start',
      config: {
        auth: false,
      },
    },
  ],
};
