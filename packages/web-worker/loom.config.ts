import {createPackage, createProjectBuildPlugin, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.entry({root: './src/index.ts'});
  pkg.entry({name: 'babel', root: './src/babel-plugin.ts'});
  pkg.entry({name: 'webpack', root: './src/webpack-parts/index.ts'});
  pkg.entry({name: 'worker', root: './src/worker.ts'});
  pkg.use(quiltPackage());

  // The library references the worker "wrapper" files as relative paths from
  // the source code. Because they aren’t in the dependency graph, Rollup
  // does not bundle them. This Loom plugin adds a copy rollup plugin
  // that manually moves them into the right build directory.
  pkg.use(
    createProjectBuildPlugin('WebWorker.CopyWrappers', ({hooks, project}) => {
      hooks.target.hook(({hooks, target}) => {
        hooks.configure.hook(({rollupPlugins}) => {
          rollupPlugins.hook(async (plugins) => {
            // Only add this step for the default variant
            if (Object.keys(target.options).length > 0) return plugins;

            const {default: copy} = await import('rollup-plugin-copy');

            return [
              ...plugins,
              copy({
                targets: [
                  {
                    src: project.fs.resolvePath('src/wrappers/*'),
                    dest: [
                      project.fs.buildPath('cjs/wrappers'),
                      project.fs.buildPath('esm/wrappers'),
                      project.fs.buildPath('esnext/wrappers'),
                    ],
                  },
                ],
              }),
            ];
          });
        });
      });
    }),
  );
});
