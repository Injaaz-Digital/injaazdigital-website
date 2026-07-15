'use strict';

module.exports = {
  type: 'admin',
  routes: [
    { method: 'GET', path: '/overview', handler: 'admin.overview', config: {} },
    { method: 'GET', path: '/settings', handler: 'admin.getSettings', config: {} },
    { method: 'PUT', path: '/settings', handler: 'admin.updateSettings', config: {} },
    { method: 'GET', path: '/steppers', handler: 'admin.listSteppers', config: {} },
    { method: 'POST', path: '/steppers', handler: 'admin.createStepper', config: {} },
    { method: 'PUT', path: '/steppers/:id', handler: 'admin.updateStepper', config: {} },
    { method: 'POST', path: '/steppers/:id/publish', handler: 'admin.publishStepper', config: {} },
    { method: 'POST', path: '/steppers/:id/duplicate', handler: 'admin.duplicateStepper', config: {} },
    { method: 'POST', path: '/steppers/:id/archive', handler: 'admin.archiveStepper', config: {} },
    { method: 'GET', path: '/resources/:resource', handler: 'admin.list', config: {} },
    { method: 'GET', path: '/resources/:resource/:id', handler: 'admin.findOne', config: {} },
    { method: 'POST', path: '/resources/:resource', handler: 'admin.create', config: {} },
    { method: 'PUT', path: '/resources/:resource/:id', handler: 'admin.update', config: {} },
    { method: 'DELETE', path: '/resources/:resource/:id', handler: 'admin.remove', config: {} },
  ],
};
