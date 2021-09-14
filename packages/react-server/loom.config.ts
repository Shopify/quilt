import {createPackage, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'webpack-plugin', root: './src/webpack-plugin'});
  pkg.use(
    quiltPackage({
      jestEnv: 'node',
      jestTestRunner: 'jest-jasmine2',
    }),
  );
});
