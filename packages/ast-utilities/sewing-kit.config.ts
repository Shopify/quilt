import {createPackage, Runtime} from '@sewing-kit/config';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'javascript', root: './src/javascript'});
  pkg.entry({name: 'markdown', root: './src/markdown'});
  pkg.use(quiltPackage());
});
