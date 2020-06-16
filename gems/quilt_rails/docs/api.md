# Table of Contents

- [API](#api)
  - [ReactRenderable](#reactrenderable)
  - [Performance](#performance)
  - [Engine](#engine)
  - [Generators](#generators)

# API

## ReactRenderable

The `ReactRenderable` mixin is intended to be used in Rails controllers, and provides only the `render_react` method. This method handles proxying to a running `@shopify/react-server`.

```ruby
class ReactController < ApplicationController
  include Quilt::ReactRenderable

  def index
    render_react
  end
end
```

## Performance

### Reportable

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

#### Default Metrics

The full list of metrics sent by default are as follows:

##### For full-page load

- `AppName.time_to_first_byte`, representing the time from the start of the request to when the server began responding with data.
- `AppName.time_to_first_paint`, representing the time from the start of the request to when the browser rendered anything to the screen.
- `AppName.time_to_first_contentful_paint` representing the time from the start of the request to when the browser rendered meaningful content to the screen.
- `AppName.dom_content_loaded` representing the time from the start of the request to when the browser fired the [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event) event.
- `AppName.dom_load` representing the time from the start of the request to when the browser fired the [window.load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) event.

##### For both full-page navigations and client-side page transitions

- `AppName.navigation_usable`, representing the time it took before for the page to be rendered in a usable state. Usually this does not include data fetching or asynchronous tasks.
- `AppName.navigation_complete` representing the time it took for the page to be fully loaded, including any data fetching which blocks above-the-fold content.
- `AppName.navigation_download_size`, representing the total weight of all client-side assets (eg. CSS, JS, images). This will only be sent if there are any events with a `type` of `script` or `style`.
- `AppName.navigation_cache_effectiveness`, representing what percentage of client-side assets (eg. CSS, JS, images) were returned from the browser's cache. This will only be sent if there are any events with a `type` of `script` or `style`.

#### Customizing `process_report` with a block

The behaviour of `process_report` can be customized by manipulating the `Quilt::Performance::Client` instance yielded into its implicit block parameter.

```ruby
process_report do |client|
  # client.on_distribution do ....
end
```

### Client

The `Quilt::Performance::Client` class is yielded into the block parameter for `process_report`, and is the primary API for customizing what metrics are sent for a given POST.

#### Client#on_distribution

The `on_distribution` method takes a block which is run for each distribution (including custom ones) sent during `process_report`.

The provided callback can be used to easily add logging or other side-effects to your measurements.

```ruby
client.on_distribution do |metric_name, value, tags|
  Rails.logger.debug "#{metric_name}: #{value}, tags: #{tags}"
end
```

#### Client#on_navigation

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

#### Client#on_event

The `on_event` method takes a block which is run once per event reported to the performance controller _before_ the default distributions for the event are sent.

The provided callback can be used to add tags to the default `distributions` for a given event, or perform other side-effects.

```ruby
client.on_event do |event, tags|
  # add tags to be sent with each distribution for this event
  tags[:connection_rtt] = event.connection.rtt
  tags[:connection_type] = event.connection.type
end
```

## Engine

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

## Configuration

The `configure` method allows customization of the address the service will proxy to for UI rendering.

```ruby
  # config/initializers/quilt.rb
  Quilt.configure do |config|
    config.react_server_host = "localhost:3000"
    config.react_server_protocol = 'https'
  end
```

## StatsD environment variables

The `Performance::Reportable` mixin uses [https://github.com/Shopify/statsd-instrument](StatsD-Instrument) to send distributions. For detailed instructions on configuring where it sends data see [the documentation](https://github.com/Shopify/statsd-instrument#configuration).

## Generators

### `quilt:install`

This is equivalent to running `rails generate quilt:rails_setup`, `rails generate quilt:react_setup`, and `rails generate quilt:react_app`

### `quilt:rails_setup`

Mounts the Quilt engine in `config/routes.rb` and provide a Procfile to kick start Node in production container.

### `quilt:react_setup`

Installs the Node dependencies necessary for a React application.
This generator assumes the use of [`@shopify/sewing-kit`](https://github.com/Shopify/sewing-kit)

### `quilt:react_app`

This generator provides a basic React app (in TypeScript).
