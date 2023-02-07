import {
  createProjectBuildPlugin,
  Package,
  DiagnosticError,
} from '@shopify/loom';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals';

// Babel config that is provided by the hook is the same set of options as
// defined on https://babeljs.io/docs/en/options, except the include and exclude
// options may not be present
interface BabelConfig extends Omit<TransformOptions, 'include' | 'exclude'> {}

declare module '@shopify/loom' {
  interface BuildPackageTargetOptions {
    rollupEsnext?: boolean;
  }
}

interface RollupConfigOptions {
  targets: string;
  babelConfig: BabelConfig;
  commonjs: boolean;
  esmodules: boolean;
  esnext: boolean;
}

export function rollupConfig(options: RollupConfigOptions) {
  return createProjectBuildPlugin<Package>(
    'BuildLibrary.RollupConfig',
    ({hooks, project}) => {
      // Define additional build variant to build esnext output
      hooks.targets.hook((targets) => {
        return targets.map((target) => {
          return options.esnext && target.default
            ? target.add({rollupEsnext: true})
            : target;
        });
      });

      // Define config for build variants
      // eslint-disable-next-line @typescript-eslint/require-await
      hooks.target.hook(async ({target, hooks}) => {
        const isDefaultBuild = Object.keys(target.options).length === 0;
        const isEsnextBuild = Boolean(target.options.rollupEsnext);
        if (!(isDefaultBuild || isEsnextBuild)) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/require-await
        hooks.configure.hook(async (configuration) => {
          configuration.rollupInput?.hook(async (input) => {
            const absentInputEntries = await asyncFilter(
              [...target.project.entries, ...target.project.binaries],
              ({root}) =>
                project.fs
                  .hasFile(project.fs.resolvePath(root))
                  .then((hasFile) => !hasFile),
            );

            if (absentInputEntries.length) {
              const absentInputEntriesString = absentInputEntries
                .map((item) => `"${item.root}"`)
                .join(', ');

              throw new DiagnosticError({
                title: `The following entry/binary root paths were defined in "${project.name}" but do not exist on disk: ${absentInputEntriesString}.`,
                suggestion: `Root paths in your pkg.entry() / pkg.binary() config must be valid file paths. Update any paths to match the filename on disk. e.g. use "pkg.entry({root: './src/index.EXTENSION_HERE'})" instead of "pkg.entry({root: './src/index'})"`,
              });
            }

            const inputEntries = [
              ...target.project.entries,
              ...target.project.binaries,
            ].map(({root}) => project.fs.resolvePath(root));

            if (inputEntries.length === 0) {
              throw new DiagnosticError({
                title: `No inputs found for "${project.name}".`,
                suggestion: `Set a pkg.entry() in your loom.config that maps to a file on disk. Use 'pkg.entry({root: './src/index.js'})" to use the index.js file`,
              });
            }

            return input.concat(inputEntries);
          });

          configuration.rollupPlugins?.hook(async (plugins) => {
            const babelConfig = options.babelConfig;

            const babelTargets = isEsnextBuild
              ? ['last 1 chrome versions']
              : [options.targets];

            const packagePath = (await project.fs.hasFile('./package.json'))
              ? project.fs.resolvePath('./package.json')
              : [];

            return plugins.concat([
              externals({
                deps: true,
                packagePath,
              }),
              nodeResolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
              }),
              commonjs(),
              babel({
                ...babelConfig,
                // Options specific to @rollup/plugin-babel, these can not be
                // present on the `babelConfig` object
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                exclude: 'node_modules/**',
                babelHelpers: 'bundled',
                // Options that may be present on the `babelConfig` object but
                // we want to override
                envName: 'production',
                // @ts-expect-error targets is a valid babel option but @types/babel__core doesn't know that yet
                targets: babelTargets,
              }),
            ]);
          });

          configuration.rollupOutputs?.hook((outputs) => {
            const additionalOutputs: typeof outputs = [];

            if (isDefaultBuild) {
              if (options.commonjs) {
                additionalOutputs.push({
                  format: 'cjs',
                  dir: project.fs.buildPath('cjs'),
                  preserveModules: true,
                  entryFileNames: '[name][assetExtname].js',
                  exports: 'named',
                });
              }

              if (options.esmodules) {
                additionalOutputs.push({
                  format: 'esm',
                  dir: project.fs.buildPath('esm'),
                  preserveModules: true,
                  entryFileNames: '[name][assetExtname].mjs',
                });
              }
            } else if (isEsnextBuild) {
              if (options.esnext) {
                additionalOutputs.push({
                  format: 'esm',
                  dir: project.fs.buildPath('esnext'),
                  preserveModules: true,
                  entryFileNames: '[name][assetExtname].esnext',
                });
              }
            }

            return outputs.concat(additionalOutputs);
          });
        });
      });
    },
  );
}

async function asyncFilter<T>(
  arr: T[],
  predicate: (value: T, index: number) => unknown,
) {
  return Promise.all(arr.map(predicate)).then((results) =>
    arr.filter((_v, index) => results[index]),
  );
}
