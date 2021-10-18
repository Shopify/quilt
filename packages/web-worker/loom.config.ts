import {createPackage, createProjectBuildPlugin, Runtime} from '@shopify/loom';

import {quiltPackage} from '../../config/loom';

export default createPackage((pkg) => {
  pkg.runtimes(Runtime.Browser, Runtime.Node);
  pkg.entry({root: './src/index'});
  pkg.entry({name: 'babel', root: './src/babel-plugin'});
  pkg.entry({name: 'webpack', root: './src/webpack-parts'});
  pkg.entry({name: 'worker', root: './src/worker'});
  pkg.use(quiltPackage());

  // The library references the worker "wrapper" files as relative paths from
  // the source code. Because they aren’t in the dependency graph, Rollup
  // does not bundle them. This sewing-kit plugin adds a copy rollup plugin
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
