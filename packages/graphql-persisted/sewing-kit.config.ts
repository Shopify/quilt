import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
  pkg.entry({name: 'koa', root: './src/koa-middleware'});
  pkg.entry({name: 'apollo', root: './src/apollo', runtime: Runtime.Node});
  pkg.use(quiltPackage());
});
