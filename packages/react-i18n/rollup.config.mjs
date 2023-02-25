import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: [
    './src/index.ts',
    './src/babel-plugin/generate-dictionaries.ts',
    './src/babel-plugin/generate-index.ts',
    './src/babel-plugin/index.ts',
  ],
  entrypoints: {
    index: './src/index.ts',
    'generate-dictionaries': './src/babel-plugin/generate-dictionaries.ts',
    'generate-index': './src/babel-plugin/generate-index.ts',
    babel: './src/babel-plugin/index.ts',
  },
});
