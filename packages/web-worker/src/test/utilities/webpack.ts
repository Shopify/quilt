import * as path from 'path';
import webpack from 'webpack';
import {Context} from './context';

export function runWebpack(
  {workspace, server}: Context,
  extraConfig: import('webpack').Configuration,
) {
  return new Promise((resolve, reject) => {
    const srcRoot = path.resolve(__dirname, '../../');

    require('@babel/register')({
      only: [srcRoot],
      extensions: ['.ts'],
      presets: [['shopify-preset-shopify/node', {typescript: true}]],
    });

    webpack(
      {
        ...extraConfig,
        output: {
          path: workspace.buildPath(),
          publicPath: server.assetUrl().href,
        },
        resolve: {
          extensions: ['.js', '.ts', '.json'],
          alias: {
            '@shopify/web-workers': srcRoot,
          },
        },
        resolveLoader: {
          extensions: ['.js', '.ts', '.json'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              include: srcRoot,
              loaders: [
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    presets: [
                      [
                        'babel-preset-shopify/web',
                        {typescript: true, browsers: 'last 1 chrome version'},
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
