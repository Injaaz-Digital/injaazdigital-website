export default {
  routes: [
    {
      method: 'POST',
      path: '/lead-responses/save',
      handler: 'lead-response.save',
      config: {
        auth: false,
      },
    },
  ],
};
