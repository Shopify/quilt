import React from 'react';
import {Context} from 'koa';
import {
  Html,
  HtmlManager,
  HtmlContext,
  stream,
} from '@shopify/react-html/server';
import {
  applyToContext,
  NetworkContext,
  NetworkManager,
} from '@shopify/react-network/server';
import {ArgumentAtIndex} from '@shopify/useful-types';
import {extract} from '@shopify/react-effect/server';
import {HydrationContext, HydrationManager} from '@shopify/react-hydrate';
import {
  AsyncAssetContext,
  AsyncAssetManager,
  AssetTiming,
} from '@shopify/react-async';
import {Header, StatusCode} from '@shopify/react-network';
import {getAssets} from '@shopify/sewing-kit-koa';
import {getLogger} from '../logger';

export {Context};
export interface RenderFunction {
  (ctx: Context): React.ReactElement<any>;
}

type Options = Pick<
  NonNullable<ArgumentAtIndex<typeof extract, 1>>,
  'afterEachPass' | 'betweenEachPass'
>;

/**
 * Creates a Koa middleware for rendering an `@shopify/react-html` based React application defined by `options.render`.
 * @param render
 */
export function createRender(render: RenderFunction, options: Options = {}) {
  return async function renderFunction(ctx: Context) {
    const logger = getLogger(ctx) || console;
    const assets = getAssets(ctx);

    const networkManager = new NetworkManager({
      headers: ctx.headers,
      cookies: ctx.request.headers.cookie || '',
    });
    const htmlManager = new HtmlManager();
    const asyncAssetManager = new AsyncAssetManager();
    const hydrationManager = new HydrationManager();

    function Providers({children}: {children: React.ReactElement<any>}) {
      return (
        <AsyncAssetContext.Provider value={asyncAssetManager}>
          <HydrationContext.Provider value={hydrationManager}>
            <NetworkContext.Provider value={networkManager}>
              {children}
            </NetworkContext.Provider>
          </HydrationContext.Provider>
        </AsyncAssetContext.Provider>
      );
    }

    try {
      const app = render(ctx);
      await extract(app, {
        decorate(element) {
          return (
            <HtmlContext.Provider value={htmlManager}>
              <Providers>{element}</Providers>
            </HtmlContext.Provider>
          );
        },
        afterEachPass({renderDuration, resolveDuration, index, finished}) {
          const pass = `Pass number ${index} ${
            finished ? ' (this was the final pass)' : ''
          }`;
          const rendering = `Rendering took ${renderDuration}ms`;
          const resolving = `Resolving promises took ${resolveDuration}ms`;

          logger.log(pass);
          logger.log(rendering);
          logger.log(resolving);
        },
        ...options,
      });
      applyToContext(ctx, networkManager);

      const immediateAsyncAssets = asyncAssetManager.used(
        AssetTiming.Immediate,
      );
      const [styles, scripts] = await Promise.all([
        assets.styles({name: 'main', asyncAssets: immediateAsyncAssets}),
        assets.scripts({name: 'main', asyncAssets: immediateAsyncAssets}),
      ]);

      const response = stream(
        <Html manager={htmlManager} styles={styles} scripts={scripts}>
          <Providers>{app}</Providers>
        </Html>,
      );

      ctx.set(Header.ContentType, 'text/html');
      ctx.body = response;
    } catch (error) {
      const errorMessage = `React server-side rendering error:\n${error.stack ||
        error.message}`;

      logger.log(errorMessage);
      ctx.status = StatusCode.InternalServerError;

      // eslint-disable-next-line no-process-env
      if (process.env.NODE_ENV === 'development') {
        ctx.body = errorMessage;
      } else {
        ctx.throw(StatusCode.InternalServerError, error);
      }
    }
  };
}
