import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'babel', root: './src/babel-plugin'});
  pkg.entry({name: 'webpack', root: './src/webpack-parts'});
  pkg.entry({name: 'worker', root: './src/worker'});
  pkg.use(quiltPackage());
});
