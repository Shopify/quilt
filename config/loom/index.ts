import {existsSync} from 'fs';

import {
  Package,
  createComposedProjectPlugin,
  createProjectBuildPlugin,
  createProjectTestPlugin,
  DiagnosticError,
} from '@shopify/loom';
import {buildLibrary, babel} from '@shopify/loom-plugin-build-library';

// Needed so TS realises what configuration hooks are provided by Jest
import type {} from '@shopify/loom-plugin-jest';

/** Optional value that can be provided to override the version of React used in tests */
// eslint-disable-next-line no-process-env
const REACT_VERSION = process.env.REACT_VERSION ?? '';

export function quiltPackage({
  isIsomorphic = true,
  jestEnv = 'jsdom',
  jestTestRunner = 'jest-circus',
  polyfill = true,
} = {}) {
  // The babel preset polyfills by default, if we don't want polyfilling to
  // occur we need to turn some options off
  const polyfillOptions = polyfill ? {} : {useBuiltIns: false, corejs: false};

  const targets = isIsomorphic
    ? 'extends @shopify/browserslist-config, node 14.17.0'
    : 'node 14.17.0';

  return createComposedProjectPlugin<Package>('Quilt.Package', [
    buildLibrary({
      targets,
      commonjs: true,
      esmodules: true,
      esnext: true,
      rootEntrypoints: true,
      jestTestEnvironment: jestEnv,
    }),
    babel({
      config: {
        presets: [
          [
            '@shopify/babel-preset',
            {typescript: true, react: true, ...polyfillOptions},
          ],
        ],
      },
    }),
    createProjectTestPlugin('Quilt.PackageTest', ({hooks}) => {
      hooks.configure.hook((hooks) => {
        hooks.jestTestRunner?.hook(() => jestTestRunner);

        hooks.jestTransform?.hook((transforms) => ({
          ...transforms,
          '\\.(gql|graphql)$': 'jest-transform-graphql',
        }));

        hooks.jestWatchPathIgnorePatterns?.hook((patterns) => [
          ...patterns,
          '<rootDir>/.*/tests?/.*fixtures',
        ]);

        hooks.jestModuleNameMapper?.hook((moduleNames) => ({
          ...moduleNames,
          '^react-dom((/.*)?)$': `react-dom${REACT_VERSION}$1`,
          '^react((/.*)?)$': `react${REACT_VERSION}$1`,
        }));
      });
    }),
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
