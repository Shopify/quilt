import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'babel', root: './src/babel-plugin'});
  pkg.use(quiltPackage());
});
