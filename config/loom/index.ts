import {
  Package,
  createComposedProjectPlugin,
  createProjectTestPlugin,
} from '@shopify/loom';
import {buildLibrary, babel} from '@shopify/loom-plugin-build-library';

// Needed so TS realises what configuration hooks are provided by Jest
import type {} from '@shopify/loom-plugin-jest';

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
    ? 'extends @shopify/browserslist-config, node 12.14.0'
    : 'node 12.14.0';

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
      });
    }),
  ]);
}
