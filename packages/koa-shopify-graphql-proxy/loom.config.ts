import {createPackage, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.use(quiltPackage());
});
