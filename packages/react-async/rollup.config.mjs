import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/index.ts', './src/testing.tsx'],
  entrypoints: {index: './src/index.ts', testing: './src/testing.tsx'},
});
