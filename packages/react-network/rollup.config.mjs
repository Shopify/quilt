import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts', './src/server.ts'],
  entrypoints: {index: './src/index.ts', server: './src/server.ts'},
});
