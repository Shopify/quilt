import path from 'path';

import webpack, {Compiler} from 'webpack';

import {HEADER, Options} from '../shared';

import {withWorkspace} from './utilities/workspace';

const BUILD_TIMEOUT = 10000;

describe('webpack-plugin', () => {
  describe('node', () => {
    it(
      'generates the server and client entrypoints when the virtual server & client modules are present',
      async () => {
        const name = 'node-no-entrypoints';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);

          const [serverResults, clientResults] = await runBuild(name);
          const [client, server] = [
            getModule(clientResults, 'client').source,
            getModule(serverResults, 'server').source,
          ];

          expect(client).toBeDefined();
          expect(client).toMatch(HEADER);

          expect(server).toBeDefined();
          expect(server).toMatch(HEADER);
          expect(server).toMatch('port: ');
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

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);

          const [serverResults, clientResults] = await runBuild(name);
          const clientModule = getModule(clientResults, 'client');
          const serverModule = getModule(serverResults, 'server');

          expect(serverModule.source).toMatch(HEADER);
          expect(clientModule.source).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated client module when a folder with an index file is present',
      async () => {
        const name = 'client-index-entrypoint';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('client/index.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await runBuild(name);
          const clientModule = getModule(clientResults, 'client');
          const serverModule = getModule(serverResults, 'server');

          expect(serverModule.source).toMatch(HEADER);
          expect(clientModule.source).toMatch('I am a bespoke entry');
          expect(clientModule.source).not.toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated client module when a bespoke file is present',
      async () => {
        const name = 'client-entrypoint';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('client.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await runBuild(name);
          const clientModule = getModule(clientResults, 'client');
          const serverModule = getModule(serverResults, 'server');

          expect(serverModule.source).toMatch(HEADER);
          expect(clientModule.source).toMatch('I am a bespoke entry');
          expect(clientModule.source).not.toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated server module when a bespoke file is present',
      async () => {
        const name = 'server-entrypoint';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('server.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await runBuild(name);
          const clientModule = getModule(clientResults, 'client');
          const serverModule = getModule(serverResults, 'server');

          expect(serverModule.source).not.toMatch(HEADER);
          expect(serverModule.source).toMatch('I am a bespoke entry');
          expect(clientModule.source).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not use the generated server module when a folder with an index file is present',
      async () => {
        const name = 'server-index-entrypoint';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);
          await workspace.write('server/index.js', BASIC_ENTRY);

          const [serverResults, clientResults] = await runBuild(name);
          const clientModule = getModule(clientResults, 'client');
          const serverModule = getModule(serverResults, 'server');

          expect(serverModule.source).not.toMatch(HEADER);
          expect(serverModule.source).toMatch('I am a bespoke entry');
          expect(clientModule.source).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses the given basePath',
      async () => {
        const name = 'custom-base-path';
        const basePath = './app/ui';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write(
            'webpack.config.js',
            createWebpackConfig({basePath}),
          );
          await workspace.write(`${basePath}/index.js`, BASIC_ENTRY);

          const [serverResults, clientResults] = await runBuild(name);
          const serverModule = getModule(serverResults, 'app/ui/server');
          const clientModule = getModule(clientResults, 'app/ui/client');

          expect(serverModule.source).toMatch(HEADER);
          expect(clientModule.source).toMatch(HEADER);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses default server configuration options',
      async () => {
        const name = 'default-server-config';
        const customConfig = {
          port: 3000,
          host: '127.0.0.1',
          assetPrefix: 'https://localhost/webpack/assets',
          basePath: '.',
        };

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write(
            'webpack.config.js',
            createWebpackConfig(customConfig),
          );

          const [serverResults] = await runBuild(name);
          const serverModule = getModule(serverResults, 'server');
          expect(serverModule.source).toMatch('proxy: false');
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
          proxy: true,
        };

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write(
            'webpack.config.js',
            createWebpackConfig(customConfig),
          );

          const [serverResults] = await runBuild(name);
          const serverModule = getModule(serverResults, 'server');

          expect(serverModule.source).toMatch(`port: ${customConfig.port}`);
          expect(serverModule.source).toMatch(`ip: "${customConfig.host}"`);
          expect(serverModule.source).toMatch(
            `assetPrefix: "${customConfig.assetPrefix}"`,
          );
          expect(serverModule.source).toMatch(`proxy: ${customConfig.proxy}`);
        });
      },
      BUILD_TIMEOUT,
    );
  });

  describe('error component', () => {
    it(
      'imports the Error component in the server when error.js exists',
      async () => {
        const name = 'rails-includes-error-component';
        const basePath = './app/ui';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write(`${basePath}/index.js`, BASIC_JS_MODULE);
          await workspace.write(
            `${basePath}/error.js`,
            BASIC_JS_ERROR_COMPOENT,
          );

          await workspace.write(
            'webpack.config.js',
            createWebpackConfig({basePath}),
          );

          const [serverResults] = await runBuild(name);
          const serverModule = getModule(serverResults, 'app/ui/server');

          expect(serverModule.source).toMatch("import Error from 'error';");
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'does not import the Error component in the server when error.js does not exists',
      async () => {
        const name = 'rails-doesnt-include-error-component';
        const basePath = './app/ui';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write(`${basePath}/index.js`, BASIC_JS_MODULE);

          await workspace.write(
            'webpack.config.js',
            createWebpackConfig({basePath}),
          );

          const [serverResults] = await runBuild(name);
          const serverModule = getModule(serverResults, 'app/ui/server');

          expect(serverModule.source).not.toMatch("import Error from 'error';");
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'includes the Error component in the server when an error folder exists',
      async () => {
        const name = 'rails-includes-error-component-folder';
        const basePath = './app/ui';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write(`${basePath}/index.js`, BASIC_JS_MODULE);
          await workspace.write(
            `${basePath}/error/index.js`,
            BASIC_JS_ERROR_COMPOENT,
          );

          await workspace.write(
            'webpack.config.js',
            createWebpackConfig({basePath}),
          );

          const [serverResults] = await runBuild(name);
          const serverModule = getModule(serverResults, 'app/ui/server');

          expect(serverModule.source).toMatch("import Error from 'error';");
        });
      },
      BUILD_TIMEOUT,
    );
  });
});

function runBuild(configPath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const pathFromRoot = path.resolve(
      './packages/react-server/src/webpack-plugin/test/fixtures',
      configPath,
    );

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`${pathFromRoot}/webpack.config.js`);
    const contextConfig = Array.isArray(config)
      ? config.map(config => ({
          ...config,
          context: pathFromRoot,
        }))
      : {
          ...config,
          context: pathFromRoot,
        };

    // We use MemoryOutputFileSystem to prevent webpack from outputting to our actual FS
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const MemoryOutputFileSystem = require('webpack/lib/MemoryOutputFileSystem');

    const compiler: Compiler = webpack(contextConfig);
    compiler.outputFileSystem = new MemoryOutputFileSystem({});

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.hasErrors()) {
        reject(stats.toString());
        return;
      }

      const statsObject = stats.toJson();
      resolve(statsObject.children);
    });
  });
}

function getModule(results: any, basePath: string) {
  const newResults = results.modules.find(
    ({name}) =>
      name.includes(`./${basePath}.js`) ||
      name.includes(`./${basePath}/index.js`),
  );

  if (newResults.source) {
    return newResults;
  }

  return getModule(newResults, basePath);
}

const BASIC_ENTRY = `console.log('I am a bespoke entry');`;

const BASIC_JS_MODULE = `module.exports = () => {
  return 'I am totally a react component';
};`;

const BASIC_JS_ERROR_COMPOENT = `module.exports = () => {
  return 'I am totally an Error component';
};`;

const createWebpackConfig = (
  {basePath, port, host, assetPrefix, proxy}: Options = {
    basePath: '.',
  },
) => `
const path = require('path');
const {ReactServerPlugin} = require('../../../webpack-plugin');
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
    ${printIf('proxy', proxy)}
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
  entry: './${basePath}/client',
};
module.exports = [server, client];`;

const printIf = (key, value) => {
  return value ? `${key}: "${value}",` : '';
};

const BASIC_WEBPACK_CONFIG = createWebpackConfig();
