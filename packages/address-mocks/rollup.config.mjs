import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts', './src/utilities.ts'],
  entrypoints: {index: './src/index.ts', utilities: './src/utilities.ts'},
});
