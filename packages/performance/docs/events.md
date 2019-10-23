# Events

## Lifecycle Events

### Time to First Byte

Use enum `EventType.TimeToFirstByte`

The time until the server sends the first part of the response.
[Learn more](https://developers.google.com/web/tools/chrome-devtools/network-performance/understanding-resource-timing)

### First Paint

Use enum `EventType.TimeToFirstPaint`

The time until the browser renders anything that differs from the previous page.
[Learn more](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint)

### First Contentful Paint

Use enum `EventType.TimeToFirstContentfulPaint`

The time until the browser renders the first bit of content from the DOM.
[Learn more](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint)

### DOM Content Loaded

Use enum `EventType.DomContentLoaded`

The time until the DOM has been entirely loaded and parsed.
[Learn more](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)

### First Input Delay

Use enum `EventType.FirstInputDelay`

The time from when a user first interacts with your site to the time when the browser is able to respond to that interaction.
[Learn more](https://developers.google.com/web/updates/2018/05/first-input-delay)

### Load Event

Use enum `EventType.Load`

The time until the DOM and all its styles and synchronous scripts have loaded.
[Learn more](https://developer.mozilla.org/en-US/docs/Web/Events/load)

## Navigation Events

### Long Task

Use enum `EventType.LongTask`

Any task that take 50 milliseconds or more.
[Learn more](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming)

### Script Download Event

Use enum `EventType.ScriptDownload`

The time spent downloading a script resource.

### Style Download Event

Use enum `EventType.StyleDownload`

The time spent downloading a style resource.

### GraphQL Event

Use enum `EventType.GraphQL`

The time spent resolving GraphQL queries during the navigation.

This metric needs to be manually set up in Apollo Client.
The setup can be done as a [ApolloLink](https://www.apollographql.com/docs/link/).

```tsx
import {Performance, EventType} from '@shopify/performance';

const performance = new Performance();

const performanceLink = new ApolloLink((operation, forward) => {
  if (forward == null) {
    return null;
  }

  const start = now();

  function logOperation(result: FetchResult | Error) {
    const end = now();
    const duration = end - start;
    const success =
      result != null && !(result instanceof Error) && result.data != null;

    performance.event({
      type: EventType.GraphQL,
      start,
      duration,
      metadata: {
        name: operation.operationName,
        success,
      },
    });
  }

  return new Observable(observer => {
    return forward(operation).subscribe({
      complete: observer.complete.bind(observer),
      next(result) {
        logOperation(result);
        observer.next(result);
      },
      error(error) {
        logOperation(error);
        observer.error(error);
      },
    });
  });
});
```

### Usable Event

Use enum `EventType.Usable`

The time between navigation start and the first time a [`@shopify/react-performance`](../../react-performance)'s `<PerformanceMark stage="usable" />` component is rendered.
