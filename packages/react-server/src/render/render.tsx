import React from 'react';
import {Context} from 'koa';
import {
  Html,
  HtmlManager,
  HtmlContext,
  render as renderMarkup,
} from '@shopify/react-html/server';
import {
  applyToContext,
  NetworkContext,
  NetworkManager,
} from '@shopify/react-network/server';
import {extract} from '@shopify/react-effect/server';
import {
  AsyncAssetContext,
  AsyncAssetManager,
  AssetTiming,
} from '@shopify/react-async';
import {Header, StatusCode} from '@shopify/react-network';
import {getAssets} from '@shopify/sewing-kit-koa';
import {getLogger} from '../logger';

export type RenderContext = Context & {
  locale: string;
};
export type RenderFunction = (ctx: RenderContext) => React.ReactElement<any>;

/**
 * Creates a Koa middleware for rendering an `@shopify/react-html` based React application defined by `options.render`.
 * @param render
 */
export function createRender(render: RenderFunction) {
  return async function renderFunction(ctx: RenderContext) {
    const logger = getLogger(ctx) || console;
    const assets = getAssets(ctx);
    const networkManager = new NetworkManager({
      headers: ctx.headers,
    });
    const htmlManager = new HtmlManager();
    const asyncAssetManager = new AsyncAssetManager();
    const acceptsLanguages = ctx.acceptsLanguages && ctx.acceptsLanguages();
    const locale = Array.isArray(acceptsLanguages) ? acceptsLanguages[0] : 'en';

    try {
      const app = render({...ctx, locale});
      await extract(app, {
        decorate(app) {
          return (
            <HtmlContext.Provider value={htmlManager}>
              <AsyncAssetContext.Provider value={asyncAssetManager}>
                <NetworkContext.Provider value={networkManager}>
                  {app}
                </NetworkContext.Provider>
              </AsyncAssetContext.Provider>
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
      });
      applyToContext(ctx, networkManager);

      const immediateAsyncAssets = asyncAssetManager.used(
        AssetTiming.Immediate,
      );
      const [styles, scripts] = await Promise.all([
        assets.styles({name: 'main', asyncAssets: immediateAsyncAssets}),
        assets.scripts({name: 'main', asyncAssets: immediateAsyncAssets}),
      ]);

      const response = renderMarkup(
        <Html
          locale={locale}
          manager={htmlManager}
          styles={styles}
          scripts={scripts}
        >
          <HtmlContext.Provider value={htmlManager}>{app}</HtmlContext.Provider>
        </Html>,
      );

      ctx.set(Header.ContentType, 'text/html');
      ctx.body = response;
    } catch (error) {
      logger.error(error);
      // eslint-disable-next-line no-process-env
      if (process.env.NODE_ENV === 'development') {
        ctx.body = `Internal Server Error: \n\n${error.message}`;
      } else {
        ctx.throw(StatusCode.InternalServerError, error);
      }
    }
  };
}
