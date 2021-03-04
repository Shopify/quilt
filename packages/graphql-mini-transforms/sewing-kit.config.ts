import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'jest', root: './src/jest'});
  pkg.entry({name: 'jest-simple', root: './src/jest-simple'});
  pkg.entry({name: 'webpack-loader', root: './src/webpack-loader'});
  pkg.use(quiltPackage());
});
