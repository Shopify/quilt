import {createProjectPlugin} from '@sewing-kit/plugins';
import type {} from '@sewing-kit/plugin-jest';
import type {} from '@sewing-kit/plugin-webpack';

export function preactAliases() {
  return createProjectPlugin(
    'Quilt.PreactAliases',
    ({tasks: {test, build, dev}}) => {
      const updateWebpackAliases = (aliases: Record<string, string>) => {
        const newAliases = {
          ...aliases,
          react$: '@quilted/preact-mini-compat',
          'react-dom$': '@quilted/preact-mini-compat',
          'react-dom/server$': 'preact/compat/server',
          'react/jsx-runtime$': 'preact/jsx-runtime',
          'preact/jsx-dev-runtime$': 'preact/jsx-runtime',
        };

        delete (newAliases as any).react;
        delete (newAliases as any)['react-dom'];

        return newAliases;
      };

      build.hook(({hooks}) => {
        hooks.target.hook(({hooks}) => {
          hooks.configure.hook(({webpackAliases}) => {
            webpackAliases?.hook(updateWebpackAliases);
          });
        });
      });

      dev.hook(({hooks}) => {
        hooks.configure.hook(({webpackAliases}) => {
          webpackAliases?.hook(updateWebpackAliases);
        });
      });

      test.hook(({hooks}) => {
        hooks.configure.hook(({jestModuleMapper}) => {
          jestModuleMapper?.hook((moduleMapper) => ({
            ...moduleMapper,
            '^react$': '@quilted/preact-mini-compat',
            '^react/jsx-runtime$': 'preact/jsx-runtime',
            '^@quilted/react-testing$': '@quilted/react-testing/preact',
            '^@quilted/react-testing/dom$': '@quilted/react-testing/preact',
          }));
        });
      });
    },
  );
}
