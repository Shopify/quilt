import {existsSync} from 'fs';

import {
  Package,
  createComposedProjectPlugin,
  createProjectBuildPlugin,
  createProjectTestPlugin,
  DiagnosticError,
  LogLevel,
} from '@shopify/loom';

import {rollupHooks, rollupBuild} from './plugin-rollup';
import {rollupConfig} from './plugin-rollup-config';
import {writeBinaries} from './plugin-write-binaries';
import {writeEntrypoints} from './plugin-write-entrypoints';

export function quiltPackage({isIsomorphic = true, polyfill = true} = {}) {
  // The babel preset polyfills by default, if we don't want polyfilling to
  // occur we need to turn some options off
  const polyfillOptions = polyfill ? {} : {useBuiltIns: false, corejs: false};

  const targets = isIsomorphic
    ? 'extends @shopify/browserslist-config, node 14.17.0'
    : 'node 14.17.0';

  return createComposedProjectPlugin<Package>('Quilt.Package', [
    rollupHooks(),
    rollupBuild(),
    rollupConfig({
      targets,
      babelConfig: {
        presets: [
          [
            '@shopify/babel-preset',
            {typescript: true, react: true, ...polyfillOptions},
          ],
        ],
        // Disable loading content from babel.config.js
        configFile: false,
      },
      commonjs: true,
      esmodules: true,
      esnext: true,
    }),
    writeBinaries(),
    writeEntrypoints({commonjs: true, esmodules: true, esnext: true}),
    runTsd(),
  ]);
}

/**
 * TSD allows us to run assertions against the types that are generated as part of the build.
 * This is ran as a build step because the tests assert against the compiled types
 * in `packages/PACKAGENAME/build/ts` (i.e. build output) rather than source code.
 */
function runTsd() {
  return createProjectBuildPlugin('tsd', ({hooks, api, project}) => {
    if (!existsSync(`${project.root}/test-d`)) {
      return;
    }

    hooks.target.hook(({target, hooks}) => {
      const isDefaultBuild = Object.keys(target.options).length === 0;
      if (!isDefaultBuild) {
        return;
      }

      hooks.steps.hook((steps) => [
        ...steps,
        api.createStep({id: 'tsd', label: 'Run TSD'}, async (step) => {
          try {
            await step.exec('tsd', [project.root], {
              preferLocal: true,
              all: true,
              env: {FORCE_COLOR: '1'},
            });
          } catch (error) {
            throw new DiagnosticError({
              title: 'TSD found errors.',
              content: error.all,
            });
          }
        }),
      ]);
    });
  });
}
