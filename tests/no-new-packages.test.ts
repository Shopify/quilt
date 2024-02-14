import {resolve, basename} from 'path';

import {sync as globSync} from 'glob';

const ROOT_PATH = resolve(__dirname, '..');

describe('no new packages', () => {
  it('does not have any new packages added', () => {
    const packageNames = globSync(resolve(ROOT_PATH, 'packages', '*'));

    expect(packageNames.map((fullPath) => basename(fullPath))).toStrictEqual([
      'address',
      'address-consts',
      'address-mocks',
      'admin-graphql-api-utilities',
      'async',
      'browser',
      'csrf-token-fetcher',
      'css-utilities',
      'dates',
      'function-enhancers',
      'graphql-config-utilities',
      'graphql-fixtures',
      'graphql-mini-transforms',
      'graphql-persisted',
      'graphql-testing',
      'graphql-tool-utilities',
      'graphql-typed',
      'graphql-typescript-definitions',
      'graphql-validate-fixtures',
      'i18n',
      'jest-dom-mocks',
      'jest-koa-mocks',
      'koa-liveness-ping',
      'koa-metrics',
      'koa-performance',
      'koa-shopify-graphql-proxy',
      'koa-shopify-webhooks',
      'logger',
      'mime-types',
      'name',
      'network',
      'performance',
      'polyfills',
      'predicates',
      'react-app-bridge-universal-provider',
      'react-async',
      'react-bugsnag',
      'react-compose',
      'react-cookie',
      'react-csrf',
      'react-csrf-universal-provider',
      'react-effect',
      'react-form',
      'react-form-state',
      'react-google-analytics',
      'react-graphql',
      'react-graphql-universal-provider',
      'react-hooks',
      'react-html',
      'react-hydrate',
      'react-i18n',
      'react-i18n-universal-provider',
      'react-idle',
      'react-import-remote',
      'react-intersection-observer',
      'react-network',
      'react-performance',
      'react-router',
      'react-server',
      'react-shortcuts',
      'react-testing',
      'react-universal-provider',
      'react-web-worker',
      'semaphore',
      'sewing-kit-koa',
      'statsd',
      'storybook-a11y-test',
      'useful-types',
      'web-worker',
      'with-env',
    ]);
  });
});
