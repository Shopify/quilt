import path from 'path';
import {fileURLToPath} from 'url';

import copy from 'rollup-plugin-copy';

import {buildConfig} from '../../config/rollup.mjs';

const cwd = fileURLToPath(new URL('.', import.meta.url));

const config = buildConfig(import.meta.url, {
  entries: [
    './src/index.ts',
    './src/babel-plugin.ts',
    './src/webpack-parts/index.ts',
    './src/webpack-parts/loader.ts',
    './src/worker.ts',
  ],
  entrypoints: {
    index: './src/index.ts',
    babel: './src/babel-plugin.ts',
    webpack: './src/webpack-parts/index.ts',
    'webpack-loader': './src/webpack-parts/loader.ts',
    worker: './src/worker.ts',
  },
});

config[0].plugins.push(
  copy({
    targets: [
      {
        src: path.resolve(cwd, './src/wrappers/*'),
        dest: [
          path.resolve(cwd, './build/cjs/wrappers'),
          path.resolve(cwd, './build/esm/wrappers'),
          path.resolve(cwd, './build/esnext/wrappers'),
        ],
      },
    ],
  }),
);

export default config;
