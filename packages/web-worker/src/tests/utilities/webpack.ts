import * as path from 'path';

import webpack from 'webpack';

import {Context} from './context';

export function runWebpack(
  {workspace, server}: Context,
  extraConfig: import('webpack').Configuration,
) {
  return new Promise((resolve, reject) => {
    const srcRoot = path.resolve(__dirname, '../../');
    const rpcSrcRoot = path.resolve(srcRoot, '../../rpc/src');

    webpack(
      {
        ...extraConfig,
        output: {
          path: workspace.buildPath(),
          publicPath: server.assetUrl().href,
          globalObject: 'self',
          ...extraConfig.output,
        },
        resolve: {
          extensions: ['.js', '.ts', '.json'],
          alias: {
            '@shopify/rpc': rpcSrcRoot,
            '@shopify/web-worker': srcRoot,
            '@shopify/web-worker/worker': path.join(srcRoot, 'worker'),
          },
        },
        resolveLoader: {
          extensions: ['.js', '.ts', '.json'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              include: {or: [srcRoot, rpcSrcRoot]},
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    presets: [
                      [
                        '@shopify/babel-preset',
                        {
                          typescript: true,
                          browsers: 'last 1 chrome version',
                          useBuiltIns: 'usage',
                        },
                      ],
                    ],
                  },
                },
              ],
            },
            ...((extraConfig.module && extraConfig.module.rules) || []),
          ],
        },
      },
      (error, stats) => {
        if (error) {
          reject(error);
        } else if (stats.hasErrors()) {
          reject(stats.compilation.errors[0]);
        } else {
          resolve(stats);
        }
      },
    );
  });
}
