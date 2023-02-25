import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts', './src/matchers/index.ts'],
  entrypoints: {index: './src/index.ts', matchers: './src/matchers/index.ts'},
});
