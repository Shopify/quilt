import {createPackage, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({name: 'koa', root: './src/koa-middleware'});
  pkg.entry({name: 'apollo', root: './src/apollo'});
  pkg.use(quiltPackage());
});
