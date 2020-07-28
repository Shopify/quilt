import {
  Package,
  createComposedProjectPlugin,
  createProjectTestPlugin,
  createProjectBuildPlugin,
} from '@sewing-kit/plugins';
import {react} from '@sewing-kit/plugin-react';
import {javascript} from '@sewing-kit/plugin-javascript';
import {typescript} from '@sewing-kit/plugin-typescript';
import {buildFlexibleOutputs} from '@sewing-kit/plugin-package-flexible-outputs';
import {} from '@sewing-kit/plugin-jest';

import {addLegacyDecoratorSupport, addReactPreset} from './plugins';

export function quiltPackage({jestEnv = 'jsdom', useReact = false} = {}) {
  return createComposedProjectPlugin<Package>('Quilt.Package', [
    javascript(),
    typescript(),
    useReact && react(),
    buildFlexibleOutputs(),
    createProjectBuildPlugin('Quilt.PackageBuild', ({hooks}) => {
      hooks.target.hook(({hooks}) => {
        hooks.configure.hook(hooks => {
          hooks.babelIgnorePatterns?.hook(ext => [
            ...ext,
            '**/*.test.ts',
            '**/*.test.tsx',
          ]);

          hooks.babelConfig?.hook(addLegacyDecoratorSupport);
        });
      });
    }),
    createProjectTestPlugin('Quilt.PackageTest', ({hooks}) => {
      hooks.configure.hook(hooks => {
        hooks.jestEnvironment?.hook(() => jestEnv);

        hooks.jestTransforms?.hook(transforms => ({
          ...transforms,
          '\\.(gql|graphql)$': 'jest-transform-graphql',
        }));

        hooks.jestWatchIgnore?.hook(patterns => [
          ...patterns,
          '<rootDir>/.*/tests?/.*fixtures',
        ]);

        hooks.babelConfig?.hook(config =>
          // For all our package tests, we import from react-testing (see tests/setup/test.ts)
          addReactPreset(addLegacyDecoratorSupport(config)),
        );
      });
    }),
  ]);
}
