# `@shopify/react-intersection-observer`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-intersection-observer.svg)](https://badge.fury.io/js/%40shopify%2Freact-intersection-observer.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-intersection-observer.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-intersection-observer.svg)

A React wrapper around the [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## Installation

```bash
$ yarn add @shopify/react-intersection-observer
```

## Usage

This package exports an `IntersectionObserver` component. This component will create its own DOM node that will be observed, with optional `onIntersecting` and `onNotIntersecting` props being called as appropriate. `onIntersecting` and `onNotIntersecting` will be called with an `IntersectionObserverEntry` object, which describes the state of the intersection. The component also accepts a few additional props that correspond to the options used to construct an `IntersectionObserver`:

- `threshold`: a number or array of number indicating the `intersectionRatio` that must be met before the observer is triggered
- `root`: a string or element that is used as the viewport for visibility testing. If a string is passed, it will be treated as a selector.
- `rootMargin`: a string representing the margins by which to shrink the root’s bounding box before computing intersections.

This component also allows you to customize the rendered markup. You can pass `children`, which will be rendered inside of the node being observed for intersections. You can also pass a `wrapperComponent` prop that changes the DOM node being wrapped around those children (defaults to a `div`). Regardless of the passed `wrapperComponent`, the `IntersectionObserver` component will always add a `display: contents` style to that node in order to reduce the styling impact of the additional nesting.

```tsx
<div ref={this.parentElement}>
  <IntersectionObserver
    root={this.parentElement.current}
    rootMargin="10px 10%"
    threshold={1}
    onIntersecting={entry => console.log('intersectionRatio > 0', entry)}
    onNotIntersecting={entry => console.log('intersectionRatio = 0', entry)}
  />
</div>
```

### Lifecycle

You may change any prop on an `IntersectionObserver` component, and the component will do the minimum amount of work to unobserve/ re-observe with the new fields. The most expensive updates to make are changing `threshold`, `root`, `rootMargin`, and `wrapperComponent`, as these require disconnecting the old observer and recreating a new one.

When this component is unmounted, it disconnects the current observer.

### Browser support

To polyfill `IntersectionObserver`, please use the `@shopify/polyfills/intersection-observer` package.

If you do not polyfill the feature and it is not supported in the current browser, the `IntersectionObserver` component will decide what to do based on the `unsupportedBehavior` prop. This prop should be a member of the `UnsupportedBehavior` enum (exported from this package). Currently, there are two options:

- `UnsupportedBehavior.TreatAsIntersecting`: immediately calls `onIntersecting` on mount, if it is provided (this is the default).
- `UnsupportedBehavior.Ignore`: never calls `onIntersecting` or `onNotIntersecting`.
