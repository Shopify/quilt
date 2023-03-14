import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: [
    './src/index.ts',
    './src/jest.ts',
    './src/jest-simple.ts',
    './src/rollup.ts',
    './src/webpack-loader.ts',
    './src/vite.ts',
  ],
  entrypoints: {
    index: './src/index.ts',
    jest: './src/jest.ts',
    'jest-simple': './src/jest-simple.ts',
    rollup: './src/rollup.ts',
    'webpack-loader': './src/webpack-loader.ts',
    vite: './src/vite.ts',
  },
});
