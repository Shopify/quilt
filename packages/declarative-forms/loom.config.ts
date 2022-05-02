import {eslint} from '@shopify/loom-plugin-eslint';
import {prettier} from '@shopify/loom-plugin-prettier';
import {createPackage} from '@shopify/loom';
import {
  buildLibrary,
  buildLibraryWorkspace,
} from '@shopify/loom-plugin-build-library';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});

  pkg.use(
    buildLibrary({
      commonjs: true,
      esmodules: true,
      esnext: true,
      targets: 'extends @shopify/browserslist-config, ios >= 12, node 12.13',
      jestTestEnvironment: 'jsdom',
    }),
    buildLibraryWorkspace(),
    eslint(),
    prettier({files: '**/*.{md,json,yaml,yml}'}),
  );
});
