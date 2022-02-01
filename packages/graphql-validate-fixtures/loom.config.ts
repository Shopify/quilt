import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.binary({name: 'graphql-validate-fixtures', root: './src/cli.ts'});
  pkg.use(quiltPackage());
});
