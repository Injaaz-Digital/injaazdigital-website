export default {
  routes: [
    {
      method: 'GET',
      path: '/calendar/config',
      handler: 'calendar.config',
      config: { auth: false },
    },
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
    {
      method: 'POST',
      path: '/calendar/bookings/:id/cancel',
      handler: 'calendar.cancel',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/calendar/bookings/:id/reschedule',
      handler: 'calendar.reschedule',
      config: { auth: false },
    },
  ],
};
