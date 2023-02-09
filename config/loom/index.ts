import {existsSync} from 'fs';

import {Package, createComposedProjectPlugin} from '@shopify/loom';

import {rollupHooks, rollupBuild} from './plugin-rollup';
import {rollupConfig} from './plugin-rollup-config';
import {writeBinaries} from './plugin-write-binaries';
import {writeEntrypoints} from './plugin-write-entrypoints';

export function quiltPackage({isIsomorphic = true} = {}) {
  const targets = isIsomorphic
    ? 'extends @shopify/browserslist-config, node 14.17.0'
    : 'node 14.17.0';

  return createComposedProjectPlugin<Package>('Quilt.Package', [
    rollupHooks(),
    rollupBuild(),
    rollupConfig({
      targets,
      commonjs: true,
      esmodules: true,
      esnext: true,
    }),
    writeBinaries(),
    writeEntrypoints({commonjs: true, esmodules: true, esnext: true}),
  ]);
}
