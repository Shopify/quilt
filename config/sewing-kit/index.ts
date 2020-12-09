import {
  Package,
  createComposedProjectPlugin,
  createProjectTestPlugin,
  createProjectBuildPlugin,
} from '@sewing-kit/plugins';
import {react} from '@sewing-kit/plugin-react';
import {javascript, updateBabelPreset} from '@sewing-kit/plugin-javascript';
import {typescript} from '@sewing-kit/plugin-typescript';
import {buildFlexibleOutputs} from '@sewing-kit/plugin-package-flexible-outputs';
import {} from '@sewing-kit/plugin-jest';

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
            '**/test/**/*',
            '**/tests/**/*',
          ]);
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

        // Each test imports from react-testing during setup
        hooks.babelConfig?.hook(
          updateBabelPreset(
            ['@babel/preset-react', require.resolve('@babel/preset-react')],
            {
              development: false,
              useBuiltIns: true,
            },
          ),
        );
      });
    }),
  ]);
}
