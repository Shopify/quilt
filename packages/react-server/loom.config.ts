import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.entry({name: 'webpack-plugin', root: './src/webpack-plugin/index.ts'});
  pkg.use(
    quiltPackage({
      jestEnv: 'node',
      jestTestRunner: 'jest-jasmine2',
    }),
  );
});
