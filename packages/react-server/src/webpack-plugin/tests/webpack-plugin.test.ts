import 'setimmediate';

import path from 'path';

import memfs from 'memfs';
import webpack, {Compiler, Stats} from 'webpack';

import {HEADER, Options, Entrypoint} from '../shared';

import {withWorkspace} from './utilities/workspace';

const BUILD_TIMEOUT = 10000;

const DEFAULT_SERVER_FILE_EPATH = `${Entrypoint.Server}.js`;
const DEFAULT_CLIENT_FILE_PATH = `${Entrypoint.Client}.js`;
const DEFAULT_ERROR_FILE_PATH = `${Entrypoint.Error}.entry.client.js`;

describe('webpack-plugin', () => {
  describe('node', () => {
    it(
      'generates the server and client entrypoints when the virtual server & client modules are present',
      async () => {
        const name = 'node-no-entrypoints';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', BASIC_JS_MODULE);
          await workspace.write('webpack.config.js', BASIC_WEBPACK_CONFIG);

          const [client, server] = await runBuild(name, [
            DEFAULT_CLIENT_FILE_PATH,
            DEFAULT_SERVER_FILE_EPATH,
          ]);

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

          const [client, server] = await runBuild(name, [
            DEFAULT_CLIENT_FILE_PATH,
            DEFAULT_SERVER_FILE_EPATH,
          ]);

          expect(server).toMatch(HEADER);
          expect(client).toMatch(HEADER);
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

          const [client, clientIndex, server] = await runBuild(name, [
            DEFAULT_CLIENT_FILE_PATH,
            'client/index.js',
            DEFAULT_SERVER_FILE_EPATH,
          ]);

          expect(server).toMatch(HEADER);
          expect(client).toBeNull();
          expect(clientIndex).toMatch('I am a bespoke entry');
          expect(clientIndex).not.toMatch(HEADER);
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

          const [client, server] = await runBuild(name, [
            DEFAULT_CLIENT_FILE_PATH,
            DEFAULT_SERVER_FILE_EPATH,
          ]);

          expect(server).toMatch(HEADER);
          expect(client).toMatch('I am a bespoke entry');
          expect(client).not.toMatch(HEADER);
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

          const [client, server] = await runBuild(name, [
            DEFAULT_CLIENT_FILE_PATH,
            DEFAULT_SERVER_FILE_EPATH,
          ]);

          expect(server).not.toMatch(HEADER);
          expect(server).toMatch('I am a bespoke entry');
          expect(client).toMatch(HEADER);
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

          const [client, server, serverIndex] = await runBuild(name, [
            DEFAULT_CLIENT_FILE_PATH,
            DEFAULT_SERVER_FILE_EPATH,
            'server/index.js',
          ]);

          expect(server).toBeNull();
          expect(serverIndex).not.toMatch(HEADER);
          expect(serverIndex).toMatch('I am a bespoke entry');
          expect(client).toMatch(HEADER);
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

          const [client, server] = await runBuild(name, [
            `${basePath}/${DEFAULT_CLIENT_FILE_PATH}`,
            `${basePath}/${DEFAULT_SERVER_FILE_EPATH}`,
          ]);

          expect(server).toMatch(HEADER);
          expect(client).toMatch(HEADER);
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

          const [server] = await runBuild(name, [DEFAULT_SERVER_FILE_EPATH]);

          expect(server).toMatch('proxy: false');
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

          const [server] = await runBuild(name, [DEFAULT_SERVER_FILE_EPATH]);

          expect(server).toMatch(`port: ${customConfig.port}`);
          expect(server).toMatch(`ip: "${customConfig.host}"`);
          expect(server).toMatch(`assetPrefix: "${customConfig.assetPrefix}"`);
          expect(server).toMatch(`proxy: ${customConfig.proxy}`);
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

          const [server] = await runBuild(name, [
            `${basePath}/${DEFAULT_SERVER_FILE_EPATH}`,
          ]);

          expect(server).toMatch("import Error from 'error';");
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

          const [server] = await runBuild(name, [
            `${basePath}/${DEFAULT_SERVER_FILE_EPATH}`,
          ]);

          expect(server).not.toMatch("import Error from 'error';");
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

          const [server] = await runBuild(name, [
            `${basePath}/${DEFAULT_SERVER_FILE_EPATH}`,
          ]);

          expect(server).toMatch("import Error from 'error';");
        });
      },
      BUILD_TIMEOUT,
    );
  });
});

function runBuild(
  configPath: string,
  basePaths: string[],
): Promise<(string | null)[]> {
  return new Promise((resolve, reject) => {
    const pathFromRoot = path.resolve(
      './packages/react-server/src/webpack-plugin/tests/fixtures',
      configPath,
    );

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`${pathFromRoot}/webpack.config.js`);
    const contextConfig = Array.isArray(config)
      ? config.map((config) => ({
          ...config,
          context: pathFromRoot,
        }))
      : {
          ...config,
          context: pathFromRoot,
        };

    const compiler: Compiler = webpack(contextConfig);
    // We use memfs.fs to prevent webpack from outputting to our actual FS
    // from https://github.com/webpack/webpack/blob/4837c3ddb9da8e676c73d97460e19689dd9d4691/test/configCases/types/filesystems/webpack.config.js#L8
    compiler.outputFileSystem = memfs.fs;

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats!.hasErrors()) {
        reject(stats!.toString());
        return;
      }

      // the Stats type is incorrect from webpack v5.39.1
      // https://github.com/webpack/webpack/blob/5d297327bc1f208de16c29f5c9b31d2b8a06bce4/types.d.ts#L1848
      const fs = ((stats as any).stats[0] as Stats).compilation
        .inputFileSystem as typeof memfs.fs;

      const sources = basePaths.map((basePath) => {
        try {
          return fs.readFileSync(path.join(pathFromRoot, basePath)).toString();
        } catch {
          return null;
        }
      });

      resolve(sources);
    });
  });
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
  module: {
    rules: [
      {
        test: /\\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /node\\/.*\\.js$/,
        loader: 'node-loader',
      }
    ]
  }
};
const server = {
  ...universal,
  name: 'server',
  target: 'node',
  entry: './${basePath}/server',
  externals: [
    ({context, request}, callback) => {
      if (/node_modules/.test(context)) {
        return callback(null, 'commonjs ' + request);
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
