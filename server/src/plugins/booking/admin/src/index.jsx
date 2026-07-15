import React from 'react';
import { PLUGIN_ID } from './pluginId';
import { InjaazCalIcon } from './components/InjaazCalIcon';

export default {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: InjaazCalIcon,
      intlLabel: { id: `${PLUGIN_ID}.name`, defaultMessage: 'Injaaz Cal' },
      Component: () => import('./pages/App'),
      permissions: [],
      position: 3,
    });

    app.registerPlugin({ id: PLUGIN_ID, name: 'Injaaz Cal' });
  },
  bootstrap() {},
  async registerTrads() { return []; },
};
