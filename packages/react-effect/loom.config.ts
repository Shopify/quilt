import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.entry({name: 'server', root: './src/server.tsx'});
  pkg.use(quiltPackage());
});
