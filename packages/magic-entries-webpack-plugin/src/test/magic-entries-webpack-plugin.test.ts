import webpack, {Compiler, Configuration, Stats} from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';

import {MagicEntriesPlugin} from '../magic-entries-webpack-plugin';

import {withWorkspace, Workspace} from './utilities';

const BUILD_TIMEOUT = 10000;
const ENTRY_A = `
import cats from './cats';
console.log('I am the default entry');
`;
const ENTRY_B = `
import cats from './cats';
console.log('I am a conventional entrypoint');
`;
const CATS_MODULE = `
const cats = ['kokusho', 'toki', 'cosmo', 'rika', 'rena'];
export default cats;
`;

const BASIC_WEBPACK_CONFIG: Configuration = {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  entry: './index.js',
  output: {
    filename: '[name].js',
  },
  plugins: [new MagicEntriesPlugin()],
};

describe('magic-entries-webpack-plugin', () => {
  describe('with default settings', () => {
    it(
      'does nothing when no extra entries are present',
      async () => {
        const name = 'node-no-extra-entrypoints';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', ENTRY_A);
          await workspace.write('cats.js', CATS_MODULE);

          const result = await runBuild(workspace, BASIC_WEBPACK_CONFIG);
          const main = getModule(result.modules, 'index').source;

          expect(main).toBeDefined();
          expect(main).toMatch(ENTRY_A);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'adds entrypoints which match the default pattern (*.entry.{ts,js,tsx,jsx})',
      async () => {
        const name = 'node-default-extra-entrypoints';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', ENTRY_A);
          await workspace.write('cats.js', CATS_MODULE);
          await workspace.write('basic-js.entry.js', ENTRY_B);
          await workspace.write('basic-jsx.entry.jsx', ENTRY_B);
          await workspace.write('basic-ts.entry.ts', ENTRY_B);
          await workspace.write('basic-tsx.entry.tsx', ENTRY_B);
          const result = await runBuild(workspace, BASIC_WEBPACK_CONFIG);

          const main = getModule(result.modules, 'index').source;
          expect(main).toBeDefined();
          expect(main).toMatch(ENTRY_A);

          const js = getModule(result.modules, 'basic-js').source;
          expect(js).toBeDefined();
          expect(js).toMatch(ENTRY_B);
          const jsx = getModule(result.modules, 'basic-jsx').source;
          expect(jsx).toBeDefined();
          expect(jsx).toMatch(ENTRY_B);
          const ts = getModule(result.modules, 'basic-ts').source;
          expect(ts).toBeDefined();
          expect(ts).toMatch(ENTRY_B);
          const tsx = getModule(result.modules, 'basic-tsx').source;
          expect(tsx).toBeDefined();
          expect(tsx).toMatch(ENTRY_B);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'works when used to implicitly set the main entry',
      async () => {
        const name = 'node-no-extra-entrypoints';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('main.entry.js', ENTRY_A);
          await workspace.write('cats.js', CATS_MODULE);

          const result = await runBuild(workspace, {
            ...BASIC_WEBPACK_CONFIG,
            entry: undefined,
          });
          const main = getModule(result.modules, 'main').source;

          expect(main).toBeDefined();
          expect(main).toMatch(ENTRY_A);
        });
      },
      BUILD_TIMEOUT,
    );
  });

  describe('with client preset', () => {
    const clientWebpackConfig = {
      ...BASIC_WEBPACK_CONFIG,
      plugins: [MagicEntriesPlugin.client()],
    };

    it(
      'adds entrypoints which match the client pattern (*.entry.client.{ts,js,tsx,jsx})',
      async () => {
        const name = 'node-client-extra-entrypoints';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', ENTRY_A);
          await workspace.write('cats.js', CATS_MODULE);
          await workspace.write('basic-js.entry.client.js', ENTRY_B);
          await workspace.write('basic-jsx.entry.client.jsx', ENTRY_B);
          await workspace.write('basic-ts.entry.client.ts', ENTRY_B);
          await workspace.write('basic-tsx.entry.client.tsx', ENTRY_B);
          const result = await runBuild(workspace, clientWebpackConfig);

          const main = getModule(result.modules, 'index').source;
          expect(main).toBeDefined();
          expect(main).toMatch(ENTRY_A);

          const js = getModule(result.modules, 'basic-js').source;
          expect(js).toBeDefined();
          expect(js).toMatch(ENTRY_B);
          const jsx = getModule(result.modules, 'basic-jsx').source;
          expect(jsx).toBeDefined();
          expect(jsx).toMatch(ENTRY_B);
          const ts = getModule(result.modules, 'basic-ts').source;
          expect(ts).toBeDefined();
          expect(ts).toMatch(ENTRY_B);
          const tsx = getModule(result.modules, 'basic-tsx').source;
          expect(tsx).toBeDefined();
          expect(tsx).toMatch(ENTRY_B);
        });
      },
      BUILD_TIMEOUT,
    );
  });

  describe('with server preset', () => {
    const serverWebpackConfig = {
      ...BASIC_WEBPACK_CONFIG,
      plugins: [MagicEntriesPlugin.server()],
    };

    it(
      'adds entrypoints which match the server pattern (*.entry.server.{ts,js,tsx,jsx})',
      async () => {
        const name = 'node-server-extra-entrypoints';

        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('index.js', ENTRY_A);
          await workspace.write('cats.js', CATS_MODULE);
          await workspace.write('basic-js.entry.server.js', ENTRY_B);
          await workspace.write('basic-jsx.entry.server.jsx', ENTRY_B);
          await workspace.write('basic-ts.entry.server.ts', ENTRY_B);
          await workspace.write('basic-tsx.entry.server.tsx', ENTRY_B);
          const result = await runBuild(workspace, serverWebpackConfig);

          const main = getModule(result.modules, 'index').source;
          expect(main).toBeDefined();
          expect(main).toMatch(ENTRY_A);

          const js = getModule(result.modules, 'basic-js').source;
          expect(js).toBeDefined();
          expect(js).toMatch(ENTRY_B);
          const jsx = getModule(result.modules, 'basic-jsx').source;
          expect(jsx).toBeDefined();
          expect(jsx).toMatch(ENTRY_B);
          const ts = getModule(result.modules, 'basic-ts').source;
          expect(ts).toBeDefined();
          expect(ts).toMatch(ENTRY_B);
          const tsx = getModule(result.modules, 'basic-tsx').source;
          expect(tsx).toBeDefined();
          expect(tsx).toMatch(ENTRY_B);
        });
      },
      BUILD_TIMEOUT,
    );
  });

  describe('with custom configuration', () => {
    it(
      'adds entrypoints which match a custom pattern',
      async () => {
        const name = 'node-custom-pattern-entrypoints';
        const content = 'console.log("hi")';
        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('main.js', content);
          await workspace.write('floop.js', content);
          const result = await runBuild(workspace, {
            ...BASIC_WEBPACK_CONFIG,
            plugins: [new MagicEntriesPlugin({pattern: '*.js'})],
          });

          const mainJs = getModule(result.modules, 'main').source;
          expect(mainJs).toBeDefined();
          expect(mainJs).toMatch(content);
          const floopJs = getModule(result.modules, 'floop').source;
          expect(floopJs).toBeDefined();
          expect(floopJs).toMatch(content);
        });
      },
      BUILD_TIMEOUT,
    );

    it(
      'adds entrypoints from a custom sub-folder',
      async () => {
        const name = 'node-custom-folder-entrypoints';
        const content = 'console.log("hi")';
        await withWorkspace(name, async ({workspace}) => {
          await workspace.write('entrypoints/main.entry.js', content);
          await workspace.write('entrypoints/floop.entry.js', content);
          const result = await runBuild(workspace, {
            ...BASIC_WEBPACK_CONFIG,
            plugins: [new MagicEntriesPlugin({folder: 'entrypoints'})],
          });

          const mainJs = getModule(result.modules, 'entrypoints/main').source;
          expect(mainJs).toBeDefined();
          expect(mainJs).toMatch(content);
          const floopJs = getModule(result.modules, 'entrypoints/floop').source;
          expect(floopJs).toBeDefined();
          expect(floopJs).toMatch(content);
        });
      },
      BUILD_TIMEOUT,
    );

    describe('virtual modules', () => {
      it(
        'creates a magic entrypoint for virtually created entrypoints',
        async () => {
          const clientWebpackConfig = {
            ...BASIC_WEBPACK_CONFIG,
            plugins: [
              new VirtualModulesPlugin({
                'basic-js.entry.client.js': ENTRY_B,
                'basic-jsx.entry.client.jsx': ENTRY_B,
                'basic-ts.entry.client.ts': ENTRY_B,
                'basic-tsx.entry.client.tsx': ENTRY_B,
              }),
              MagicEntriesPlugin.client(),
            ],
          };
          const name = 'node-virtual-module-entrypoints';
          await withWorkspace(name, async ({workspace}) => {
            await workspace.write('index.js', ENTRY_A);
            await workspace.write('cats.js', CATS_MODULE);
            const result = await runBuild(workspace, clientWebpackConfig);

            const js = getModule(result.modules, 'basic-js').source;
            expect(js).toBeDefined();
            expect(js).toMatch(ENTRY_B);
            const jsx = getModule(result.modules, 'basic-jsx').source;
            expect(jsx).toBeDefined();
            expect(jsx).toMatch(ENTRY_B);
            const ts = getModule(result.modules, 'basic-ts').source;
            expect(ts).toBeDefined();
            expect(ts).toMatch(ENTRY_B);
            const tsx = getModule(result.modules, 'basic-tsx').source;
            expect(tsx).toBeDefined();
            expect(tsx).toMatch(ENTRY_B);
          });
        },
        BUILD_TIMEOUT,
      );
    });
  });
});

function runBuild(
  workspace: Workspace,
  config: Configuration,
): Promise<Stats.ToJsonOutput> {
  return new Promise((resolve, reject) => {
    const pathFromRoot = workspace.resolvePath('.');

    const contextConfig = {
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
      resolve(statsObject);
    });
  });
}

function getModule(results: Stats.FnModules[], basePath: string) {
  const newResults = Array.from(results).find(({name, source}) => {
    return (
      (name.includes(`./${basePath}.`) ||
        name.includes(`./${basePath}/index.js`)) &&
      source != null
    );
  });

  if (newResults == null) {
    throw new Error(
      `Could not find a module for ${basePath} in output from webpack`,
    );
  }

  return newResults;
}
