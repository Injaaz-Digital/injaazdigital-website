export default {
  routes: [{
    method: 'GET',
    path: '/articles/search',
    handler: 'article.search',
    config: { auth: false },
  }],
};
