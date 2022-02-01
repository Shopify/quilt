import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.entry({name: 'jest', root: './src/jest.ts'});
  pkg.entry({name: 'jest-simple', root: './src/jest-simple.ts'});
  pkg.entry({name: 'webpack-loader', root: './src/webpack-loader.ts'});
  pkg.use(quiltPackage());
});
