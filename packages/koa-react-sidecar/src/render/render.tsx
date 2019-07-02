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
import {Header} from '@shopify/react-network';

export type RenderContext = Context & {};

const logger = console;

export function createRender(
  renderFunction: (ctx: RenderContext) => React.ReactElement<any>,
) {
  return async function render(ctx: RenderContext) {
    const app = renderFunction(ctx);
    const networkManager = new NetworkManager();
    const htmlManager = new HtmlManager();

    try {
      await extract(app, {
        decorate(app) {
          return (
            <NetworkContext.Provider value={networkManager}>
              <HtmlContext.Provider value={htmlManager}>
                {app}
              </HtmlContext.Provider>
            </NetworkContext.Provider>
          );
        },
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }

    applyToContext(ctx, networkManager);
    const response = renderToString(<Html manager={htmlManager}>{app}</Html>);

    ctx.set(Header.ContentType, 'text/html');
    ctx.body = response;

    return response;
  };
}
