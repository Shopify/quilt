import {createProjectPlugin, Runtime, TargetRuntime} from '@sewing-kit/plugins';
import type {WebApp, Service} from '@sewing-kit/plugins';
import type {BuildWebAppConfigurationHooks} from '@sewing-kit/hooks';
import {mappedPolyfillsForEnv} from '@quilted/polyfills';
import {updateSewingKitBabelPreset} from '@sewing-kit/plugin-javascript';
import type {} from '@sewing-kit/plugin-webpack';
import type {} from '@sewing-kit/plugin-jest';

import type {} from './web-app-multi-build';

import type {PolyfillFeature} from './types';

export function polyfills({features}: {features?: PolyfillFeature[]} = {}) {
  return createProjectPlugin<WebApp | Service>(
    'Quilt.Polyfills',
    ({tasks, project}) => {
      tasks.build.hook(({hooks}) => {
        hooks.target.hook(({target, hooks}) => {
          hooks.configure.hook((configuration) => {
            if (features) {
              configuration.webpackEntries?.hook((entries) => [
                ...features.map(
                  (feature) => `@quilted/polyfills/${feature}`,
                  ...entries,
                ),
              ]);
            }

            configuration.babelConfig?.hook(
              updateSewingKitBabelPreset({polyfill: 'usage'}),
            );

            configuration.webpackAliases?.hook(async (aliases) => {
              let environment: string | string[] | undefined;

              if (target.runtime.includes(Runtime.Node)) {
                environment = 'node';
              } else if ('quiltBrowserslist' in configuration) {
                environment = await (configuration as BuildWebAppConfigurationHooks).quiltBrowserslist!.run(
                  undefined,
                );
              }

              const mappedPolyfills = mappedPolyfillsForEnv({
                target: environment as any,
                polyfill: 'usage',
              });

              return {...aliases, ...mappedPolyfills};
            });
          });
        });
      });

      tasks.dev.hook(({hooks}) => {
        hooks.configure.hook((configuration: BuildWebAppConfigurationHooks) => {
          if (features) {
            configuration.webpackEntries?.hook((entries) => [
              ...features.map(
                (feature) => `@quilted/polyfills/${feature}`,
                ...entries,
              ),
            ]);
          }

          configuration.babelConfig?.hook(
            updateSewingKitBabelPreset({polyfill: 'usage'}),
          );

          configuration.webpackAliases?.hook(async (aliases) => {
            let environment: string | string[] | undefined;

            if (TargetRuntime.fromProject(project).includes(Runtime.Node)) {
              environment = 'node';
            } else if ('quiltBrowserslist' in configuration) {
              environment = await (configuration as BuildWebAppConfigurationHooks).quiltBrowserslist!.run(
                undefined,
              );
            }

            const mappedPolyfills = mappedPolyfillsForEnv({
              target: environment as any,
              polyfill: 'usage',
            });

            return {...aliases, ...mappedPolyfills};
          });
        });
      });

      tasks.test.hook(({hooks}) => {
        hooks.configure.hook(({jestModuleMapper}) => {
          jestModuleMapper?.hook((moduleMap) => {
            return {
              ...moduleMap,
              ...mappedPolyfillsForEnv({target: 'node', polyfill: 'usage'}),
            };
          });
        });
      });
    },
  );
}
