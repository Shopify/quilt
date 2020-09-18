# quilt_rails

A turn-key solution for integrating Quilt client-side libraries into your Rails app, with support for server-side-rendering using [`@shopify/react-server`](https://www.npmjs.com/package/@shopify/react-server), integration with [`@shopify/sewing-kit`](https://github.com/Shopify/sewing-kit) for building, testing and linting, and front-end performance tracking through [`@shopify/performance`](https://www.npmjs.com/package/@shopify/performance).

## Table of Contents

- [Server-side-rendering](#server-side-rendering)
  - [Quick start](#quick-start)
    - [Generate Rails boilerplate](#generate-rails-boilerplate)
    - [Add Ruby dependencies](#add-ruby-dependencies)
    - [Generate app boilerplate](#generate-app-boilerplate)
    - [Try it out](#try-it-out)
  - [Manual Install](#manual-installation)
  - [Application Layout](#application-layout)
  - [Advanced Use](#advanced-use)
    - [Testing](#testing)
    - [Interacting with the request and response in React code](#interacting-with-the-request-and-response-in-react-code)
    - [Dealing with isomorphic state](#dealing-with-isomorphic-state)
    - [Customizing the Node server](#customizing-the-node-server)
    - [Fixing rejected CSRF tokens for new user sessions](#fixing-rejected-csrf-tokens-for-new-user-sessions)
- [Performance tracking a React app](#performance-tracking-a-react-app)
- [API](#api)

## Server-side-rendering

🗒 This guide is focused on internal Shopify developers with access [@shopify/sewing-kit](https://github.com/Shopify/sewing-kit). A similar setup can be achieved using the [manual installation](./docs/manual-installation.md) , and following the [react-server webpack plugin](../../packages/react-server/README.md#webpack-plugin) guide. Apps not running on Shopify infrastructure should [disable server-side GraphQL queries](./docs/FAQ.md) to avoid scalability issue.

### Quick start

Using the magic of generators, we can spin up a basic app with a few console commands.

#### Generate Rails boilerplate

Use [`rails new . --skip-javascript`](https://guides.rubyonrails.org/command_line.html#rails-new) to scaffold out a Rails application.to do the same.

#### Add Ruby dependencies

`bundle add sewing_kit quilt_rails`

This will install our ruby dependencies and update the project's gemfile.

#### Generate app boilerplate

`rails generate sewing_kit:install`

This will generate a package.json file with common sewing-kit script tasks, default lint, format configuration; a sewing-kit configuration file, and other project default configurations.

`rails generate quilt:install`

This command will install Node dependencies, mount the Quilt engine in `config/routes.rb`, and provide a bare bone React app (in TypeScript) that.

#### Try it out

```sh
bin/rails server
```

Will run the application, starting up both servers and compiling assets.

### Manual installation

Follow [this guide](./docs/manual-installation.md) on how to do manual setup without the generator.

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

**Note:** This solution works out of the box for initial server-side renders. If you wish to have consistent access to request headers on subsequent client-side renders, take a look at [`NetworkUniversalProvider`](https://github.com/Shopify/quilt/tree/master/packages/react-network#networkuniversalprovider).

##### Example: sending custom headers from Rails controller

In some cases you may want to send custom headers from Rails to your React server. Quilt facilitates this case by providing consumers with a `headers` argument on the `render_react` call.

```ruby
class ReactController < ApplicationController
  include Quilt::ReactRenderable

  def index
    render_react(headers: {'x-custom-header': 'header-value-a'})
  end
end
```

🗒️ if you don't have a controller. Follow the [instruction](./docs/manual-installation.md#option-2-add-a-react-controller-and-routes) to setup `quilt_rails` in a controller instead of using the engine.

Headers can be accessed during server-side-rendering with the `useRequestHeader` hook from `@shopify/react-network`.

```tsx
// app/ui/index.tsx

import React from 'react';
import {useRequestHeader} from '@shopify/react-network';

function App() {
  const header = useRequestHeader('x-custom-header');
  return <h1>Data: {header}</h1>;
}

export default App;
```

##### Example: sending custom data from Rails controller

In some cases you may want to send basic data from Rails to your React server. Quilt facilitates this case by providing consumers with a `data` argument on the `render_react` call.

**Note:** The data passed should be data that is unlikely or will never change over the course of the session before they render any React components.

**Note:** Please note the minimal dependencies require to use this feature is listed in [CHANGELOG](./CHANGELOG.md#[1.12.0]-2020-05-07)

```ruby
class ReactController < ApplicationController
  include Quilt::ReactRenderable

  def index
    render_react(data: {'some_id': 123})
  end
end
```

🗒️ if you don't have a controller. Follow the [instruction](./docs/manual-installation.md#option-2-add-a-react-controller-and-routes) to setup `quilt_rails` in a controller instead of using the engine.

If using `react-server` without a customized server & client file, this will be automatically passed into your application as the `data` prop. If `react-server` is not being used or a customized server / client file was provided, check out [`react-server/webpack-plugin`](../../packages/react-server/src/webpack-plugin/webpack-plugin.ts) on how to pass the data to React.

```tsx
// app/ui/index.tsx

import React from 'react';

function App({data}: {data: Record<string, any>}) {
  // Logs {"some_id":123}
  console.log(data);

  return <h1>Data: {data}</h1>;
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

`useSerialized` can be used to implement [universal-providers](https://github.com/Shopify/quilt/tree/master/packages/react-universal-provider#what-is-a-universal-provider-), allowing application code to manage what is persisted between the server and client without adding any custom code to client or server entrypoints. We offer some for common use cases such as [GraphQL](https://github.com/Shopify/quilt/tree/master/packages/react-graphql-universal-provider), and [I18n](https://github.com/Shopify/quilt/tree/master/packages/react-i18n-universal-provider).

#### Customizing the Node server

By default, sewing-kit bundles in [`@shopify/react-server/webpack-plugin`](../../packages/react-server/README.md#webpack-plugin) for `quilt_rails` applications to get apps up and running fast without needing to manually write any Node server code.

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

While `Can't verify CSRF token authenticity` error will persist, `protect_from_forgery with: :null_session` will keep CSRF protection while ensuring the session is nullified when a token is not sent in to be more secure.

You can also add `self.log_warning_on_csrf_failure = false` to the controller to suppress this error all together.

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
- Add a `protect_from_forgery with: Quilt::HeaderCsrfStrategy` override to your API controllers

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

#### Exception monitoring with Bugsnag

For an opinionated universal Bugsnag+React setup we provide and support [`@shopify/react-bugsnag`](https://github.com/Shopify/quilt/tree/master/packages/react-bugsnag).

##### Example

```typescript
// app/ui/index.tsx
import React from 'react';
import {Bugsnag, createBugsnagClient} from 'utilities/bugsnag';
import {bugsnagClientApiKey} from 'config/bugsnag';

const bugsnagClient = createBugsnagClient({apiKey: bugsnagClientApiKey});

export function App() {
  return <Bugsnag client={bugsnagClient}>{/* actual app content here */}</Bugsnag>;
}
```

## Performance tracking a React app

To setup performance tracking with your React app with `quilt_rails`.
Follow details guide [here](./docs/performance-tracking.md).

## API

Find all features this gem offer in this [API doc](./docs/api.md).

## FAQ

Find your [here](./docs/FAQ.md).
