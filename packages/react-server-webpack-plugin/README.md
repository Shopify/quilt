# `@shopify/react-server-webpack-plugin`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-server-webpack-plugin.svg)](https://badge.fury.io/js/%40shopify%2Freact-server-webpack-plugin.svg)

A webpack plugin which generates "virtual" in-memory entrypoints for `@shopify/react-server` based applications. This plugin allows you to run a universal React application without needing any client/server-specific code.

## Installation

```bash
$ yarn add @shopify/react-server-webpack-plugin
```

## Usage

### With Sewing Kit and Rails

To add this to your existing `sewing_kit` project import it into your `sewing-kit.config.ts` and add it to your `plugins` array inside the `webpack` plugin.

#### Example sewing-kit config

```tsx
import {Plugins} from '@shopify/sewing-kit';
import {ReactServerPlugin} from '@shopify/react-server-webpack-plugin';

module.exports = function sewingKitConfig(plugins: Plugins, env: Env) {
  return {
    name: 'your-app-name',
    plugins: [
      plugins.devServer({
        ip,
        port,
      }),
      plugins.webpack((config: any) => {
        config.plugins.push(
          new ReactServerPlugin({
            assetPrefix: process.env.CDN_URL || 'https://localhost:8080/webpack/assets/';
          });
        );
      }),
    ],
  };
};
```

In the future `@shopify/sewing-kit` will automatically configure this package for you if you are using `@shopify/react-server`.

### Without Sewing-Kit

First you will need to install all of the dependencies you'll need for your application

```sh
yarn add react react-dom
yarn add webpack @shopify/react-server @shopify/react-server-webpack-plugin @shopify/webpack-asset-metadata-plugin --dev
```

Since `@shopify/react-server` relies on `@shopify/webpack-asset-metadata-plugin`, you will need to setup both plugins in your webpack configuration. A simple starter (not production optimized) webpack setup is as follows:

```tsx
// webpack.config.js

const {ReactServerPlugin} = require('@shopify/react-server-webpack-plugin');
const {AssetMetadataPlugin} = require('@shopify/webpack-asset-metadata-plugin');

const universal = {
  mode: 'development',
  optimization: {
    minimize: false,
  },
  plugins: [new AssetMetadataPlugin(), new ReactServerPlugin()],
};

const server = {
  ...universal,
  name: 'server',
  target: 'node',
  entry: './server',
  externals: [
    (context, request, callback) => {
      if (/node_modules/.test(context)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
  ],
};

const client = {
  ...universal,
  name: 'client',
  target: 'web',
  entry: './client',
};

module.exports = [server, client];
```

By default, this plugin expects the entrypoint to your application to be in the root directory.

```jsx
// index.jsx
import React from 'react';

export default function App() {
  return <div>I am an app</div>;
}
```

Next you can run `webpack && node dist/server.js`. When the server starts up you should see:

```sh
started react-server on localhost:PORT
```

If you point your browser at `localhost:PORT` you should see "I am an app". :)

### API

The plugin is exported as a named export.

```tsx
import {ReactServerPlugin} from '@shopify/react-server-webpack-plugin';
```

It accepts a configuration object with the following interface:

```tsx
interface Options {
  /*
   The base-path to use for the `client.js` and `server.js` virtual entry files,
   this should also be where your index.tsx/jsx is.

   default: '.'
  */

  basePath: string;

  /*
   The host to use when calling `createServer` from `@shopify/react-server`,
   this should also be where your index.tsx/jsx is.

   default: process.env.REACT_SERVER_IP || "localhost"
  */
  host: string;

  /*
    The port to use when calling `createServer` from `@shopify/react-server`

    default: process.env.REACT_SERVER_PORT || 8081
  */
  port: number;

  /*
   The assetPrefix to use when calling `createServer` from `@shopify/react-server`.

   default: process.env.CDN_URL || "localhost:8080/assets/webpack"
  */
  assetPrefix: string;
}
```

An example configuration for a `sewing-kit` app named `cool-app` might look like this:

```tsx
new ReactServerPlugin({
  assetPrefix: process.env.CDN_URL || 'https://localhost:8080/webpack/assets/';
});
```
