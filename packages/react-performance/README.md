# `@shopify/react-performance`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-performance.svg)](https://badge.fury.io/js/%40shopify%2Freact-performance.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-performance.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-performance.svg)

Primitives to measure your React application's performance using `@shopify/performance`.

## Table of Contents

- [Quick-start](#quick-start)

  - [Install the package](#install-the-package)
  - [Track some stats](#track-some-stats)
  - [Display real-time navigation data](#display-real-time-navigation-data)
  - [Send report data to a server](#send-report-data-to-a-server)
  - [Process report data and forward it to StatsD](#process-report-data-and-forward-it-to-statsd)

- [API](#api)
  - [Hooks](#hooks)
  - [Components](#components)
  - [Other](#other)

## Quick-start

### Install the package

First we will need to install the npm package.

```bash
$ yarn add @shopify/react-performance
```

### Track some stats

The `@shopify/react-performance` library automatically handles creating a shared `Performance` instance (from [`@shopify/performance`](../performance)) for you when it is imported. This `Performance` instance automatically wraps the browser's built in performance and connection information and calculates some basic page-load stats. As long as we import `@shopify/react-performance` somewhere in our app the instance will be there for us.

That said, we will need to add some calls to the `usePerformanceMark` hook to our application in order to help `@shopify/react-performance` determine when a page is fully loaded and React has finished mounting components.

```tsx
//Cats.tsx
import React from 'react';
import {usePerformanceMark, Stage} from '@shopify/react-performance';

// Represents an entire page of our application
export function Cats() {
  // Tell the @shopify/react-performance the page is completely loaded
  usePerformanceMark(Stage.Complete, 'cats');

  return 'Kokusho, Moe, The Dude';
}
```

**note:** In production apps, it is important to always have one `usePerformanceMark` on each page level component. Otherwise, client-side navigations may not be recorded properly. When `usePerformanceMark` calls are omitted in some pages but not others, it is common to see strange results such as:

- Navigation data which makes it look like some page takes infinitely long to load
- Navigation data in which some page sometimes randomly takes several times longer than usual
- Missing data for a particular page

### Display real-time navigation data

To demonstrate the data we have so far, we'll create a component called `LastNavigationDetails` and use it to display some basic data about our app's performance.

```tsx
// LastNavigationDetails.tsx
import React, {useState} from 'react';
import {useNavigationListener, Navigation} from '@shopify/react-performance';

// A component which displays simple performance stats about the last navigation performed by the user
export function LastNavigationDetails() {
  // create some state to hold the last navigation
  const [lastNavigation, setLastNavigation] = useState<Navigation | null>(null);

  // listen for subsequent client-side navigations and update our state
  useNavigationListener(navigation => {
    setLastNavigation(navigation);
  });

  if (lastNavigation == null) {
    return <p>no data</p>;
  }

  const {duration, isFullPageNavigation, target} = lastNavigation;

  // output some information about the last navigation
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

We can render this component anywhere in our application, but lets do so in our top level App component.

```tsx
// App.tsx

import React from 'react';
import {PerformanceMark} from '@shopify/react-performance';
// our component from above which calls `useNavigationListener`
import {LastNavigationDetails} from './LastNavigationDetails';
// our component from above which calls usePerformanceMark
import {Cats} from './Cats';

// the top level component of our application
function App() {
  return (
    <>
      {/* render our LastNavigationDetails component to give devs some useful stats */}
      <LastNavigationDetails />
      {/* render the "Cats" page */}
      <Cats />
    </>
  );
}
```

Now our developers will have access to up-to-date information about how long initial page-loads and incremental navigations take to complete without needing to open their devtools or dig into DOM APIs manually.

### Send report data to a server

Performance metrics data is only truly useful when it can be aggregated and used to make smart optimization decisions or warn you when your app is beginning to become slow. To aggregate such data you'll need to be able to send it to a server. `@shopify/react-performance` provides the `usePerformanceReport` hook to facilitate this.

```tsx
// App.tsx

import React from 'react';
import {
  PerformanceMark,
  usePerformanceReport,
} from '@shopify/react-performance';

/**
 *  The top level component of our application, it should handle rendering all top level providers and determining what pages to render
 */
function App() {
  // send a performance report to `/performance_report`
  usePerformanceReport('/performance_report');

  return <>{/* rest of the app */}</>;
}
```

Assuming our App sets up some `<PerformanceMark />` components, our code will send a performance report to the `/performance_report` url as JSON. Generally, the easiest way to set up a server to make use of the reported data is to use one of our server-side companion libraries.

### Process report data and forward it to StatsD

#### Using Node (`@shopify/koa-performance`)

For Node services based on `Koa`, we provide [@shopify/koa-performance](https://www.npmjs.com/package/@shopify/koa-performance) to parse `PerformanceReport` payloads and send them forward to a [StatsD](https://github.com/statsd/statsd) endpoint as `distribution`s.

#### Using Rails (`quilt_rails`)

For Rails services we provide [quilt_rails](https://github.com/Shopify/quilt/tree/master/gems/quilt_rails#performance-tracking-a-react-app)'s `Quilt::Performance::Reportable` mixin for parsing `PerformanceReport` payloads and sending them forward to a [StatsD](https://github.com/statsd/statsd) endpoint as `distribution`s.

## API

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

A component which takes a `stage` and an `id` and uses them to generate a tag for a call to `window.performance.mark`. This can be used to mark specialized moments in your applications startup, or a specific interaction.

```tsx
import React from 'react';
import {usePerformanceMark} from '@shopify/react-performance';

function SomeComponent() {
  usePerformanceMark('some-stage', 'some-id');

  return <div>something</div>;
}
```

##### Special `stage` values

Though you can use `usePerformanceMark` with any arbitrary string passed as the `stage` parameter, two special values exist with predetermined meanings and extra side-effects. These values are contained in the `Stage` enum.

- `Stage.Usable`: Marks the page _usable_ using `performance.usable()`. A page should be considered `usable` when the bare-minimum of functionality is present. Usually this just means when the React application has mounted the page, but the application is still waiting on some asynchronous data.
- `Stage.Complete`: Marks the page _complete_ using `performance.finish()`. A page should be considered `complete` when all data is fetched and the page is fully rendered.

For page level components, you should always have _at least_ a `usePerformanceMark` call with a `stage` of `Stage.Complete`.

```tsx
import React from 'react';
import {usePerformanceMark, Stage} from '@shopify/react-performance';

function CatsPage() {
  // mark the component as complete immediately upon rendering
  usePerformanceMark(Stage.Complete, 'ProductPage');

  return 'Kokusho, Moe, Smoky, Mama Cat';
}
```

In a more complex application with calls for remote data or other asynchronous work which blocks some portion of the tree from rendering it is common to need more granular data about the lifecycle of a page load. To gather this data we can make the `stage` parameter we pass to `usePerformanceMark` dynamic, and give it `complete` only when data has loaded.

```tsx
// ProductPage.tsx

import React, {useState, useEffect} from 'react';
import {usePerformanceMark, Stage} from '@shopify/react-performance';
import {useRemoteKitties} from './hooks';

export function CatsPage() {
  // get some data from a remote API
  const {data, error} = useRemoteKitties();
  // we consider the page complete when we have either our data, or the call for data has returned an error.
  const stage = data || error ? Stage.Complete : Stage.Usable;
  usePerformanceMark(stage, 'CatsPage');

  return data || error;
}
```

#### usePerformanceReport

A custom hook which takes a url and sends a detailed breakdown of all navigations and events which took place while the page was loading. This hook should generally only be used once at the top of your component tree.

```tsx
// App.tsx
import React from 'react';
import {usePerformanceReport} from '@shopify/react-performance';
import {ProductPage} from './ProductPage';

function App() {
  usePerformanceReport('/performance-report');
  return <ProductPage />;
}
```

To get sensical data, applications using `usePerformanceReport` should be sure to have at least one performance mark on each top level page.

##### Segmenting by user locale

`usePerformanceReport` accepts a `locale` property that will be associated with all events.

```tsx
// App.tsx
import React from 'react';
import {usePerformanceReport} from '@shopify/react-performance';
import {ProductPage} from './ProductPage';

function App() {
  usePerformanceReport('/performance-report', {locale: navigator.language});
  return <ProductPage />;
}
```

### Components

This library also provides the following component implementations of the above hooks:

- `<NavigationListener />`, the component version of `useNavigationListener`
- `<LifecycleEventListener />`, the component version of `useLifecycleEventListener`
- `<PerformanceReport />`, the component version of `usePerformanceReport`
- `<PerformanceMark />`, the component version of `usePerformanceMark`

The components are provided primarily for backwards compatibility, and the hook implementations should be preferred.

### Other

This package also re-exports all of the API from [`@shopify/performance`](../performance/README.md).
