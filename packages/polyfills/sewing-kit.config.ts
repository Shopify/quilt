import {createPackage, Runtime} from '@sewing-kit/config';
import {Package, createProjectBuildPlugin} from '@sewing-kit/plugins';
import {BabelConfig, updateBabelPreset} from '@sewing-kit/plugin-javascript';

import {quiltPackage} from '../../config/sewing-kit';

export default createPackage(pkg => {
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

  pkg.entry({
    name: 'unhandled-rejection.browser',
    root: './src/unhandled-rejection.browser',
  });
  pkg.entry({
    name: 'unhandled-rejection.jest',
    root: './src/unhandled-rejection.jest',
  });
  pkg.entry({
    name: 'unhandled-rejection.node',
    root: './src/unhandled-rejection.node',
  });

  pkg.entry({name: 'url.browser', root: './src/url.browser'});
  pkg.entry({name: 'url.jest', root: './src/url.jest'});
  pkg.entry({name: 'url.node', root: './src/url.node'});

  pkg.use(quiltPackage());
  pkg.use(
    createProjectBuildPlugin('Quilt.PackagePolyfillsBuild', ({hooks}) => {
      hooks.target.hook(({hooks}) => {
        hooks.configure.hook(hooks => {
          hooks.babelConfig?.hook(
            updateBabelPreset(
              [
                '@sewing-kit/plugin-javascript/babel-preset',
                require.resolve('@sewing-kit/plugin-javascript/babel-preset'),
              ],
              {modules: 'auto', polyfill: 'inline'},
            ),
          );
        });
      });
    }),
  );
});
