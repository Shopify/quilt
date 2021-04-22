import {createProjectPlugin, WebApp, Service} from '@sewing-kit/plugins';
import type {} from '@sewing-kit/plugin-webpack';

interface Options {
  readonly url: string;
}

export function cdn({url}: Options) {
  return createProjectPlugin<WebApp | Service>(
    'Quilt.CDN',
    ({tasks: {build}}) => {
      build.hook(({hooks}) => {
        hooks.target.hook(({hooks}) => {
          hooks.configure.hook(({webpackPublicPath}) => {
            webpackPublicPath?.hook(() => url);
          });
        });
      });
    },
  );
}
