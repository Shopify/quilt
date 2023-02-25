import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts', './src/server/index.ts'],
  entrypoints: {index: './src/index.ts', server: './src/server/index.ts'},
});
