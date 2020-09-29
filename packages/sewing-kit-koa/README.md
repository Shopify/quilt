# `@shopify/sewing-kit-koa`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa.svg)](https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa.svg)

Easily access [sewing-kit](https://github.com/Shopify/sewing-kit) assets from a Koa server.

## Installation

```bash
$ yarn add @shopify/sewing-kit-koa
```

## Usage

Add the supplied `middleware` to your Koa application. This is usually done near the start of your app so that all subsequent middleware can make use of sewing-kit-related information:

```ts
import Koa from 'koa';
import {middleware} from '@shopify/sewing-kit-koa';

const app = new Koa();
app.use(middleware());
```

In subsequent middleware, you can now use `getAssets()`, which return an object with `style` and `script` methods for fetching asset paths asynchronously:

```ts
import {getAssets} from '@shopify/sewing-kit-koa';

app.use(async ctx => {
  const assets = getAssets(ctx);
  // Both `styles` and `scripts` return a Promise for an array of objects.
  // Each object has a `path` for its resolved URL, and an optional `integrity`
  // field for its integrity SHA. You can pass these arrays as-is into
  // the `Html` component from @shopify/react-html.
  const styles = (await assets.styles()).map(({path}) => path);
  const scripts = (await assets.scripts()).map(({path}) => path);

  ctx.body = `You need the following assets: ${[...styles, ...scripts].join(
    ', ',
  )}`;
});
```

By default, the styles and scripts of the main bundle will be returned to you. This is the default bundle sewing-kit creates, or the one you have specifically named `main`. You can optionally pass a custom name to retrieve only the assets for that bundle (which would match to the name you gave it when using [sewing-kit’s entry plugin](https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/entry.md)):

```ts
// In your sewing-kit.config.ts...
import {Plugins} from '@shopify/sewing-kit';

export default function sewingKitConfig(plugins: Plugins) {
  return {
    plugins: [
      plugins.entry({
        main: __dirname + '/client',
        error: __dirname + '/client/error',
      }),
    ],
  };
}
```

```ts
// In your server...
import {getAssets} from '@shopify/sewing-kit-koa';

app.use(async ctx => {
  const assets = getAssets(ctx);

  const styles = (await assets.styles({name: 'error'})).map(({path}) => path);
  const scripts = (await assets.scripts({name: 'error'})).map(({path}) => path);

  ctx.body = `Error page needs the following assets: ${[
    ...styles,
    ...scripts,
  ].join(', ')}`;
});
```

You can also pass an optional `asyncAssets` to either the `scripts()` or `styles()` methods. This argument should be an iterable of strings IDs, regular expressions, or selectors (objects with an `id` field, and boolean `scripts`/ `styles` fields to select only a subset of assets). The middleware will then collect every async bundle and its dependencies that matches the IDs you passed in the iterable, and insert them into the returned set of bundles (**note:** requires at least `sewing-kit@73.0.0`). This process is easiest when using the `AsyncAssetManager` from [`@shopify/react-async`](../react-async):

```ts
import {AsyncAssetManager} from '@shopify/react-async';
import {getAssets} from '@shopify/sewing-kit-koa';

app.use(async ctx => {
  const assets = getAssets(ctx);
  const asyncAssetManager = new AsyncAssetManager();

  /* render app */

  const styles = await assets.styles({asyncAssets: asyncAssetManager.used});
  const scripts = await assets.scripts({
    asyncAssets: asyncAssetManager.used,
  });
});
```

For more advanced use cases, you can pick out specific async assets with the `assets()` and `asyncAssets()` methods.

### GraphQL

Starting in version 3.3 of this library (and the associated 82.0 release of sewing-kit), the `ctx.state.assets` object also has a `graphQLSource` method, which allows you to access the full source for a GraphQL document based on its ID. This is useful for doing "persisted" GraphQL queries. However, if you use [`@shopify/graphql-persisted`](../graphql-persisted), it will automatically use this feature without you needing to think about it, so calling this method directly is generally not necessary.

### Options

The middleware accepts some optional parameters that you can use to customize how sewing-kit-generated assets will be served:

- `assetPrefix`: the path prefix to use for all assets. This is used primary to decide where to mount a static file server if `serveAssets` is true (see next section for details). If not provided, `assetPrefix` will default to sewing-kit’s default development asset server URL. If you set a [custom CDN](https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/cdn.md) in your sewing-kit config, you should pass that same value to this option.

- `serveAssets`: whether this middleware should also serve assets from within your application server. This can be useful when running the application locally, but attempting to replicate more of a production environment (and, therefore, would not be able to use the true production CDN). When this option is passed, `assetPrefix` must be passed with a path that can be safely mounted to for your server (this same path should be used as the custom CDN for sewing-kit so that the paths sewing-kit generates make sense). The middleware will then take over that endpoint for asset serving:

  ```ts
  // In sewing-kit.config.ts...
  // In this example, we want our application to serve assets only when we pass an
  // environment variable that indicates we are performing an end-to-end test.

  import {Plugins} from '@shopify/sewing-kit';

  export default function sewingKitConfig(plugins: Plugins) {
    const plugins = process.env.E2E ? [plugins.cdn('/e2e-assets/')] : [];

    return {plugins};
  }
  ```

  ```ts
  // In your server...

  app.use(
    middleware({
      serveAssets: true,
      assetPrefix: '/e2e-assets/',
    }),
  );
  ```
