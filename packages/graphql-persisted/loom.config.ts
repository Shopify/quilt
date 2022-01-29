import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({name: 'koa', root: './src/koa-middleware.ts'});
  pkg.entry({name: 'apollo', root: './src/apollo.ts'});
  pkg.use(quiltPackage());
});
