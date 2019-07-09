import React from 'react';
import {Context} from 'koa';
import ApolloClient from 'apollo-client';
import {renderToString} from 'react-dom/server';
import {
  Html,
  HtmlManager,
  HtmlContext,
  Serialize,
} from '@shopify/react-html/server';
import {
  applyToContext,
  NetworkContext,
  NetworkManager,
} from '@shopify/react-network/server';
import {createApolloBridge} from '@shopify/react-effect-apollo';
import {extract} from '@shopify/react-effect/server';
import {AsyncAssetContext, AsyncAssetManager} from '@shopify/react-async';
import {Omit} from '@shopify/useful-types';
import {Header} from '@shopify/react-network';
import {getAssets} from '@shopify/sewing-kit-koa';
import {createGraphQLClient, GraphQLClientOptions} from '../graphql-client';
import {getLogger} from '../logger';

export type RenderContext = Context & {
  graphQLClientOptions?: GraphQLClientOptions;
  graphQLClient?: ApolloClient<{}>;
};

export interface CreateRenderOptions {
  render: (ctx: RenderContext) => React.ReactElement<any>;
  graphQLClientOptions?: Omit<GraphQLClientOptions, 'host'>;
}

export function createRender(options: CreateRenderOptions) {
  const {render, graphQLClientOptions} = options;

  return async function renderFunction(ctx: RenderContext) {
    const logger = getLogger(ctx);
    const assets = getAssets(ctx);
    const networkManager = new NetworkManager();
    const htmlManager = new HtmlManager();
    const graphQLClient =
      graphQLClientOptions &&
      createGraphQLClient({host: ctx.host, ...graphQLClientOptions});
    const ApolloBridge = createApolloBridge();
    const asyncAssetManager = new AsyncAssetManager();
    const app = render({...ctx, graphQLClientOptions, graphQLClient});

    try {
      await extract(app, {
        decorate(app) {
          return (
            <HtmlContext.Provider value={htmlManager}>
              <AsyncAssetContext.Provider value={asyncAssetManager}>
                <NetworkContext.Provider value={networkManager}>
                  <ApolloBridge>{app}</ApolloBridge>
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
    console.log(assets);

    const [styles, scripts] = await Promise.all([
      assets.styles(),
      assets.scripts(),
    ]);

    console.log(styles, scripts);
    const serializedInitialApolloData = graphQLClient ? (
      <Serialize
        id="initial-apollo-data"
        data={graphQLClient.cache.extract()}
      />
    ) : null;

    const response = renderToString(
      <Html
        manager={htmlManager}
        bodyMarkup={<>{serializedInitialApolloData}</>}
        styles={styles}
        scripts={scripts}
      >
        <ApolloBridge>{app}</ApolloBridge>
      </Html>,
    );

    ctx.set(Header.ContentType, 'text/html');
    ctx.body = response;

    return response;
  };
}
