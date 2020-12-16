import 'regenerator-runtime/runtime.js';

import {resolve} from 'path';
import {sync} from 'glob';
import {
  PluginApi,
  Package,
  createComposedProjectPlugin,
  createProjectTestPlugin,
  createProjectBuildPlugin,
  toArgs,
} from '@sewing-kit/plugins';
import {react} from '@sewing-kit/plugin-react';
import {javascript, updateBabelPreset} from '@sewing-kit/plugin-javascript';
import {typescript} from '@sewing-kit/plugin-typescript';
import {buildFlexibleOutputs} from '@sewing-kit/plugin-package-flexible-outputs';
import {buildSync} from 'esbuild';
import {} from '@sewing-kit/plugin-jest';

import {addLegacyDecoratorSupport} from './plugin';

const VARIANT = 'esbuildCommonjs';
declare module '@sewing-kit/hooks' {
  interface BuildPackageTargetOptions {
    [VARIANT]: boolean;
  }
}

export function quiltPackage({jestEnv = 'jsdom', useReact = false} = {}) {
  return createComposedProjectPlugin<Package>('Quilt.Package', [
    javascript(),
    typescript(),
    useReact && react(),
    buildFlexibleOutputs({
      binaries: true,
      commonjs: false,
      esmodules: false,
      esnext: false,
      node: false,
      typescript: false,
    }),

    createProjectBuildPlugin('Quilt.PackageBuild', ({hooks, api, project}) => {
      hooks.targets.hook(targets =>
        targets.map(target =>
          target.default ? target.add({esbuildCommonjs: true}) : target,
        ),
      );

      hooks.steps.hook((steps, configuration) => {
        return [...steps, createEsBuildCompileStep({api, project})];
      });
    }),

    createProjectBuildPlugin('Quilt.PackageBuild', ({hooks}) => {
      hooks.target.hook(({hooks}) => {
        hooks.configure.hook(hooks => {
          hooks.babelIgnorePatterns?.hook(ext => [
            ...ext,
            '**/test/**/*',
            '**/tests/**/*',
          ]);
        });
      });
    }),
    createProjectTestPlugin('Quilt.PackageTest', ({hooks}) => {
      hooks.configure.hook(hooks => {
        hooks.jestEnvironment?.hook(() => jestEnv);

        hooks.jestTransforms?.hook(transforms => ({
          ...transforms,
          '\\.(gql|graphql)$': 'jest-transform-graphql',
        }));

        hooks.jestWatchIgnore?.hook(patterns => [
          ...patterns,
          '<rootDir>/.*/tests?/.*fixtures',
        ]);

        hooks.babelConfig?.hook(addLegacyDecoratorSupport);

        // Each test imports from react-testing during setup
        hooks.babelConfig?.hook(
          updateBabelPreset(
            ['@babel/preset-react', require.resolve('@babel/preset-react')],
            {
              development: false,
              useBuiltIns: true,
            },
          ),
        );
      });
    }),
  ]);
}

interface EsbuildCompileOptions {
  readonly api: PluginApi;
  readonly project: Package;
  readonly bundle?: boolean;
  readonly minify?: boolean;
  readonly sourceMap?: boolean;
  readonly target?: string[];
}

function createEsBuildCompileStep({api, project}: EsbuildCompileOptions) {
  return api.createStep(
    {id: 'esbuild.Compile', label: 'compile with esbuild'},
    async step => {
      const sourceRoot = resolve(project.root, 'src');
      const sourceFiles = sync(resolve(sourceRoot, '**', '*.ts'));
      const files = sourceFiles.filter(file => !file.includes('.test.'));

      const outputPath = project.fs.buildPath('cjs');

      for (const file of files) {
        await step.exec('node_modules/.bin/esbuild', [
          file,
          `--outdir=${outputPath}`,
          `--format=cjs`,
        ]);
      }
    },
  );
}
