import {createPackage} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});

  pkg.entry({name: 'base', root: './src/base.ts'});

  pkg.entry({name: 'noop', root: './src/noop.ts'});

  pkg.entry({name: 'fetch.browser', root: './src/fetch.browser.ts'});
  pkg.entry({name: 'fetch.jest', root: './src/fetch.jest.ts'});
  pkg.entry({name: 'fetch.node', root: './src/fetch.node.ts'});

  pkg.entry({name: 'formdata.browser', root: './src/formdata.browser.ts'});
  pkg.entry({name: 'formdata.jest', root: './src/formdata.jest.ts'});
  pkg.entry({name: 'formdata.node', root: './src/formdata.node.ts'});

  pkg.entry({
    name: 'idle-callback.browser',
    root: './src/idle-callback.browser.ts',
  });
  pkg.entry({name: 'idle-callback.jest', root: './src/idle-callback.jest.ts'});
  pkg.entry({name: 'idle-callback.node', root: './src/idle-callback.node.ts'});

  pkg.entry({
    name: 'intersection-observer.browser',
    root: './src/intersection-observer.browser.ts',
  });
  pkg.entry({
    name: 'intersection-observer.jest',
    root: './src/intersection-observer.jest.ts',
  });
  pkg.entry({
    name: 'intersection-observer.node',
    root: './src/intersection-observer.node.ts',
  });

  pkg.entry({name: 'intl.browser', root: './src/intl.browser.ts'});
  pkg.entry({name: 'intl.jest', root: './src/intl.jest.ts'});
  pkg.entry({name: 'intl.node', root: './src/intl.node.ts'});

  pkg.entry({
    name: 'mutation-observer.browser',
    root: './src/mutation-observer.browser.ts',
  });
  pkg.entry({
    name: 'mutation-observer.jest',
    root: './src/mutation-observer.jest.ts',
  });
  pkg.entry({
    name: 'mutation-observer.node',
    root: './src/mutation-observer.node.ts',
  });

  pkg.use(quiltPackage({polyfill: false}));
});
