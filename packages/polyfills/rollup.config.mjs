import {buildConfig} from '../../config/rollup.mjs';

const entrypoints = {
  index: './src/index.ts',

  base: './src/base.ts',

  noop: './src/noop.ts',

  'fetch.browser': './src/fetch.browser.ts',
  'fetch.jest': './src/fetch.jest.ts',
  'fetch.node': './src/fetch.node.ts',

  'formdata.browser': './src/formdata.browser.ts',
  'formdata.jest': './src/formdata.jest.ts',
  'formdata.node': './src/formdata.node.ts',

  'idle-callback.browser': './src/idle-callback.browser.ts',
  'idle-callback.jest': './src/idle-callback.jest.ts',
  'idle-callback.node': './src/idle-callback.node.ts',

  'intersection-observer.browser': './src/intersection-observer.browser.ts',
  'intersection-observer.jest': './src/intersection-observer.jest.ts',
  'intersection-observer.node': './src/intersection-observer.node.ts',

  'intl.browser': './src/intl.browser.ts',
  'intl.jest': './src/intl.jest.ts',
  'intl.node': './src/intl.node.ts',

  'mutation-observer.browser': './src/mutation-observer.browser.ts',
  'mutation-observer.jest': './src/mutation-observer.jest.ts',
  'mutation-observer.node': './src/mutation-observer.node.ts',
};

export default buildConfig(import.meta.url, {
  entries: Object.values(entrypoints),
  entrypoints,
});
