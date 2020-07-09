import {
  Package,
  createComposedProjectPlugin,
  createProjectTestPlugin,
} from '@sewing-kit/plugins';
import {react} from '@sewing-kit/plugin-react';
import {javascript} from '@sewing-kit/plugin-javascript';
import {typescript} from '@sewing-kit/plugin-typescript';
import {buildFlexibleOutputs} from '@sewing-kit/plugin-package-flexible-outputs';

export function quiltPackage({binaryOnly = false, jestEnv = 'jsdom'} = {}) {
  return createComposedProjectPlugin<Package>('Quilt.DefaultProject', [
    javascript(),
    typescript(),
    react(),
    buildFlexibleOutputs({
      esnext: !binaryOnly,
      esmodules: !binaryOnly,
    }),
    createProjectTestPlugin('Quilt.JestEnvironment', ({hooks}) => {
      hooks.configure.hook(hooks => {
        hooks.jestEnvironment?.hook(_ => jestEnv);
      });
    }),
    createProjectTestPlugin('Quilt.JestConfig', ({hooks}) => {
      hooks.configure.hook(hooks => {
        hooks.jestConfig?.hook(config => ({
          ...config,
          setupFiles: ['../../test/setup.ts'],
          setupFilesAfterEnv: ['../../test/each-test.ts'],
        }));
      });
    }),
    createProjectTestPlugin('Quilt.BabelTest', ({hooks}) => {
      hooks.configure.hook(hooks => {
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
