## Table of Contents

- [Performance tracking a React app](#performance-tracking-a-react-app)
  - [Install dependencies](#install-dependencies)
  - [Setup an endpoint for performance reports](setup-an-endpoint-for-performance-reports)
  - [Add annotations](#add-annotations)
  - [Send the report](#send-the-report)
  - [Verify in development](#verify-in-development)
  - [Configure StatsD for production](#configure-statsd-for-production)

## Performance tracking a React app

Using [`Quilt::Performance::Reportable`](#performanceReportable) and [@shopify/react-performance](https://www.npmjs.com/package/@shopify/react-performance) it's easy to add performance tracking to apps using[`sewing_kit`](https://github.com/Shopify/sewing-kit/tree/master/gems/sewing_kit#sewing_kit-) gem for client-side-rendering or `quilt_rails` for server-side-rendering.

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
