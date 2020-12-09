# `@shopify/magic-entries-webpack-plugin`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=master)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fmagic-entries-webpack-plugin.svg)](https://badge.fury.io/js/%40shopify%2Fmagic-entries-webpack-plugin.svg)

A webpack plugin which automatically sets up webpack entrypoints using filename conventions.

## Installation

```bash
$ yarn add @shopify/magic-entries-webpack-plugin
```

## Motivation

Setting up entrypoints in webpack works well enough, but large applications, repos containing multiple logical sub-applications, or tools and meta-frameworks attempting to automate front end tooling may want to be able to automate it.

When to use this:

- Your projects has developed highly complex webpack configurations that are maintained by a small portion of the team and fully understood by fewer.
- Your project frequently adds/removes/changes entrypoint configuration.
- Your project is a tool or metaframework attempting to automate configuration of webpack.
- Your project is large enough or has enough entrypoints that it is difficult to tell what files are an entrypoint and what files are regular old modules

When not to use this:

- Your build tool or metaframework already does something like this for you
- Your app is small and only has a single entrypoint anyway
- Your app rarely needs to add, remove, or change entrypoints
- Your team tend to all be comfortable editing webpack configurations and your app is simple enough that it is low risk to do so

## Usage

### Default behaviour

The default behaviour of the plugin is to populate the `entry` option of your webpack config with an entry for every file in the root of your project that matches the glob `*.entry.server.{jsx,js,ts,tsx}`. Thus a file named `main.entry.js` would be picked up as the `main` entrypoint. This behaviour can be configured via the [options](#options) object passed to the plugin.

### Quick-start

To setup the plugin first import it into your webpack config

```js
import {MagicEntriesPlugin} from '@shopify/magic-entries-plugin';
```

and then pass an instance of it to the plugin array.

```js
plugins: [new MagicEntriesPlugin()],
```

### Example

A minimal webpack config with the default settings of the plugin might look like:

```javascript
// webpack.config.js
// this webpack config is just an example, it's not meant to be production ready or anything
const MagicEntriesPlugin = require('@shopify/magic-entries-webpack-plugin');

exports = {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  output: {
    filename: '[name].js',
  },
  plugins: [new MagicEntriesPlugin()],
};
```

### Server and client presets

Some universal applications (such as react applications using server-side-rendering) may need to have a different set of entrypoints for the client and server environments.

To provide for this common usecase, the plugin comes with presets for client and server accessible via the `.client` and `.server` static methods.

```js
// the same as the default behaviour except it looks for files matching '*.entry.server.{jsx,js,ts,tsx}'
plugins: [new MagicEntriesPlugin.server()],
```

```js
// the same as the default behaviour except it looks for files matching '*.entry.client.{jsx,js,ts,tsx}'
plugins: [new MagicEntriesPlugin.client()],
```

Using these in the appropriate webpack builds allows convention based entrypoints in both cases without accidentally compiling your client code on the server or vice-versa.

### Customization

By default this plugin has opinions about how entrypoints should look (specifically ending in `.entry.{js,ts}` and in the root of the application). If a different convention is better suited to your codebase it also accepts a configuration object with the following interface:

```tsx
interface Options {
  // The pattern passed to `glob` to find all the entrypoints
  // default: '*.entry.{jsx,js,ts,tsx}'
  pattern: string;
  // the folder or folders to run the glob in (relative to the webpack context)
  // default: '.'
  folder: string | string[];
  // how to derive the name of the entrypoint from it's file path
  // default: the file's basename stripped of it's extensions
  nameFromFile: (file: string) => string;
}
```

#### Example

In this example the plugin is configured to use all js files in the `/entrypoints` folder as entrypoints.

```ts
new MagicEntriesPlugin({pattern: '*.js', folder: 'entrypoints'});
```
