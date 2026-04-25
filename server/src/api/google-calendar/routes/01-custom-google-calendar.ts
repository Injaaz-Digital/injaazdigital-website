export default {
  routes: [
    {
      method: 'GET',
      path: '/google-calendar/auth',
      handler: 'google-calendar.start',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/google-calendar/callback',
      handler: 'google-calendar.callback',
      config: {
        auth: false,
      },
    },
  ],
};
