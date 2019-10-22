import path from 'path';
import webpack, {Compiler} from 'webpack';
import {HEADER} from '../react-server-webpack-plugin';

const BUILD_TIMEOUT = 10000;

describe('react-server-webpack-plugin', () => {
  describe('node', () => {
    it(
      'generates the server and client entrypoints when the virtual server & client modules are present',
      async () => {
        const [serverResults, clientResults] = await runBuild('no-entrypoints');
        const clientModule = getModule(clientResults, 'client');
        const serverModule = getModule(serverResults, 'server');

        expect(clientModule).toBeDefined();
        expect(clientModule.source).toMatch(HEADER);

        expect(serverResults).toBeDefined();
        expect(serverModule.source).toMatch(HEADER);
        expect(serverModule.source).toMatch('port: ');
      },
      BUILD_TIMEOUT,
    );
  });

  describe('rails', () => {
    it(
      'generates the server and client entrypoints when they do not exist',
      async () => {
        const [serverResults, clientResults] = await runBuild('no-entrypoints');
        const clientModule = getModule(clientResults, 'client');
        const serverModule = getModule(serverResults, 'server');

        expect(serverModule.source).toMatch(HEADER);
        expect(clientModule.source).toMatch(HEADER);
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses process.env to default port and host',
      async () => {
        const [serverResults] = await runBuild('no-entrypoints');
        const serverModule = getModule(serverResults, 'server');

        expect(serverModule.source).toMatch('ip: process.env.REACT_SERVER_IP');
        expect(serverModule.source).toMatch(
          'port: process.env.REACT_SERVER_PORT',
        );
      },
      BUILD_TIMEOUT,
    );

    it('does not use the generated client module when a bespoke file is present', async () => {
      const [serverResults, clientResults] = await runBuild(
        'client-entrypoint',
      );
      const clientModule = getModule(clientResults, 'client');
      const serverModule = getModule(serverResults, 'server');

      expect(serverModule.source).toMatch(HEADER);
      expect(clientModule.source).toMatch('I am a bespoke client entry');
      expect(clientModule.source).not.toMatch(HEADER);
    });

    it(
      'does not use the generated server module when a bespoke file is present',
      async () => {
        const [serverResults, clientResults] = await runBuild(
          'server-entrypoint',
        );
        const clientModule = getModule(clientResults, 'client');
        const serverModule = getModule(serverResults, 'server');

        expect(serverModule.source).not.toMatch(HEADER);
        expect(serverModule.source).toMatch('I am a bespoke server entry');
        expect(clientModule.source).toMatch(HEADER);
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses the given basePath',
      async () => {
        const [serverResults, clientResults] = await runBuild(
          'custom-base-path',
        );

        const serverModule = getModule(serverResults, 'app/ui/server');
        const clientModule = getModule(clientResults, 'app/ui/client');

        expect(serverModule.source).toMatch(HEADER);
        expect(clientModule.source).toMatch(HEADER);
      },
      BUILD_TIMEOUT,
    );

    it(
      'uses the given server configuration options',
      async () => {
        const [serverResults] = await runBuild('custom-server-config');
        const serverModule = getModule(serverResults, 'server');

        expect(serverModule.source).toMatch('port: 3000');
        expect(serverModule.source).toMatch('ip: "127.0.0.1"');
        expect(serverModule.source).toMatch(
          'assetPrefix: "https://localhost/webpack/assets"',
        );
      },
      BUILD_TIMEOUT,
    );
  });
});

function runBuild(configPath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const pathFromRoot = path.resolve(
      './packages/react-server-webpack-plugin/src/test/fixtures',
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
  const newResults = results.modules.find(({name}) =>
    name.includes(`./${basePath}.js`),
  );

  if (newResults.source) {
    return newResults;
  }

  return getModule(newResults, basePath);
}
