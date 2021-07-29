import {createPackage, Runtime} from '@sewing-kit/core';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.entry({
    name: 'generate-dictionaries',
    root: './src/babel-plugin/generate-dictionaries',
  });
  pkg.entry({
    name: 'generate-index',
    root: './src/babel-plugin/generate-index',
  });
  pkg.entry({name: 'babel', root: './src/babel-plugin'});
  pkg.use(quiltPackage());
});
