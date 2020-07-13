import {
  Package,
  createComposedProjectPlugin,
  createProjectTestPlugin,
} from '@sewing-kit/plugins';
import {react} from '@sewing-kit/plugin-react';
import {javascript} from '@sewing-kit/plugin-javascript';
import {typescript} from '@sewing-kit/plugin-typescript';
import {buildFlexibleOutputs} from '@sewing-kit/plugin-package-flexible-outputs';
import {createPackage} from '@sewing-kit/config';

function quiltPackage({binaryOnly = true, jestEnv = 'jsdom'} = {}) {
  return createComposedProjectPlugin<Package>('Quilt.DefaultProject', [
    javascript(),
    typescript(),
    createProjectTestPlugin('Quilt.Test', ({hooks}) => {
      hooks.configure.hook(hooks => {
        hooks.jestEnvironment?.hook(_ => jestEnv);

        hooks.jestConfig?.hook(config => ({
          ...config,
          setupFiles: ['./setup.ts'],
          setupFilesAfterEnv: ['./each-test.ts'],
          transform: {
            ...config.transform,
            '\\.(gql|graphql)$': 'jest-transform-graphql',
          },
        }));

        hooks.babelConfig?.hook(_ => ({
          presets: [
            ['babel-preset-shopify/node', {typescript: true}],
            'babel-preset-shopify/react',
          ],
          sourceMaps: 'inline',
        }));
      });
    }),
  ]);
}

export default createPackage(pkg => {
  pkg.use(quiltPackage());
});
