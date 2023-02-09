import {existsSync} from 'fs';

import {Package, createComposedProjectPlugin} from '@shopify/loom';

import {rollupHooks, rollupBuild} from './plugin-rollup';
import {rollupConfig} from './plugin-rollup-config';
import {writeBinaries} from './plugin-write-binaries';
import {writeEntrypoints} from './plugin-write-entrypoints';

export function quiltPackage({isIsomorphic = true, polyfill = true} = {}) {
  // The babel preset polyfills by default, if we don't want polyfilling to
  // occur we need to turn some options off
  const polyfillOptions = polyfill ? {} : {useBuiltIns: false, corejs: false};

  const targets = isIsomorphic
    ? 'extends @shopify/browserslist-config, node 14.17.0'
    : 'node 14.17.0';

  return createComposedProjectPlugin<Package>('Quilt.Package', [
    rollupHooks(),
    rollupBuild(),
    rollupConfig({
      targets,
      babelConfig: {
        presets: [
          [
            '@shopify/babel-preset',
            {typescript: true, react: true, ...polyfillOptions},
          ],
        ],
        // Disable loading content from babel.config.js
        configFile: false,
      },
      commonjs: true,
      esmodules: true,
      esnext: true,
    }),
    writeBinaries(),
    writeEntrypoints({commonjs: true, esmodules: true, esnext: true}),
  ]);
}
