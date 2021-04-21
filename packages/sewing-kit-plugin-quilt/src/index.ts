import {
  Package,
  WebApp,
  createComposedWorkspacePlugin,
  createComposedProjectPlugin,
  Task,
} from '@sewing-kit/plugins';
import {flexibleOutputs} from '@sewing-kit/plugin-package-flexible-outputs';
import {webpackHooks, webpackBuild} from '@sewing-kit/plugin-webpack';
import {webpackDevWebApp} from '@sewing-kit/plugin-web-app-base';
import {eslint} from '@sewing-kit/plugin-eslint';
import {javascript} from '@sewing-kit/plugin-javascript';
import {typescript, workspaceTypeScript} from '@sewing-kit/plugin-typescript';
import {css} from '@sewing-kit/plugin-css';
import {stylelint} from '@sewing-kit/plugin-stylelint';
import {react} from '@sewing-kit/plugin-react';
import {jest} from '@sewing-kit/plugin-jest';
import {graphql, workspaceGraphQL} from '@sewing-kit/plugin-graphql';
import type {ExportStyle} from '@sewing-kit/plugin-graphql';

import {cdn} from './cdn';
import {reactJsxRuntime} from './react-jsx';
import {webAppAutoServer} from './web-app-auto-server';
import {webAppBrowserEntry} from './web-app-browser-entry';
import {webAppMagicModules} from './web-app-magic-modules';
import {webAppMultiBuilds} from './web-app-multi-build';
import {webAppConvenienceAliases} from './web-app-convenience-aliases';

// eslint-disable-next-line prettier/prettier
export type {} from './web-app-auto-server';

export {
  MAGIC_MODULE_APP_COMPONENT,
  MAGIC_MODULE_APP_AUTO_SERVER_ASSETS,
} from './constants';

export interface QuiltPackageOptions {
  readonly react?: boolean;
  readonly css?: boolean;
}

export function quiltPackage({
  react: useReact = true,
  css: useCss = false,
}: QuiltPackageOptions = {}) {
  return createComposedProjectPlugin<Package>('Quilt.Package', [
    javascript(),
    typescript(),
    useReact && react(),
    useReact && reactJsxRuntime(),
    useCss && css(),
  ]);
}

export interface QuiltWebAppOptions {
  readonly autoServer?:
    | boolean
    | NonNullable<Parameters<typeof webAppAutoServer>[0]>;
  readonly cdn?: string;
  readonly assetServer?: NonNullable<
    Parameters<typeof webpackDevWebApp>[0]
  >['assetServer'];
  readonly graphql?: {
    readonly export?: ExportStyle;
  };
  readonly browserGroups?: NonNullable<
    Parameters<typeof webAppMultiBuilds>[0]
  >['browserGroups'];
}

export function quiltWebApp({
  assetServer,
  autoServer = false,
  cdn: cdnUrl,
  graphql: {export: exportStyle = 'simple'} = {},
  browserGroups,
}: QuiltWebAppOptions = {}) {
  return createComposedProjectPlugin<WebApp>('Quilt.WebApp', composer => {
    composer.use(
      javascript(),
      typescript(),
      css(),
      webpackHooks(),
      webAppMultiBuilds({babel: true, postcss: true, browserGroups}),
      webpackDevWebApp({assetServer}),
      webpackBuild(),
      flexibleOutputs(),
      react(),
      reactJsxRuntime(),
      graphql({export: exportStyle}),
      webAppConvenienceAliases(),
      webAppMagicModules(),
      webAppBrowserEntry({hydrate: ({task}) => task !== Task.Dev}),
      autoServer &&
        webAppAutoServer(typeof autoServer === 'object' ? autoServer : {}),
      cdnUrl ? cdn({url: cdnUrl}) : false,
    );
  });
}

export interface QuiltWorkspaceOptions {
  readonly css?: boolean;
  readonly graphql?: boolean;
  readonly stylelint?: boolean | Parameters<typeof stylelint>[0];
}

export function quiltWorkspace({
  css = true,
  stylelint: stylelintOptions = css,
}: QuiltWorkspaceOptions = {}) {
  return createComposedWorkspacePlugin('Quilt.Workspace', composer => {
    composer.use(jest(), eslint(), workspaceTypeScript(), workspaceGraphQL());

    if (stylelintOptions) {
      composer.use(
        stylelint(
          typeof stylelintOptions === 'boolean' ? undefined : stylelintOptions,
        ),
      );
    }
  });
}
