import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
  pkg.entry({root: './src/index'});
  pkg.binary({name: 'graphql-validate-fixtures', root: './src/cli'});
  pkg.use(quiltPackage());
});
