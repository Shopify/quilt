import {
  Package,
  createComposedProjectPlugin,
  createProjectTestPlugin,
} from '@sewing-kit/core';
import {babel} from '@sewing-kit/plugin-babel';
import {packageBuild} from '@sewing-kit/plugin-package-build';
import {} from '@sewing-kit/plugin-jest';

export function quiltPackage({
  jestEnv = 'jsdom',
  jestTestRunner = 'jest-circus',
  polyfill = true,
} = {}) {
  return createComposedProjectPlugin<Package>('Quilt.Package', [
    babel({
      config: {
        presets: [
          [
            '@shopify/babel-preset',
            {
              typescript: true,
              react: true,
              // The preset polyfills by default, we need explicit options to
              // disable that
              ...(polyfill ? {} : {useBuiltIns: false, corejs: false}),
            },
          ],
        ],
      },
    }),
    packageBuild({
      nodeTargets: 'node 12.14.0',
      browserTargets: 'extends @shopify/browserslist-config',
    }),
    createProjectTestPlugin('Quilt.PackageTest', ({hooks}) => {
      hooks.configure.hook((hooks) => {
        hooks.jestEnvironment?.hook(() => jestEnv);

        hooks.jestTransforms?.hook((transforms) => ({
          ...transforms,
          '\\.(gql|graphql)$': 'jest-transform-graphql',
        }));

        hooks.jestConfig?.hook((jestConfig) => {
          return {
            ...jestConfig,
            testRunner: jestTestRunner,
          };
        });

        hooks.jestWatchIgnore?.hook((patterns) => [
          ...patterns,
          '<rootDir>/.*/tests?/.*fixtures',
        ]);
      });
    }),
  ]);
}
