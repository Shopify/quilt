import {createPackage, Runtime} from '@sewing-kit/core';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage((pkg) => {
  pkg.runtime(Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.use(quiltPackage());
});
