import path from 'path';

import webpack, {Compiler} from 'webpack';

export interface WebpackOptions {
  basePath: string;
  outputPath: string;
}

export function runWebpack(
  configPath: string,
  options?: Partial<WebpackOptions>,
): Promise<[string, string]> {
  const {basePath = '', outputPath = ''} = options || {};

  const quiltRoot = '../../../../../';
  const packagesRoot = path.join(quiltRoot, 'packages');

  return new Promise((resolve, reject) => {
    const pathFromRoot = path.resolve(
      './packages/react-server-webpack-plugin/src/test/fixtures',
      configPath,
    );

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(`${pathFromRoot}/webpack.config.js`);
    const merge = config => ({
      ...config,
      context: pathFromRoot,
      output: {
        path: outputPath,
      },
      resolveLoader: {
        extensions: ['.js', '.jsx', '.json'],
      },
      resolve: {
        modules: [
          path.join(quiltRoot, 'node_modules'),
          'app',
          quiltRoot,
          packagesRoot,
        ],
        alias: {
          '@shopify/*': packagesRoot,
          // '@shopify/react-html': path.join(packagesRoot, 'react-html'),
          // '@shopify/web-worker/worker': path.join(srcRoot, 'worker'),
        },
      },
    });

    const contextConfig = Array.isArray(config)
      ? config.map(merge)
      : merge(config);

    // We use MemoryOutputFileSystem to prevent webpack from outputting to our actual FS
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const MemoryOutputFileSystem = require('webpack/lib/MemoryOutputFileSystem');

    const compiler: Compiler = webpack(contextConfig);
    // compiler.outputFileSystem = new MemoryOutputFileSystem({});

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.hasErrors()) {
        reject(stats.toString());
        return;
      }

      const statsObject = stats.toJson();
      const [serverResults, clientResults] = statsObject.children;
      const serverModule = getModule(
        serverResults,
        path.join(basePath, 'server'),
      );

      const clientModule = getModule(
        clientResults,
        path.join(basePath, 'client'),
      );

      resolve([serverModule.source, clientModule.source]);
    });
  });
}

export function getModule(results: any, basePath: string) {
  if (!results || !results.modules) {
    return;
  }

  const newResults = results.modules.find(
    ({name}) =>
      name.includes(`./${basePath}.js`) ||
      name.includes(`./${basePath}/index.js`),
  );

  if (newResults && newResults.source) {
    return newResults;
  }

  return getModule(newResults, basePath);
}

// export function runWebpack(
//   {workspace, server}: Context,
//   extraConfig: import('webpack').Configuration,
// ) {
//   return new Promise((resolve, reject) => {
//     const srcRoot = path.resolve(__dirname, '../../');

//     webpack(
//       {
//         ...extraConfig,
//         output: {
//           path: workspace.buildPath(),
//           publicPath: server.assetUrl().href,
//           ...extraConfig.output,
//         },
//         resolve: {
//           extensions: ['.js', '.ts', '.json'],
//           // alias: {
//           //   '@shopify/web-rese': srcRoot,
//           //   '@shopify/web-worker/worker': path.join(srcRoot, 'worker'),
//           // },
//         },
//         resolveLoader: {
//           extensions: ['.js', '.ts', '.json'],
//         },
//         module: {
//           rules: [
//             {
//               test: /\.ts$/,
//               include: srcRoot,
//               loaders: [
//                 {
//                   loader: 'babel-loader',
//                   options: {
//                     babelrc: false,
//                     presets: [
//                       [
//                         'babel-preset-shopify/web',
//                         {typescript: true, browsers: 'last 1 chrome version'},
//                       ],
//                     ],
//                   },
//                 },
//               ],
//             },
//             ...((extraConfig.module && extraConfig.module.rules) || []),
//           ],
//         },
//       },
//       (error, stats) => {
//         if (error) {
//           reject(error);
//         } else if (stats.hasErrors()) {
//           reject(stats.compilation.errors[0]);
//         } else {
//           resolve(stats);
//         }
//       },
//     );
//   });
// }
