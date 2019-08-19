/* eslint-env node */

import * as path from 'path';

import {Plugins, Env} from '@shopify/sewing-kit';
import {ReactServerPlugin} from '@shopify/react-server-webpack-plugin';

const root = path.resolve(__dirname, '../');
const tests = path.resolve(root, 'app', 'ui', 'test');
const sourceRoot = path.resolve(root, 'app', 'ui');

module.exports = function sewingKitConfig(plugins: Plugins, env: Env) {
  return {
    name: 'your-app-name',
    plugins: [
      plugins.vendors([
        '@shopify/admin-graphql-api-utilities',
        '@shopify/koa-shopify-graphql-proxy',
        '@shopify/network',
        '@shopify/polaris',
        '@shopify/react-effect',
        '@shopify/react-form',
        '@shopify/react-html',
        '@shopify/react-i18n',
        '@shopify/react-network',
        'apollo-cache-inmemory',
        'apollo-client',
        'apollo-link-http',
        'react',
        'react-apollo',
        'react-dom',
        'react-router',
        'react-router-dom',
      ]),
      plugins.jest((config: any) => {
        config.setupFiles.push(path.join(tests, 'setup.ts'));
        config.setupFilesAfterEnv = [path.join(tests, 'each-test.ts')];
        return config;
      }),
      plugins.webpack((config: any) => {
        config.plugins.push(
          new ReactServerPlugin({
            basePath: sourceRoot,
          }),
        );
        return config;
      }),
    ],
  };
};
