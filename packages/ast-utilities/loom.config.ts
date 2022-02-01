import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.entry({name: 'javascript', root: './src/javascript/index.ts'});
  pkg.entry({name: 'markdown', root: './src/markdown/index.ts'});
  pkg.use(quiltPackage());
});
