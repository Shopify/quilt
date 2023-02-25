import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts'],
  entrypoints: {index: './src/index.ts'},
});
