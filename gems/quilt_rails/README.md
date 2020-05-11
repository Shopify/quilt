# quilt_rails

A turn-key solution for integrating Quilt client-side libraries into your Rails app, with support for server-side-rendering using [`@shopify/react-server`](https://www.npmjs.com/package/@shopify/react-server), integration with [`@shopify/sewing-kit`](https://github.com/Shopify/sewing-kit) for building, testing and linting, and front-end performance tracking through [`@shopify/performance`](https://www.npmjs.com/package/@shopify/performance).

## Table of Contents

- [Server-side-rendering](#server-side-rendering)
  - [Quick start](#quick-start)
    - [Generate Rails boilerplate](#generate-rails-boilerplate)
    - [Add Ruby dependencies](#add-ruby-dependencies)
    - [Generate Quilt boilerplate](#generate-quilt-boilerplate)
    - [Try it out](#try-it-out)
  - [Manual Install](#manual-installation)
    - [Generate Rails boilerplate](#generate-rails-boilerplate)
    - [Install Dependencies](#install-dependencies)
    - [Setup the Rails app](#setup-the-rails-app)
    - [Add JavaScript](#add-javascript)
    - [Run the server](#run-the-server)
  - [Application Layout](#application-layout)
  - [Advanced Use](#advanced-use)
    - [Testing](#testing)
    - [Interacting with the request and response in React code](#interacting-with-the-request-and-response-in-react-code)
    - [Dealing with isomorphic state](#dealing-with-isomorphic-state)
    - [Customizing the node server](#customizing-the-node-server)
    - [Fixing rejected CSRF tokens for new user sessions](#fixing-rejected-csrf-tokens-for-new-user-sessions)
- [Performance tracking a React app](#performance-tracking-a-react-app)
  - [Install dependencies](#install-dependencies)
  - [Setup an endpoint for performance reports](setup-an-endpoint-for-performance-reports)
  - [Add annotations](#add-annotations)
  - [Send the report](#send-the-report)
  - [Verify in development](#verify-in-development)
  - [Configure StatsD for production](#configure-statsd-for-production)
- [API](#api)
  - [ReactRenderable](#reactrenderable)
  - [Performance](#performance)
  - [Engine](#engine)
  - [Generators](#generators)

## Server-side-rendering

### Alpha functionality - do not use in high-traffic production applications

**Warning:** quilt_rails's server-side-rendering module `ReactRenderable` does not work at scale. Improvements to its architecture are being investigated. In its current state, it can be used for:

- Workshop applications
- Proof of concept applications
- Low traffic applications

For a description of the current architecture's problems, see [this Github comment](https://github.com/Shopify/quilt/issues/1059#issuecomment-539195340).

The ["decide on a scalable quilt_rails architecture" issue](https://github.com/Shopify/quilt/issues/1100) will track discussion of future architectures.

To scale up existing quilt_rails applications, skip server-side queries in your components. e.g.:

```ts
useQuery(MyQuery, {
  skip: typeof document === 'undefined',
});
```

### Quick start

Using the magic of generators, we can spin up a basic app with a few console commands.

#### Generate Rails boilerplate

`dev init`

When prompted, choose `rails`. This will generate a basic Rails application scaffold.

#### Add Ruby dependencies

`bundle add sewing_kit quilt_rails`

This will install our ruby dependencies and update the project's gemfile.

#### Generate Quilt boilerplate

`rails generate quilt:install`

This will install the Node dependencies, provide a basic React app (in TypeScript) and mounts the Quilt engine inside of `config/routes.rb`.

#### Try it out

```sh
dev up
dev server
```

Will run the application, starting up both servers and compiling assets.

### Manual installation

An application can also be setup manually using the following steps.

[Generate Rails boilerplate](#generate-rails-boilerplate)

#### Install dependencies

```sh
# Add ruby dependencies
bundle add sewing_kit quilt_rails

# Add core Node dependencies
yarn add @shopify/sewing-kit @shopify/react-server

# Add React
yarn add react react-dom

# Add Typescript
yarn add typescript @types/react @types/react-dom
```

##### Define typescript config

```json
// tsconfig.json
{
  "extends": "@shopify/typescript-configs/application.json",
  "compilerOptions": {
    "baseUrl": ".",
    "rootDir": "."
  },
  "include": ["app/ui"]
}
```

```sh
yarn
dev up
```

#### Setup the Rails app

There are 2 ways to consume this package.

##### Option 1: Mount the Engine

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

##### Option 2: Add a React controller and routes

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

#### Add JavaScript

`sewing_kit` looks for the top level component of your React app in `app/ui/index`. The component exported from this component (and any imported JS/CSS) will be built into a `main` bundle, and used to render the initial server-rendered markup.

We will add a basic entrypoint using React with some HTML.

```tsx
// app/ui/index.tsx

import React from 'react';

function App() {
  return <h1>My application ❤️</h1>;
}

export default App;
```

#### Run the server

`dev server`

Will run the application, starting up both servers and compiling assets.

### Application layout

#### Minimal

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

#### Rails and React

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
        └── shared.scss (common functions/mixins you want available in every scss file. Requires configuring `plugin.sass`'s `autoInclude` option in `sewing-kit.config.js`)
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

### Advanced use

#### Testing

For fast tests with consistent results, test front-end components using the tools provided by sewing-kit instead of Rails integration tests.

Use [`sewing-kit test`](https://github.com/Shopify/sewing-kit/blob/master/docs/commands/test.md#L3) to run all `.test.{js|ts}x` files in the `app/ui` directory. [Jest](https://jestjs.io/) is used as a test runner, with customization available via [its sewing-kit plugin](https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/jest.md).

For testing React applications we provide and support [`@shopify/react-testing`](https://github.com/Shopify/quilt/tree/master/packages/react-testing).

##### Example

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

##### Customizing the test environment

Often you will want to hook up custom polyfills, global mocks, or other logic that needs to run either before the initialization of the test environment, or once for each test suite.

By default, sewing-kit will look for such test setup files under `/app/ui/tests`. Check out the [documentation](https://github.com/Shopify/sewing-kit/blob/master/docs/plugins/jest.md#smart-defaults) for more details.

##### Interacting with the request and response in React code

React-server sets up [@shopify/react-network](https://github.com/Shopify/quilt/blob/master/packages/react-network) automatically, so most interactions with the request or response can be done from inside the React app.

##### Example: getting headers

```tsx
// app/ui/index.tsx

import React from 'react';
import {useRequestHeader} from '@shopify/react-network';

function App() {
  // get `some-header` from the request that was sent through Rails
  const someHeaderICareAbout = useRequestHeader('some-header');

  return (
    <>
      <h1>My application ❤️</h1>
      <div>{someHeaderICareAbout}</div>
    </>
  );
}

export default App;
```

##### Example: sending custom data from Rails controller

In some cases you may want to send custom headers or basic data from Rails to your React server. Quilt facilitates this case by providing consumers with a `headers` and `data` argument on the `render_react` call.

**Note:** The data passed should be data that is unlikely or will never change over the course of the session before they render any React components.

```ruby
class ReactController < ApplicationController
  include Quilt::ReactRenderable

  def index
    render_react(headers: {'x-custom-header': 'header-value-a'}, data: {'some_id': 123})
  end
end
```

The React server will serialize the provided quilt data using `quilt-data` as the ID. You can then get this serialized data on the client with `getSerialized` from `@shopify/react-html`. If using the webpack plugin, this will be done automatically and the data will be passed into your application as the `data` prop.

```tsx
// app/ui/index.tsx

import React from 'react';
import {getSerialized} from '@shopify/react-html';

const IS_CLIENT = typeof window !== 'undefined';

function App() {
  // get the serialized data from the request that was sent through Rails ReactController
  const quiltData = IS_CLIENT ? getSerialized<Record<string, any>>('quilt-data') : null;

  // Logs {"x-custom-header":"header-value-a","some_id":123}
  console.log(quiltData);

  return <h1>Data: {quiltData}</h1>;
}

export default App;
```

##### Example: redirecting

```tsx
// app/ui/index.tsx

import React from 'react';
import {useRedirect} from '@shopify/react-network';

function App() {
  // redirect to google as soon as we render
  useRedirect('www.google.com');

  return <h1>My application ❤️</h1>;
}

export default App;
```

#### Isomorphic state

With SSR enabled React apps, state must be serialized on the server and deserialized on the client to keep it consistent. When using `@shopify/react-server`, the best tool for this job is [`@shopify/react-html`](https://github.com/Shopify/quilt/tree/master/packages/react-html)'s [`useSerialized`](https://github.com/Shopify/quilt/tree/master/packages/react-html#in-your-application-code) hook.

`useSerialized` can be used to implement [universal-providers](https://github.com/Shopify/quilt/tree/master/packages/react-universal-provider#what-is-a-universal-provider-), allowing application code to manage what is persisted between the server and client without adding any custom code to client or server entrypoints. We offer some for common use cases such as [CSRF](https://github.com/Shopify/quilt/tree/master/packages/react-csrf-universal-provider), [GraphQL](https://github.com/Shopify/quilt/tree/master/packages/react-graphql-universal-provider), [I18n](https://github.com/Shopify/quilt/tree/master/packages/react-i18n-universal-provider), and the [Shopify App Bridge](https://github.com/Shopify/quilt/tree/master/packages/react-app-bridge-universal-provider).

#### Customizing the node server

By default, sewing-kit bundles in [`@shopify/react-server-webpack-plugin`](../../packages/react-server-webpack-plugin/README.md) for `quilt_rails` applications to get apps up and running fast without needing to manually write any node server code.

If what it provides is not sufficient, a completely custom server can be defined by adding a `server.js` or `server.ts` file to the `app/ui` folder. The simplest way to customize the server is to export the object created by [`@shopify/react-server`](../../packages/react-server/README.md#node-usage)'s `createServer` call in `server.ts` file.

```
└── appeon
   └── ui
      └─- app.{js|ts}x
      └─- index.{js|ts}
      └─- server.{js|ts}x
```

#### Fixing rejected CSRF tokens for new user sessions

When a React component sends HTTP requests back to a Rails endpoint (e.g., `/graphql`), Rails may throw a `Can't verify CSRF token authenticity` exception. This stems from the Rails CSRF tokens not persisting until after the first `UiController` call ends.

If your API **does not** require session data, the easiest way to deal with this is to use `protect_from_forgery with: :null_session`. This will work for APIs that either have no authentication requirements, or use header based authentication.

##### Example

```rb
class GraphqlController < ApplicationController
  protect_from_forgery with: :null_session

  def execute
    # Get GraphQL query, etc

    result = MySchema.execute(query, operation_name: operation_name, variables: variables, context: context)

    render(json: result)
  end
end
```

If your API **does** require session data, you can follow these steps:

- Add an `x-shopify-react-xhr` header to all GraphQL requests with a value of 1 (this is done automatically if you are using `@shopify/react-graphql-universal-provider`)
- Add a `protect_from_forgery with: Quilt::HeaderCsrfStrategy` override to your controllers

##### Example

```rb
class GraphqlController < ApplicationController
  protect_from_forgery with: Quilt::HeaderCsrfStrategy

  def execute
    # Get GraphQL query, etc

    result = MySchema.execute(query, operation_name: operation_name, variables: variables, context: context)

    render(json: result)
  end
end
```

## Performance tracking a React app

Using [`Quilt::Performance::Reportable`](#performanceReportable) and [@shopify/react-performance](https://www.npmjs.com/package/@shopify/react-performance) it's easy to add performance tracking to apps using[`sewing_kit`](https://github.com/Shopify/sewing-kit/tree/master/gems/sewing_kit#sewing_kit-) for client-side-rendering or `quilt_rails` for server-side-rendering.

### Install dependencies

1. Install the gem (if your app is not already using `quilt_rails`).

```bash
bundle add quilt_rails
```

2. Install `@shopify/react-performance`, the library we will use to annotate our React application and send performance reports to our server.

```bash
yarn add @shopify/react-performance
```

### Setup an endpoint for performance reports

If your application is not using `Quilt::Engine`, you will need to manually configure the server-side portion of performance tracking. If it _is_ using the engine, the following will be done automatically.

1. Add a `PerformanceController` and the corresponding routes to your Rails app.

```ruby
# app/controllers/performance_report_controller.rb

class PerformanceReportController < ActionController::Base
  include Quilt::Performance::Reportable
  protect_from_forgery with: :null_session

  def create
    process_report

    render(json: { result: 'success' }, status: 200)
  rescue ActionController::ParameterMissing => error
    render(json: { error: error.message }, status: 422)
  end
end
```

2. Add a route pointing at the controller.

```ruby
# config/routes.rb

post '/performance_report', to: 'performance_report#create'

# rest of routes
```

### Add annotations

Add a [`usePerformanceMark`](https://github.com/Shopify/quilt/tree/master/packages/react-performance#useperformancemark) call to each of your route-level components.

```tsx
// app/ui/features/Home/Home.tsx
import {usePerformanceMark} from '@shopify/react-performance';

export function Home() {
  // tell the library the page has finished rendering completely
  usePerformanceMark('complete', 'Home');

  return <>{/* your Home page JSX goes here*/}</>;
}
```

### Send the report

Add a [`usePerformanceReport`](https://github.com/Shopify/quilt/tree/master/packages/react-performance#usePerformanceReport) call to your top-level `<App />` component.

```tsx
// app/ui/foundation/App/App.tsx
import {usePerformanceReport} from '@shopify/react-performance';

export function App() {
  // send the report to the server
  usePerformanceReport('/performance_report');

  return <>{/* your app JSX goes here*/}</>;
}
```

For more details on how to use the APIs from `@shopify/react-performance` check out its [documentation](https://github.com/Shopify/quilt/tree/master/packages/react-performance).

### Verify in development

By default `quilt_rails` will not send metrics in development mode. To verify your app is setup correctly you can check in your network tab when visiting your application and see that POST requests are sent to `/performance_report`, and recieve a `200 OK` response.

If you want more insight into what distributions _would_ be sent in production, you can use the `on_distribution` callback provided by the library to setup logging.

```ruby
# app/controllers/performance_report_controller.rb

class PerformanceReportController < ActionController::Base
  include Quilt::Performance::Reportable
  protect_from_forgery with: :null_session

  def create
    # customize process_report's behaviour with a block
    process_report do |client|
      client.on_distribution do |name, value, tags|
        # We log out the details of each distribution that would be sent in production.
        Rails.logger.debug("Distribution: #{name}, #{value}, #{tags}")
      end
    end

    render json: { result: 'success' }, status: 200
  rescue ActionController::ParameterMissing => error
    render json: { error: error.message, status: 422 }
  end
end
```

Now you can check your Rails console output and verify that metrics are reported as expected.

### Configure StatsD for production

> Attention Shopifolk! If using `dev` your `StatsD` endpoint will already be configured for you in production. You should not need to do the following. ✨

To tell `Quilt::Performance::Reportable` where to send it's distributions, setup the environment variables detailed [documentation](https://github.com/Shopify/statsd-instrument#configuration).

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

### Performance

#### Reportable

The `Quilt::Performance::Reportable` mixin is intended to be used in Rails controllers, and provides only the `process_report` method. This method handles parsing an incoming report from [@shopify/react-performance's](https://www.npmjs.com/package/@shopify/react-performance) `<PerformanceReport />` component (or a custom report in the same format) and sending it to your application's StatsD endpoint as `distribution`s using [`StatsD-Instrument`](https://rubygems.org/gems/statsd-instrument).

> **Note** `Quilt::Performance::Reportable` does not require you to use the `React::Renderable` mixin, React-Server, or even any server-side-rendering solution at all. It should work perfectly fine for applications using something like `sewing_kit_script_tag` based client-side-rendering.

```ruby
class PerformanceController < ApplicationController
  include Quilt::Performance::Reportable

  def create
    process_report
  end
end
```

The params sent to the controller are expected to be of type `application/json`. Given the following example JSON sent by `@shopify/react-performance`,

```json
{
  "connection": {
    "rtt": 100,
    "downlink": 2,
    "effectiveType": "3g",
    "type": "4g"
  },
  "navigations": [
    {
      "details": {
        "start": 12312312,
        "duration": 23924,
        "target": "/",
        "events": [
          {
            "type": "script",
            "start": 23123,
            "duration": 124
          },
          {
            "type": "style",
            "start": 23,
            "duration": 14
          }
        ],
        "result": 0
      },
      "metadata": {
        "index": 0,
        "supportsDetailedTime": true,
        "supportsDetailedEvents": true
      }
    }
  ],
  "events": [
    {
      "type": "ttfb",
      "start": 2,
      "duration": 1000
    }
  ]
}
```

given the the above controller input, the library would send the following metrics:

```ruby
StatsD.distribution('time_to_first_byte', 2, tags: {
  browser_connection_type:'3g',
})
StatsD.distribution('time_to_first_byte', 2, tags: {
  browser_connection_type:'3g' ,
})
StatsD.distribution('navigation_complete', 23924, tags: {
  browser_connection_type:'3g' ,
})
StatsD.distribution('navigation_usable', 23924, tags: {
  browser_connection_type:'3g' ,
})
```

##### Default Metrics

The full list of metrics sent by default are as follows:

###### For full-page load

- `AppName.time_to_first_byte`, representing the time from the start of the request to when the server began responding with data.
- `AppName.time_to_first_paint`, representing the time from the start of the request to when the browser rendered anything to the screen.
- `AppName.time_to_first_contentful_paint` representing the time from the start of the request to when the browser rendered meaningful content to the screen.
- `AppName.dom_content_loaded` representing the time from the start of the request to when the browser fired the [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event) event.
- `AppName.dom_load` representing the time from the start of the request to when the browser fired the [window.load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) event.

###### For both full-page navigations and client-side page transitions

- `AppName.navigation_usable`, representing the time it took before for the page to be rendered in a usable state. Usually this does not include data fetching or asynchronous tasks.
- `AppName.navigation_complete` representing the time it took for the page to be fully loaded, including any data fetching which blocks above-the-fold content.
- `AppName.navigation_download_size`, representing the total weight of all client-side assets (eg. CSS, JS, images). This will only be sent if there are any events with a `type` of `script` or `style`.
- `AppName.navigation_cache_effectiveness`, representing what percentage of client-side assets (eg. CSS, JS, images) were returned from the browser's cache. This will only be sent if there are any events with a `type` of `script` or `style`.

##### Customizing `process_report` with a block

The behaviour of `process_report` can be customized by manipulating the `Quilt::Performance::Client` instance yielded into its implicit block parameter.

```ruby
process_report do |client|
  # client.on_distribution do ....
end
```

#### Client

The `Quilt::Performance::Client` class is yielded into the block parameter for `process_report`, and is the primary API for customizing what metrics are sent for a given POST.

##### Client#on_distribution

The `on_distribution` method takes a block which is run for each distribution (including custom ones) sent during `process_report`.

The provided callback can be used to easily add logging or other side-effects to your measurements.

```ruby
client.on_distribution do |metric_name, value, tags|
  Rails.logger.debug "#{metric_name}: #{value}, tags: #{tags}"
end
```

##### Client#on_navigation

The `on_navigation` method takes a block which is run once per navigation reported to the performance controller _before_ the default distributions for the navigation are sent.

The provided callback can be used to add tags to the default `distributions` for a given navigation.

```ruby
client.on_navigation do |navigation, tags|
  # add tags to be sent with each distribution for this navigation
  tags[:connection_rtt] = navigation.connection.rtt
  tags[:connection_type] = navigation.connection.type
  tags[:navigation_target] = navigation.target

  # add a tag to allow filtering out navigations that are too long
  # this is useful when you are unable to rule out missing performance marks on some pages
  tags[:too_long_dont_read] = navigation.duration > 30.seconds.in_milliseconds
end
```

It can also be used to compute and send entirely custom metrics.

```ruby
client.on_navigation do |navigation, tags|
  # calculate and then send an additional distribution
  weight = navigation.events_with_size.reduce(0) do |total, event|
    total + event.size
  end
  client.distribution('navigation_total_resource_weight', weight, tags)
end
```

##### Client#on_event

The `on_event` method takes a block which is run once per event reported to the performance controller _before_ the default distributions for the event are sent.

The provided callback can be used to add tags to the default `distributions` for a given event, or perform other side-effects.

```ruby
client.on_event do |event, tags|
  # add tags to be sent with each distribution for this event
  tags[:connection_rtt] = event.connection.rtt
  tags[:connection_type] = event.connection.type
end
```

### Engine

`Quilt::Engine` provides:

- a preconfigured `UiController` which consumes `ReactRenderable`
- a preconfigured `PerformanceReportController` which consumes `Performance::Reportable`
- a `/performance_report` route mapped to `performance_report#index`
- a catch-all index route mapped to the `UiController#index`

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # ...
  mount Quilt::Engine, at: '/my-front-end'
end
```

The above is the equivalent of

```ruby
  post '/my-front-end/performance_report', to: 'performance_report#create'
  get '/my-front-end/*path', to: 'ui#index'
  get '/my-front-end', to: 'ui#index'
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

### StatsD environment variables

The `Performance::Reportable` mixin uses [https://github.com/Shopify/statsd-instrument](StatsD-Instrument) to send distributions. For detailed instructions on configuring where it sends data see [the documentation](https://github.com/Shopify/statsd-instrument#configuration).

### Generators

#### `quilt:install`

Installs the Node dependencies, provide a basic React app (in TypeScript) and mounts the Quilt engine in `config/routes.rb`.

#### `sewing_kit:install`

Adds a basic `sewing-kit.config.ts` file.
