export default {
  routes: [
    {
      method: 'POST',
      path: '/lead-submissions',
      handler: 'lead.submit',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/leads/submit',
      handler: 'lead.submit',
      config: {
        auth: false,
      },
    },
  ],
};
