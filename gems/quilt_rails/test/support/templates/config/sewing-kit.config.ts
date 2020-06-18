/* eslint-env node */

import {Plugins, Env} from '@shopify/sewing-kit';

export default function sewingKitConfig(plugins: Plugins, env: Env) {
  return {
    name: '${application_name}',
    // remove cdn plugin when using dev
    plugins: [plugins.cdn(env.isDevelopment ? 'http://localhost:8080/webpack/assets/' : undefined)],
  };
}
