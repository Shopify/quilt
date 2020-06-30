import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
  pkg.entry({root: './src/index', runtime: Runtime.Node});
  pkg.entry({name: 'matchers', root: './src/matchers', runtime: Runtime.Node});
  pkg.use(quiltPackage());
});
