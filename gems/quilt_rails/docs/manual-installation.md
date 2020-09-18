# Table of Contents

- [Manual Install](#manual-installation)
  - [Install Dependencies](#install-dependencies)
  - [Setup the Rails app](#setup-the-rails-app)
  - [Add JavaScript](#add-javascript)
  - [Run the server](#run-the-server)

### Manual installation

An application can also be setup manually using the following steps with an existing Rails application without [`webpacker`](./FAQ.md#i-run-into-webpacker-issue-while-setting-up-quilt_rails).

#### Install dependencies

```sh
# Add ruby dependencies
bundle add sewing_kit quilt_rails

# Add core Node dependencies
yarn add @shopify/sewing-kit

# Add React
yarn add react react-dom

# Add Typescript
yarn add typescript @types/react @types/react-dom
```

🗒️ Ignore `sewing_kit` and `@shopify/sewing-kit` dependencies if you don't have access to it.
Instead, make sure to use [`react-server webpack plugin`](../../../packages/react-server/README.md#webpack-plugin) with your webpack configuration.

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

Set `Quilt.configuration.mount = false` in your app config.

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

`bin/rails server`

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
