import {createPackage, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'jest', root: './src/jest'});
  pkg.entry({name: 'jest-simple', root: './src/jest-simple'});
  pkg.entry({name: 'webpack-loader', root: './src/webpack-loader'});
  pkg.use(quiltPackage());
});
