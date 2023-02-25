import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: [
    './src/index.ts',
    './src/jest.ts',
    './src/jest-simple.ts',
    './src/webpack-loader.ts',
  ],
  entrypoints: {
    index: './src/index.ts',
    jest: './src/jest.ts',
    'jest-simple': './src/jest-simple.ts',
    'webpack-loader': './src/webpack-loader.ts',
  },
});
