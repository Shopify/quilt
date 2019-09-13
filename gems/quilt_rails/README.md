# quilt_rails

A turn-key solution for integrating server-rendered react into your Rails app using Quilt libraries.

## Table of Contents

1. [Quick Start](#quick-start)
   1. [Generate Rails boilerplate](#generate-rails-boilerplate)
   1. [Add Ruby dependencies](#add-ruby-dependencies)
   1. [Generate Quilt boilerplate](#generate-quilt-boilerplate)
   1. [Try it out](#try-it-out)
1. [Manual Install](#manual-installation)
   1. [Install Dependencies](#install-dependencies)
   1. [Setup the Rails app](#setup-the-rails-app)
   1. [Add JavaScript](#add-javascript)
   1. [Run the server](#run-the-server)
1. [Application Layout](#application-layout)
1. [API](#api)
   1. [ReactRenderable](#reactrenderable)
   1. [Engine](#engine)
   1. [Generators](#generators)
1. [Advanced Use](#advanced-use)
   1. [Testing](#testing)
   1. [Interacting with the request and response in React code](#interacting-with-the-request-and-response-in-react-code)
   1. [Dealing with isomorphic state](#dealing-with-isomorphic-state)
   1. [Customizing the node server](#customizing-the-node-server)

## Quick Start

Using the magic of generators, we can spin up a basic app with a few console commands.

### Generate Rails boilerplate

`dev init`

When prompted, choose `rails`. This will generate a basic Rails application scaffold.

### Add Ruby dependencies

`bundle add sewing_kit quilt_rails`

This will install our ruby dependencies and update the project's gemfile.

### Generate Quilt boilerplate

`rails generate quilt:install`

This will install the Node dependencies, provide a basic React app (in TypeScript) and mounts the Quilt engine inside of `config/routes.rb`.

### Try it out

`dev server`

Will run the application, starting up both servers and compiling assets.

## Manual Installation

An application can also be setup manually using the following steps.

### Install Dependencies

```sh
# Add core Node dependencies
yarn add @shopify/sewing-kit @shopify/react-server

# Add Polaris and React
yarn add @shopify/polaris react react-dom

yarn
dev up
```

### Setup the Rails app

There are 2 ways to consume this package.

#### Option 1: Mount the Engine

Add the engine to `routes.rb`.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # ...
  mount Quilt::Engine, at: '/'
end
```

If only a sub-section of routes should respond with the React App, it can be configured using the `at` parameter.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # ...
  mount Quilt::Engine, at: '/path/to/react'
end
```

#### Option 2: Add a React controller and routes

Create a `ReactController` to handle react requests.

```ruby
class ReactController < ApplicationController
  include Quilt::ReactRenderable

  def index
    render_react
  end
end
```

Add routes to default to the `ReactController`.

```ruby
  get '/*path', to: 'react#index'
  root 'react#index'
```

### Add JavaScript

`sewing_kit` looks for the top level component of your React app in `app/ui/index`. The component exported from this component (and any imported JS/CSS) will be built into a `main` bundle, and used to render the initial server-rendered markup.

We will add a basic entrypoint using React with Polaris components.

```tsx
// app/ui/index.tsx

import React from 'react';
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

### Run the server

`dev server`

Will run the application, starting up both servers and compiling assets.

## Application layout

### Minimal

The basic layout for an app using `quilt_rails` and friends will have a `ui` folder nested inside the normal Rails `app` folder, containing at _least_ an index.js file exporting a React component.

```
├── Gemfile (must contain "gem 'sewing_kit" and "gem 'quilt_rails'")
├── package.json (must specify '@shopify/sewing-kit' and `@shopify/react-server` as 'dependencies')
│
└── app
   └── ui
   │   └─- index.{js|ts} (exports a React component)
   └── controllers
       └─- react_controller.rb (see above)
```

### Rails, Polaris, and React

A more complex application will want a more complex layout. The following shows scalable locations for:

- Global SCSS settings
- App sections (roughly analogous to Rails routes)
- Components
- Co-located CSS modules
- Co-located unit tests
- Test setup files

```
└── app
    └── ui
        ├─- index.{js|ts} (exports a React component)
        ├── styles (optional)
        │   └── settings.scss (global vars and @polaris overrides)
        │
        └── tests (optional)
        │   └── each-test.{js|ts}
        │   └── setup.{js|ts}
        └── features (optional)
            ├── App
            │   ├── index.{js|ts}
            │   ├── App.{js|ts}x
            │   └── tests
            │       └── App.test.{js|ts}x
            │
            ├-─ MyComponent
            │   ├-─ index.{js|ts}
            │   ├-─ MyComponent.{js|ts}x
            │   ├── MyComponent.scss (optional; component-scoped CSS styles, mixins, etc)
            │   └── tests
            │       └── MyComponent.test.{js|ts}x
            │
            └── sections (optional; container views that compose presentation components into UI blocks)
                └── Home
                    ├-─ index.{js|ts}
                    └── Home.{js|ts}
```

## API

### ReactRenderable

The `ReactRenderable` mixin is intended to be used in Rails controllers, and provides only the `render_react` method. This method handles proxying to a running `@shopify/react-server`.

```ruby
class ReactController < ApplicationController
  include Quilt::ReactRenderable

  def index
    render_react
  end
end
```

### Engine

`Quilt::Engine` provides a preconfigured controller which consumes `ReactRenderable` and provides an index route which uses it.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # ...
  mount Quilt::Engine, at: '/path/to/react'
end
```

### Configuration

The `configure` method allows customization of the address the service will proxy to for UI rendering.

```ruby
  # config/initializers/quilt.rb
  Quilt.configure do |config|
    config.react_server_host = "localhost:3000"
    config.react_server_protocol = 'https'
  end
```

### Generators

#### `quilt:install`

Installs the Node dependencies, provide a basic React app (in TypeScript) and mounts the Quilt engine in `config/routes.rb`.

#### `sewing_kit:install`

Adds a basic `sewing-kit.config.ts` file.

## Advanced use

### Testing

For fast tests with consistent results, test front-end components using the tools provided by sewing-kit instead of Rails integration tests.

Use [`sewing-kit test`](https://github.com/Shopify/sewing-kit/blob/master/docs/commands/test.md#L3) to run all `.test.{js|ts}x` files in the `app/ui` directory. [Jest](https://jestjs.io/) is used as a test runner, with customization available via [its sewing-kit plugin](https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/jest.md).

For testing React applications we provide and support [`@shopify/react-testing`](https://github.com/Shopify/quilt/tree/master/packages/react-testing).

#### Example

Given a component `MyComponent.tsx`

```tsx
// app/ui/components/MyComponent/MyComponent.tsx
export function MyComponent({name}: {name: string}) {
  return <div>Hello, {name}!</div>;
}
```

A test would be written using Jest and `@shopify/react-testing`'s `mount` feature.

```tsx
// app/ui/components/MyComponent/tests/MyComponent.test.tsx
import {MyComponent} from '../MyComponent';

describe('MyComponent', () => {
  it('greets the given named person', () => {
    const wrapper = mount(<MyComponent name="Kokusho" />);

    // toContainReactText is a custom matcher provided by @shopify/react-testing/matchers
    expect(wrapper).toContainReactText('Hello, Kokusho');
  });
});
```

### Test setup files

By default, the jest plugin will look for test setup files under `/app/ui/tests`.

`setup` can be used to add any custom polyfills needed for the testing environment.

```tsx
// app/ui/tests/setup.ts

import 'isomorphic-fetch';
import 'raf/polyfill';
import {URL, URLSearchParams} from 'url';

(global as any).URL = URL;
(global as any).URLSearchParams = URLSearchParams;
```

`each-test` can be used for any logic that needs to run for each individual test suite. Any setup logic that needs to happen with `jest` globals in scope, such as importing custom matchers, should also be done here.

```tsx
// app/ui/tests/each-test.ts

// we cannot import these in `setup` because `expect` will not be defined
import '@shopify/react-testing/matchers';

beforeAll(() => {
  console.log('I will run before every test suite');
});

beforeEach(() => {
  console.log('I will run before every test case');
});

afterEach(() => {
  console.log('I will run after every test case');
});

afterAll(() => {
  console.log('I will run after every test suite');
});
```

For more complete documentation of the jest plugin see [it's documentation](https://github.com/Shopify/sewing-kit/tree/master/docs/plugins/jest.md).

### Interacting with the request and response in React code

React-server sets up [@shopify/react-network](https://github.com/Shopify/quilt/blob/master/packages/react-network/src/hooks.ts#L25) automatically, so most interactions with the request or response can be done from inside the React app.

#### Example: getting headers

```tsx
// app/ui/index.tsx

import React from 'react';
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

import React from 'react';
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

### Isomorphic state

With SSR enabled React apps, state must be serialized on the server and deserialized on the client to keep it consistent. When using `@shopify/react-server`, the best tool for this job is [`@shopify/react-html`](https://github.com/Shopify/quilt/tree/master/packages/react-html)'s [`useSerialized`](https://github.com/Shopify/quilt/tree/master/packages/react-html#in-your-application-code) hook.

`useSerialized` can be used to implement [universal-providers](https://github.com/Shopify/quilt/tree/master/packages/react-universal-provider#what-is-a-universal-provider-), allowing application code to manage what is persisted between the server and client without adding any custom code to client or server entrypoints. We offer some for common use cases such as [CSRF](https://github.com/Shopify/quilt/tree/master/packages/react-csrf-universal-provider), [GraphQL](https://github.com/Shopify/quilt/tree/master/packages/react-graphql-universal-provider), [I18n](https://github.com/Shopify/quilt/tree/master/packages/react-i18n-universal-provider), and the [Shopify App Bridge](https://github.com/Shopify/quilt/tree/master/packages/react-app-bridge-universal-provider).

### Customizing the node server

By default, sewing-kit bundles in `@shopify/react-server-webpack-plugin` for `quilt_rails` applications to get apps up and running fast without needing to manually write any node server code. If what it provides is not sufficient, a custom server can be defined by adding a `server.js` or `server.ts` file to the app folder.

```
└── app
   └── ui
      └─- app.{js|ts}x
      └─- index.{js|ts}
      └─- server.{js|ts}x
```

```tsx
// app/ui/server.tsx
import '@shopify/polyfills/fetch';
import {createServer} from '@shopify/react-server';
import {Context} from 'koa';
import React from 'react';

import App from './app';

// The simplest way to build a custom server that will work with this library is to use the APIs provided by @shopify/react-server.
// https://github.com/Shopify/quilt/blob/master/packages/react-server/README.md#L8
const app = createServer({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8081,
  ip: process.env.IP,
  assetPrefix: process.env.CDN_URL || 'localhost:8080/assets/webpack',
  render: (ctx, {locale}) => {
    const whatever = /* do something special with the koa context */;
    // any special data we add to the incoming request in our rails controller we can access here to pass into our component
    return <App server someCustomProp={whatever} location={ctx.request.url} locale={locale} />;
  },
});

export default app;
```
