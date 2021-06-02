import {WebApp, Target, createProjectPlugin, Task} from '@sewing-kit/plugins';
import type {
  BuildWebAppConfigurationHooks,
  DevWebAppConfigurationHooks,
  BuildWebAppTargetOptions,
} from '@sewing-kit/hooks';
import type {} from '@sewing-kit/plugin-webpack';

import {MAGIC_MODULE_APP_COMPONENT} from './constants';

interface IncludeDetails {
  readonly task: Task;
  readonly target?: Target<WebApp, BuildWebAppTargetOptions>;
}

interface Options {
  include?(details: IncludeDetails): boolean;
}

export function webAppMagicModules({include = () => true}: Options = {}) {
  return createProjectPlugin<WebApp>(
    'Quilt.WebAppMagicModules',
    ({api, project, tasks}) => {
      const appEntry = project.fs.resolvePath(project.entry ?? 'index');
      const appComponentModulePath = api.tmpPath(
        `quilt/${project.name}-app-component.js`,
      );

      function addMagicModules({
        webpackAliases,
        webpackPlugins,
      }: BuildWebAppConfigurationHooks | DevWebAppConfigurationHooks) {
        webpackAliases?.hook((aliases) => ({
          ...aliases,
          [MAGIC_MODULE_APP_COMPONENT]: appComponentModulePath,
        }));

        webpackPlugins?.hook(async (plugins) => {
          const {default: WebpackVirtualModules} = await import(
            'webpack-virtual-modules'
          );

          return [
            ...plugins,
            new WebpackVirtualModules({
              [appComponentModulePath]: `
                import * as AppModule from ${JSON.stringify(appEntry)};

                const App = getAppComponent();
                export default App;

                function getAppComponent() {
                  if (typeof AppModule.default === 'function') return AppModule.default;
                  if (typeof AppModule.App === 'function') return AppModule.App;
                
                  const firstFunction = Object.keys(AppModule)
                    .map((key) => AppModule[key])
                    .find((exported) => typeof exported === 'function');
                
                  if (firstFunction) return firstFunction;
                
                  throw new Error('No App component found in module: ' + ${JSON.stringify(
                    appEntry,
                  )});
                }
              `,
            }),
          ];
        });
      }

      tasks.build.hook(({hooks}) => {
        hooks.target.hook(({target, hooks}) => {
          if (!include({target, task: Task.Dev})) return;

          hooks.configure.hook(addMagicModules);
        });
      });

      tasks.dev.hook(({hooks}) => {
        if (!include({task: Task.Build})) return;

        hooks.configure.hook(addMagicModules);
      });
    },
  );
}
