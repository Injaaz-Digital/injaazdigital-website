'use strict';

module.exports = {
  type: 'content-api',
  routes: [
    { method: 'GET', path: '/steppers/:key/runtime', handler: 'stepper.runtime', config: { auth: false } },
  ],
};
