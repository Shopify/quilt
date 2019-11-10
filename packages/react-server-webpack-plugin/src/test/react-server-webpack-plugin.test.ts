import {HEADER, Options} from '../react-server-webpack-plugin';

import {withWorkspace} from './utilities/workspace';

const BUILD_TIMEOUT = 10000;

describe('react-server-webpack-plugin', () => {
  describe('node', () => {
    it(
      'generates the server and client entrypoints when the virtual server & client modules are present',
      async () => {
        const name = 'node-no-entrypoints';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);

          const [serverResults, clientResults] = await build();

          expect(clientResults).toMatch(HEADER);

          expect(serverResults).toMatch(HEADER);
          expect(serverResults).toMatch('port: ');
        });
      },
      BUILD_TIMEOUT,
    );
  });

  describe('rails', () => {
    it(
      'generates the server and client entrypoints when they do not exist',
      async () => {
        const name = 'rails-no-entrypoints';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);

          const [serverResults, clientResults] = await build();

          expect(serverResults).toMatch(HEADER);
          expect(clientResults).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses process.env to default port and host',
      async () => {
        const name = 'rails-process-env';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);

          const [serverResults] = await build();

          expect(serverResults).toMatch('ip: process.env.REACT_SERVER_IP');
          expect(serverResults).toMatch('port: process.env.REACT_SERVER_PORT');
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated client module when a folder with an index file is present',
      async () => {
        const name = 'client-index-entrypoint';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('client/index.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await build();

          expect(serverResults).toMatch(HEADER);
          expect(clientResults).toMatch('I am a bespoke entry');
          expect(clientResults).not.toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated client module when a bespoke file is present',
      async () => {
        const name = 'client-entrypoint';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('client.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await build();

          expect(serverResults).toMatch(HEADER);
          expect(clientResults).toMatch('I am a bespoke entry');
          expect(clientResults).not.toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated server module when a bespoke file is present',
      async () => {
        const name = 'server-entrypoint';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('server.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await build();

          expect(serverResults).not.toMatch(HEADER);
          expect(serverResults).toMatch('I am a bespoke entry');
          expect(clientResults).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated server module when a folder with an index file is present',
      async () => {
        const name = 'server-index-entrypoint';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('server/index.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await build();

          expect(serverResults).not.toMatch(HEADER);
          expect(serverResults).toMatch('I am a bespoke entry');
          expect(clientResults).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses the given basePath',
      async () => {
        const name = 'custom-base-path';
        const basePath = './app/ui';

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write(
            'webpack.config.js',
            createWebpackConfig({basePath}),
          );
          await workspace.write(`${basePath}/index.js`, BASIC_ENTRY);

          const [serverResults, clientResults] = await build({basePath});

          expect(serverResults).toMatch(HEADER);
          expect(clientResults).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses the given server configuration options',
      async () => {
        const name = 'custom-server-config';
        const customConfig = {
          port: 3000,
          host: '127.0.0.1',
          assetPrefix: 'https://localhost/webpack/assets',
          basePath: '.',
        };

        await withWorkspace(name, async ({workspace, build}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write(
            'webpack.config.js',
            createWebpackConfig(customConfig),
          );

          const [serverResults] = await build();

          expect(serverResults).toMatch(`port: ${customConfig.port}`);
          expect(serverResults).toMatch(`ip: "${customConfig.host}"`);
          expect(serverResults).toMatch(
            `assetPrefix: "${customConfig.assetPrefix}"`,
          );
        });
      },
      BUILD_TIMEOUT,
    );
  });
});

const BASIC_ENTRY = `console.log('I am a bespoke entry');`;

const BASIC_JS_MODULE = `module.exports = () => {
  return 'I am totally a react component';
};`;

const createWebpackConfig = (
  {basePath, port, host, assetPrefix}: Options = {
    basePath: '.',
  },
) => `
const path = require('path');
const {ReactServerPlugin} = require('../../../react-server-webpack-plugin');

const universal = {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  plugins: [new ReactServerPlugin({
    ${printIf('basePath', basePath)}
    ${printIf('port', port)}
    ${printIf('host', host)}
    ${printIf('assetPrefix', assetPrefix)}
  })],
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '${basePath}')],
  },
};

const server = {
  ...universal,
  name: 'server',
  target: 'node',
  entry: './${basePath}/server',
  externals: [
    (context, request, callback) => {
      if (/node_modules/.test(context)) {
        return callback(null, 'commonjs' + request);
      }
      callback();
    },
  ],
};

const client = {
  ...universal,
  name: 'client',
  target: 'web',
  entry: '${basePath}/client',
};

module.exports = [server, client];`;

const printIf = (key, value) => {
  return value ? `${key}: "${value}",` : '';
};

const BASIC_WEBPACK_CONFIG = createWebpackConfig();
