import {buildConfig} from '../../config/rollup.mjs';

export default buildConfig(import.meta.url, {
  entries: ['./src/koa-middleware.ts', './src/apollo.ts'],
  entrypoints: {
    koa: './src/koa-middleware.ts',
    apollo: './src/apollo.ts',
  },
});
