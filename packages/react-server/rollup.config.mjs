import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts', './src/webpack-plugin/index.ts'],
  entrypoints: {
    index: './src/index.ts',
    'webpack-plugin': './src/webpack-plugin/index.ts',
  },
});
