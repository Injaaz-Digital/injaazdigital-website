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
    {
      method: 'PUT',
      path: '/leads/:id/contact',
      handler: 'lead.updateContact',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/leads/:id/complete',
      handler: 'lead.complete',
      config: {
        auth: false,
      },
    },
  ],
};
