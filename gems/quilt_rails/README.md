# quilt_rails

A turn-key solution for integrating server-rendered react into your Rails app using Quilt libraries.

This document focuses on Rails integration. For details of `@shopify/react-server`'s configuration and usage, see the [react-server documentation](/packages/react-server/README.md).

## Table of Contents

1. [Quick Start](#quick-start)
1. [Advanced Use](#advanced-use)

## Quick Start

### Add Ruby dependencies

`bundle add sewing_kit quilt_rails`

First, create a Rails project using `dev init`. Next, run `rails generate quilt:install`. This will install the Node dependencies, provide a basic React app (in TypeScript) and mounts the Quilt engine inside of your `config/routes.rb` file.

## Manual Installation

You can also perform the steps within the rake task manually by following the guide below.

### Install Dependencies

```sh
# Add Node dependencies
yarn add @shopify/sewing-kit @shopify/react-server

# Optional - add Polaris and quilt libraries
yarn add @shopify/polaris @shopify/react-self-serializers react react-dom

yarn
dev up
```

### Add JavaScript

sewing_kit looks for JavaScript in `app/ui/index.js`. The code in `index.js` (and any imported JS/CSS) will be built into a `main` bundle.

### Rails Setup

There are 2 ways to consume this package.

### Option 1: Mount the Engine

Add the engine to `routes.rb`.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # ...
  mount Quilt::Engine, at: '/'
end
```

Where `at` is the path where your App will respond with the React App. If you only want a sub-section of routes to respond with the React App, you can pass in the path to that sub-section here. For example:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # ...
  mount Quilt::Engine, at: '/path/to/react'
end
```

### Option 2: Add your react controller and routes

Create a `ReactController` to handle react requests.

```ruby
class ReactController < ApplicationController
  include Quilt::ReactRenderable

  def index
    render_react
  end
end
```

Have your routes wired up to default to your react controller.

```ruby
  get '/*path', to: 'react#index'
  root 'react#index'
```

## Minimal Project Layout

```
├── Gemfile (must contain "gem 'sewing_kit" and "gem 'quilt_rails'")
├── package.json (must specify '@shopify/sewing-kit' and `@shopify/react-server` as 'dependencies')
│
└── app
   └── ui
   │   └─- index.js
   └── controllers
       └─- react_controller (see above)
```

## Example minimal React/Polaris/Quilt entrypoint

```tsx
// app/ui/index.tsx

import * as React from 'react';
import {AppProvider, Page, Card} from '@shopify/polaris';

function App() {
  return (
    <AppProvider>
      <Page title="Hello">
        <Card sectioned>Hi there</Card>
      </Page>
    </AppProvider>
  );
}

export default App;
```

## Rails Generators

### `quilt:install`

Installs the Node dependencies, provide a basic React app (in TypeScript) and mounts the Quilt engine inside of your `config/routes.rb` file.

### `sewing-kit:install`

Adds a basic `sewing-kit.config.ts` file.

## Advanced use

### Interacting with the request / response in your React code

React-server sets up [@shopify/react-network](https://github.com/Shopify/quilt/blob/master/packages/react-network/src/hooks.ts#L25) for you, so most interactions with the request or response can be done from inside your React code.

#### Example: getting headers

```tsx
// app/ui/index.tsx

import * as React from 'react';
import {AppProvider, Page, Card} from '@shopify/polaris';
import {useRequestHeader} from '@shopify/react-network';

function App() {
  // get `some-header` from the request that was sent through Rails
  const someHeaderICareAbout = useRequestHeader('some-header');

  return (
    <AppProvider>
      <Page title="Hello">
        {someHeaderICareAbout}
        <Card sectioned>Hi there</Card>
      </Page>
    </AppProvider>
  );
}

export default App;
```

#### Example: redirecting

```tsx
// app/ui/index.tsx

import * as React from 'react';
import {AppProvider, Page, Card} from '@shopify/polaris';
import {useRedirect} from '@shopify/react-network';

function App() {
  // redirect to google as soon as we render
  useRedirect('www.google.com');

  return (
    <AppProvider>
      <Page title="Hello">
        <Card sectioned>Hi there</Card>
      </Page>
    </AppProvider>
  );
}

export default App;
```

### Customizing the node server

By default, sewing-kit bundles in `@shopify/react-server-webpack-plugin` for `quilt_rails` applications to get you up and running fast without needing to manually write any node server code. If you would like to customize what data your react application receives from the incoming request, you can add your own `server.js` / `server.ts` file to the app folder.

```
└── app
   └── ui
      └─- app.js
      └─- index.js
      └─- server.js
```

```tsx
// app/ui/server.tsx
import '@shopify/polyfills/fetch';
import {createServer} from '@shopify/react-server';
import {Context} from 'koa';
import React from 'react';

import App from './app';

// you could create your own server from scratch, but the easiest way to is using `@shopify/react-server`
// https://github.com/Shopify/quilt/blob/master/packages/react-server/README.md#L8
const app = createServer({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8081,
  ip: process.env.IP,
  assetPrefix: process.env.CDN_URL || 'localhost:8080/assets/webpack',
  serverMiddleware: [(ctx, next) => {
    // you can add your own middleware to extend the server's functionality.
    console.log('I am a custom middleware!');
    await next();
  }]
  render: (ctx, {locale}) => {
    const whatever = /* do something special with the koa context */;
    // any special data we add to the incoming request in our rails controller we can access here to pass into our component
    return <App server someCustomProp={whatever} location={ctx.request.url} locale={locale} />;
  },
});

export default app;
```

### Isomorphic state

With SSR enabled React apps, state must be serialized on the server and deserialized on the client to keep it consistent. With `@shopify/react-server`, the main way you will accomplish is using [`@shopify/react-html`](https://github.com/Shopify/quilt/tree/master/packages/react-html)'s [`useSerialized`](https://github.com/Shopify/quilt/tree/master/packages/react-html#in-your-application-code) hook to implement [self-serializers](https://github.com/Shopify/quilt/blob/master/packages/react-self-serializers/README.md#self-serializers). We offer some common ones out of the box in [`@shopify/react-self-serializers`](https://github.com/Shopify/quilt/blob/master/packages/react-self-serializers/README.md#self-serializers).
