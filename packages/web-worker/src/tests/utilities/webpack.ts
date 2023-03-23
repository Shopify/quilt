import * as path from 'path';

import webpack from 'webpack';
import type {Configuration} from 'webpack';

import type {Context} from './context';

export function runWebpack(
  {workspace, server}: Context,
  extraConfig: Configuration,
) {
  return new Promise((resolve, reject) => {
    const srcRoot = path.resolve(__dirname, '../../');
    const rpcSrcRoot = path.resolve(srcRoot, '../../rpc/src');

    webpack(
      {
        ...extraConfig,
        target: 'web',
        output: {
          path: workspace.buildPath(),
          publicPath: server.assetUrl().href,
          globalObject: 'self',
          ...extraConfig.output,
        },
        resolve: {
          extensions: ['.esnext', '.js', '.ts', '.tsx', '.json'],
          alias: {
            /* eslint-disable @typescript-eslint/naming-convention */
            '@shopify/web-worker': srcRoot,
            '@shopify/web-worker/worker': path.join(srcRoot, 'worker'),
            /* eslint-enable @typescript-eslint/naming-convention */
          },
        },
        resolveLoader: {
          extensions: ['.js', '.ts', '.tsx', '.json'],
        },
        module: {
          rules: [
            {
              include: [srcRoot, rpcSrcRoot],
              exclude: /fixtures/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    configFile: false,
                    browserslistConfigFile: false,
                    targets: 'current node',
                    presets: [
                      ['@babel/preset-env', {modules: false, loose: true}],
                      '@babel/preset-typescript',
                    ],
                    plugins: [
                      [
                        '@babel/plugin-proposal-class-properties',
                        {loose: true},
                      ],
                    ],
                  },
                },
              ],
            },
            ...(extraConfig.module?.rules ?? []),
          ],
        },
      },
      (error, stats) => {
        if (error) {
          reject(error);
        } else if (stats && stats.hasErrors()) {
          reject(stats.compilation.errors[0]);
        } else {
          resolve(stats);
        }
      },
    );
  });
}
