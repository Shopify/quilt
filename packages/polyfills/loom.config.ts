import {createPackage, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});

  pkg.entry({name: 'base', root: './src/base'});

  pkg.entry({name: 'noop', root: './src/noop'});

  pkg.entry({name: 'fetch.browser', root: './src/fetch.browser'});
  pkg.entry({name: 'fetch.jest', root: './src/fetch.jest'});
  pkg.entry({name: 'fetch.node', root: './src/fetch.node'});

  pkg.entry({name: 'formdata.browser', root: './src/formdata.browser'});
  pkg.entry({name: 'formdata.jest', root: './src/formdata.jest'});
  pkg.entry({name: 'formdata.node', root: './src/formdata.node'});

  pkg.entry({
    name: 'idle-callback.browser',
    root: './src/idle-callback.browser',
  });
  pkg.entry({name: 'idle-callback.jest', root: './src/idle-callback.jest'});
  pkg.entry({name: 'idle-callback.node', root: './src/idle-callback.node'});

  pkg.entry({
    name: 'intersection-observer.browser',
    root: './src/intersection-observer.browser',
  });
  pkg.entry({
    name: 'intersection-observer.jest',
    root: './src/intersection-observer.jest',
  });
  pkg.entry({
    name: 'intersection-observer.node',
    root: './src/intersection-observer.node',
  });

  pkg.entry({name: 'intl.browser', root: './src/intl.browser'});
  pkg.entry({name: 'intl.jest', root: './src/intl.jest'});
  pkg.entry({name: 'intl.node', root: './src/intl.node'});

  pkg.entry({
    name: 'mutation-observer.browser',
    root: './src/mutation-observer.browser',
  });
  pkg.entry({
    name: 'mutation-observer.jest',
    root: './src/mutation-observer.jest',
  });
  pkg.entry({
    name: 'mutation-observer.node',
    root: './src/mutation-observer.node',
  });

  pkg.use(quiltPackage({polyfill: false}));
});
