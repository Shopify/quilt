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
  // The babel preset polyfills by default, if we don't want polyfilling to
  // occur we need to turn some options off
  const polyfillOptions = polyfill ? {} : {useBuiltIns: false, corejs: false};

  return createComposedProjectPlugin<Package>('Quilt.Package', [
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
    packageBuild({
      nodeTargets: 'node 12.14.0',
      browserTargets: 'extends @shopify/browserslist-config',
    }),
    createProjectTestPlugin('Quilt.PackageTest', ({hooks}) => {
      hooks.configure.hook((hooks) => {
        hooks.jestEnvironment?.hook(() => jestEnv);
        hooks.jestTestRunner?.hook(() => jestTestRunner);

        hooks.jestTransforms?.hook((transforms) => ({
          ...transforms,
          '\\.(gql|graphql)$': 'jest-transform-graphql',
        }));

        hooks.jestWatchIgnore?.hook((patterns) => [
          ...patterns,
          '<rootDir>/.*/tests?/.*fixtures',
        ]);
      });
    }),
  ]);
}
