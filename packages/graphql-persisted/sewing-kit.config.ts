import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({name: 'koa', root: './src/koa-middleware'});
  pkg.entry({name: 'apollo', root: './src/apollo'});
  pkg.use(quiltPackage());
});
