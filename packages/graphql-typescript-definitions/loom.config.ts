import {createPackage, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.binary({name: 'graphql-typescript-definitions', root: './src/cli'});
  pkg.use(quiltPackage());
});
