import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts', './src/babel-plugin.ts'],
  entrypoints: {
    index: './src/index.ts',
    babel: './src/babel-plugin.ts',
  },
});
