import {createPackage, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'javascript', root: './src/javascript'});
  pkg.entry({name: 'markdown', root: './src/markdown'});
  pkg.use(quiltPackage());
});
