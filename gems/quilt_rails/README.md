# quilt_rails

A turn-key solution for integrating server-rendered react into your Rails app using Quilt libraries.

This document focuses on Rails integration. For details of `@shopify/react-server`'s configuration and usage, see the [react-server documentation](/packages/react-server/README.md).

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

## Rails Generators'

### `quilt:install`

Installs the Node dependencies, provide a basic React app (in TypeScript) and mounts the Quilt engine inside of your `config/routes.rb` file.

### `sewing-kit:install`

Adds a basic `sewing-kit.config.ts` file.
