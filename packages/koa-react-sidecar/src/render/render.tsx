import React from 'react';
import {Context} from 'koa';
import {renderToString} from 'react-dom/server';
import {Html, HtmlManager, HtmlContext} from '@shopify/react-html/server';
import {
  applyToContext,
  NetworkContext,
  NetworkManager,
} from '@shopify/react-network/server';
import {extract} from '@shopify/react-effect/server';
import {AsyncAssetContext, AsyncAssetManager} from '@shopify/react-async';
import {Header} from '@shopify/react-network';
import {getAssets} from '@shopify/sewing-kit-koa';
import {getLogger} from '../logger';

export type RenderContext = Context;

export interface CreateRenderOptions {
  render: (ctx: RenderContext) => React.ReactElement<any>;
}

export function createRender(options: CreateRenderOptions) {
  const {render} = options;

  return async function renderFunction(ctx: RenderContext) {
    const logger = getLogger(ctx);
    const assets = getAssets(ctx);
    const networkManager = new NetworkManager();
    const htmlManager = new HtmlManager();
    const asyncAssetManager = new AsyncAssetManager();
    const app = render(ctx);

    try {
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
          const rendering = `Rendering ${renderDuration}ms`;
          const resolving = `Resolving ${resolveDuration}ms`;

          logger.log(pass);
          logger.log(rendering);
          logger.log(resolving);
        },
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }

    applyToContext(ctx, networkManager);

    const [styles, scripts] = await Promise.all([
      assets.styles(),
      assets.scripts(),
    ]);

    const response = renderToString(
      <Html manager={htmlManager} styles={styles} scripts={scripts}>
        {app}
      </Html>,
    );

    ctx.set(Header.ContentType, 'text/html');
    ctx.body = response;

    return response;
  };
}
