export default {
  routes: [
    {
      method: 'GET',
      path: '/calendar/availability',
      handler: 'calendar.availability',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/calendar/book',
      handler: 'calendar.book',
      config: {
        auth: false,
      },
    },
  ],
};
