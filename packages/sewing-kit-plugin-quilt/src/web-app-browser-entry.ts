import {
  WebApp,
  Target,
  createProjectPlugin,
  Task,
  addHooks,
  WaterfallHook,
} from '@sewing-kit/plugins';
import type {
  BuildWebAppConfigurationHooks,
  DevWebAppConfigurationHooks,
  BuildWebAppTargetOptions,
} from '@sewing-kit/hooks';

import type {} from './web-app-auto-server';
import {excludeNonPolyfillEntries} from './shared';
import {MAGIC_MODULE_APP_COMPONENT} from './constants';

interface CustomHooks {
  readonly quiltBrowserEntryContent: WaterfallHook<string>;
}

declare module '@sewing-kit/hooks' {
  interface BuildWebAppConfigurationCustomHooks extends CustomHooks {}
  interface DevWebAppConfigurationCustomHooks extends CustomHooks {}
}

interface IncludeDetails {
  readonly task: Task;
  readonly target?: Target<WebApp, BuildWebAppTargetOptions>;
}

interface BrowserEntryOptions {
  readonly hydrate?: boolean | ((details: IncludeDetails) => boolean);
  include?(details: IncludeDetails): boolean;
}

export function webAppBrowserEntry({
  hydrate = true,
  include = () => true,
}: BrowserEntryOptions = {}) {
  return createProjectPlugin<WebApp>(
    'Quilt.WebAppBrowserEntry',
    ({project, api, tasks}) => {
      function addConfiguration(task: Task, target?: IncludeDetails['target']) {
        return ({
          webpackEntries,
          webpackPlugins,
          quiltBrowserEntryContent,
        }: BuildWebAppConfigurationHooks | DevWebAppConfigurationHooks) => {
          const entry = api.tmpPath(`quilt/${project.name}-client.js`);
          const shouldHydrate =
            typeof hydrate === 'boolean' ? hydrate : hydrate({target, task});
          const reactFunction = shouldHydrate ? 'hydrate' : 'render';

          webpackEntries?.hook((entries) => [
            ...excludeNonPolyfillEntries(entries),
            entry,
          ]);

          webpackPlugins?.hook(async (plugins) => {
            const {default: WebpackVirtualModules} = await import(
              'webpack-virtual-modules'
            );

            const source = await quiltBrowserEntryContent!.run(`
              import {${reactFunction}} from 'react-dom';
              import App from ${JSON.stringify(MAGIC_MODULE_APP_COMPONENT)};

              ${reactFunction}(<App />, document.getElementById('app'));
            `);

            return [
              ...plugins,
              new WebpackVirtualModules({
                [entry]: source,
              }),
            ];
          });
        };
      }

      const addSourceHooks = addHooks<CustomHooks>(() => ({
        quiltBrowserEntryContent: new WaterfallHook(),
      }));

      tasks.build.hook(({hooks}) => {
        hooks.configureHooks.hook(addSourceHooks);

        hooks.target.hook(({target, hooks}) => {
          if (target.options.quiltAutoServer) return;
          if (!include({target, task: Task.Build})) return;

          hooks.configure.hook(addConfiguration(Task.Build, target));
        });
      });

      // eslint-disable-next-line no-warning-comments
      // TODO: dev needs targets too!
      tasks.dev.hook(({hooks}) => {
        hooks.configureHooks.hook(addSourceHooks);

        if (!include({task: Task.Dev})) return;

        hooks.configure.hook(addConfiguration(Task.Dev));
      });
    },
  );
}
