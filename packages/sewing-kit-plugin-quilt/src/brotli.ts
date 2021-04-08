import {createProjectBuildPlugin, Runtime} from '@sewing-kit/plugins';

export function brotli() {
  return createProjectBuildPlugin('Brotli', ({hooks}) => {
    hooks.target.hook(({target, hooks}) => {
      if (
        !target.runtime.includes(Runtime.Browser) &&
        !target.runtime.includes(Runtime.WebWorker)
      ) {
        return;
      }

      hooks.configure.hook((configuration) => {
        configuration.webpackPlugins?.hook((plugins) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const CompressionPlugin = require('compression-webpack-plugin');

          return [
            ...plugins,
            new CompressionPlugin({
              filename: '[path][base].br',
              algorithm: 'brotliCompress',
              minRatio: 1,
              test: /\.(js|css)$/,
            }),
          ];
        });
      });
    });
  });
}
