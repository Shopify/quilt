import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: [
    './src/index.ts',
    './src/javascript/index.ts',
    './src/markdown/index.ts',
  ],
  entrypoints: {
    index: './src/index.ts',
    javascript: './src/javascript/index.ts',
    markdown: './src/markdown/index.ts',
  },
});
