# `@shopify/react-performance`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-performance.svg)](https://badge.fury.io/js/%40shopify%2Freact-performance.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-performance.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-performance.svg)

Primitives to measure your React application's performance using `@shopify/performance`

## Installation

```bash
$ yarn add @shopify/react-performance
```

## Quick-start

### Basic

The most basic way to use the tools in this package is to record information and display it locally to the user. In practice you usually only want to do this in development so that developers can easily see performance information.

#### Add the context provider

Before we can use any of the components or hooks in the package we must wrap our app tree with the `PerformanceContext.Provider` component.

```tsx
// App.tsx
import React from 'react';
import {Performance, PerformanceContext} from '@shopify/react-performance';

// in a Server-Side-Rendering enabled app you will likely only want to instantiate this if `document` is defined.
const performance = new Performance();

function App() {
  return (
    <PerformanceContext.Provider value={performance}>
      {/* The rest of your app */}
    </PerformanceContext.Provider>
  );
}
```

#### Display data using NavigationListener

Now that we have access to `PerformanceContext` we can use the other components and hooks offered by `@shopify/react-performance` anywhere in our tree. To demonstrate, we'll create a component called `LastNavigationDetails` and use it to display some basic data about our app's performance.

```tsx
// LastNavigationDetails.tsx
import React, {useState} from 'react';
import {useNavigationListener, Navigation} from '@shopify/react-performance';

export function LastNavigationDetails() {
  const [lastNavigation, setLastNavigation] = useState<Navigation | null>(null);

  useNavigationListener(navigation => {
    setLastNavigation(navigation);
  });

  if (lastNavigation == null) {
    return <p>no data</p>;
  }

  const {duration, isFullPageNavigation, target};
  const navigationType = isFullPageNavigation
    ? 'full page navigation'
    : 'single-page-app style navigation';
  return (
    <p>
      The last navigation was to {target}. It was a {navigationType} navigation
      which took {duration / 1000} seconds to complete.
    </p>
  );
}
```

We can render this component anywhere in our tree, but lets do so in our App component from earlier.

```tsx
// App.tsx
import React from 'react';
import {Performance, PerformanceContext} from '@shopify/react-performance';
import {LastNavigationDetails} from './LastNavigationDetails';

// in a Server-Side-Rendering enabled app you will likely only want to instantiate this if `document` is defined.
const performance = new Performance();

function App() {
  return (
    <PerformanceContext.Provider value={performance}>
      {/* The rest of your app */}
      <LastNavigationDetails />
    </PerformanceContext.Provider>
  );
}
```

Now our developers will have access to up-to-date information about how long initial page-loads and incremental navigations take to complete without needing to open their devtools or dig into DOM APIs manually.

### Reporting data to the server

Performance metrics data is most useful when it can be aggregated and used to make smart optimization decisions or warn you when your app is beginning to become slow. To aggregate such data you'll need to be able to send it to a server. `@shopify/react-performance` provides the `PerformanceReport` component to facilitate this.

> This section is a work in progress. It will be filled out as helper libraries for marshalling data on the server are added to Quilt.

## API

Most APIs provided by this package are available as both hooks (ie. `useNavigationListener`), as well as components (ie. `<NavigationListener />`).

This package also re-exports all of the API of [`@shopify/performance`](https://www.npmjs.com/package/@shopify/performance).

### Hooks

#### useLifecycleEventListener

A custom hook which takes in callback to invoke whenever the `Performance` context object emits a lifecycleEvent.

```tsx
import {useLifecycleEventListener} from '@shopify/react-performance';

function SomeComponent() {
  useLifecycleEventListener(event => {
    console.log(event);
  });

  return <div>something</div>;
}
```

#### useNavigationListener

A custom hook which takes in a callback to invoke whenever a navigation takes place, whether it is a full-page load (such as the result of `location.assign`) or an incrmental load (such as the result of `router.push` in a ReactRouter app).

```tsx
import {useNavigationListener} from '@shopify/react-performance';

function SomeComponent() {
  useNavigationListener(navigation => {
    console.log(navigation);
  });

  return <div>something</div>;
}
```

#### usePerformanceMark

A custom hook which takes an `id` and `stage` and uses them to generate a tag for a call to `window.performance.mark` when the component is mounted. This can be used to mark specialized moments in your applications startup, or a specific interaction.

```tsx
import React from 'react';
import {usePerformanceMark} from '@shopify/react-performance';

function SomeComponent() {
  usePerformanceMark('some-stage', 'some-id');

  return <div>something</div>;
}
```

If the hook is called with a `stage` of `usable` or `complete`, it also calls the appropriate method on the `Performance` object from context, allowing you to trigger the `finish` and `usable` lifecycleEvents based on a particular component mounting.

```tsx
import React from 'react';
import {usePerformanceMark} from '@shopify/react-performance';

function ProductPage() {
  // this will call `performance.finish()` on the Performance object in context
  usePerformanceMark('complete', 'products');

  return <div>cool product page</div>;
}
```

#### usePerformanceReport

> Todo

### Components

#### LifecycleEventListener

A component which takes in an `onEvent` callback as a prop. This callback is invoked whenever the `Performance` context object emits a lifecycleEvent.

```tsx
import React from 'react';
import {LifecycleEventListener} from '@shopify/react-performance';

function SomeComponent() {
  return (
    <>
      <LifecycleEventListener onEvent={event => console.log(event)} />
      <div>something</div>
    </>
  );
}
```

#### NavigationListener

A component which takes in an `onNavigation` callback as a prop. This callback is invoked whenever the `Performance` context reports a navigation.

```tsx
import React from 'react';
import {NavigationListener} from '@shopify/react-performance';

function SomeComponent() {
  return (
    <>
      <NavigationListener
        onNavigation={navigation => console.log(navigation)}
      />
      <div>something</div>
    </>
  );
}
```

#### PerformanceMark

A componenr which takes both `id` and `stage` props and uses them to generate a tag for a call to `window.performance.mark` when it is mounted. This can be used to mark specialized moments in your applications startup, or a specific interaction.

```tsx
import React from 'react';
import {PerformanceMark} from '@shopify/react-performance';

function SomeComponent() {
  return (
    <>
      <PerformanceMark stage="some-stage" id="some-id" />
      <div>something</div>
    </>
  );
}
```

If the hook is called with a `stage` of `usable` or `complete`, it also calls the appropriate method on the `Performance` object from context, allowing you to trigger the `finish` and `usable` lifecycleEvents based on a particular component mounting.

```tsx
import React from 'react';
import {PerformanceMark} from '@shopify/react-performance';

function ProductPage() {
  import React from 'react';
  import {PerformanceMark} from '@shopify/react-performance';

  function ProductPage() {
    return (
      <>
        <PerformanceMark stage="usable" id="ProductPage" />
        <div>Some cool product page</div>
      </>
    );
  }
}
```

#### PerformanceContext

A vanilla `React.createContext` object to provide a `Performance` class through your application's tree.

#### PerformanceReport

> Todo
