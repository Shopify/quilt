import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.entry({
    name: 'generate-dictionaries',
    root: './src/babel-plugin/generate-dictionaries.ts',
  });
  pkg.entry({
    name: 'generate-index',
    root: './src/babel-plugin/generate-index.ts',
  });
  pkg.entry({name: 'babel', root: './src/babel-plugin/index.ts'});
  pkg.use(quiltPackage());
});
