# `@shopify/sewing-kit-koa`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa.svg)](https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa.svg)

Easily access [sewing kit](https://github.com/Shopify/sewing-kit) assets from a Koa server.

## Installation

```bash
$ yarn add @shopify/sewing-kit-koa
```

## Usage

Add the supplied `middleware` to your Koa application. This is usually done near the start of your app so that all subsequent middleware can make use of Sewing Kit-related information:

```ts
import Koa from 'koa';
import {middleware} from '@shopify/sewing-kit-koa';

const app = new Koa();
app.use(middleware());
```

In subsequent middleware, you can now reference `ctx.state.assets`, which has `style` and `script` methods for fetching asset paths asynchronously:

```ts
app.use(async ctx => {
  // Both `styles` and `scripts` return a Promise for an array of objects.
  // Each object has a `path` for its resolved URL, and an optional `integrity`
  // field for its integrity SHA. You can pass these arrays as-is into
  // the `Html` component from @shopify/react-html.
  const styles = (await ctx.assets.styles()).map(({path}) => path);
  const scripts = (await ctx.assets.scripts()).map(({path}) => path);

  ctx.body = `You need the following assets: ${[...styles, ...scripts].join(
    ', ',
  )}`;
});
```

By default, the styles and scripts of the main bundle will be returned to you. This is the default bundle sewing kit creates, or the one you have specifically named `main`. You can optionally pass a custom name to retrieve only the assets for that bundle (which would match to the name you gave it when using [sewing kit’s entry plugin](https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/entry.md)):

```ts
// In your sewing-kit.config.ts...

module.exports = function sewingKitConfig(plugins) {
  return {
    plugins: [
      plugins.entry({
        main: __dirname + '/client',
        error: __dirname + '/client/error',
      }),
    ],
  };
};
```

```ts
// In your server...

app.use(async ctx => {
  const styles = (await ctx.assets.styles({name: 'error'})).map(
    ({path}) => path,
  );
  const scripts = (await ctx.assets.scripts({name: 'error'})).map(
    ({path}) => path,
  );

  ctx.body = `Error page needs the following assets: ${[
    ...styles,
    ...scripts,
  ].join(', ')}`;
});
```

### Options

The middleware accepts some optional parameters that you can use to customize how sewing kit-generated assets will be served:

- `assetPrefix`: the path prefix to use for all assets. This is used primary to decide where to mount a static file server if `serveAssets` is true (see next section for details). If not provided, `assetPrefix` will default to sewing kit’s default development asset server URL. If you set a [custom CDN](https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/cdn.md) in your sewing kit config, you should pass that same value to this option.

- `serveAssets`: whether this middleware should also serve assets from within your application server. This can be useful when running the application locally, but attempting to replicate more of a production environment (and, therefore, would not be able to use the true production CDN). When this option is passed, `assetPrefix` must be passed with a path that can be safely mounted to for your server (this same path should be used as the custom CDN for sewing kit so that the paths sewing kit generates make sense). The middleware will then take over that endpoint for asset serving:

  ```ts
  // In sewing-kit.config.ts...
  // In this example, we want our application to serve assets only when we pass an
  // environment variable that indicates we are performing an end-to-end test.

  module.exports = function sewingKitConfig(plugins) {
    const plugins = process.env.E2E ? [plugins.cdn('/e2e-assets/')] : [];

    return {plugins};
  };
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
