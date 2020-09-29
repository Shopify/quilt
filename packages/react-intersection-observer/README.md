# `@shopify/react-intersection-observer`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-intersection-observer.svg)](https://badge.fury.io/js/%40shopify%2Freact-intersection-observer.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-intersection-observer.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-intersection-observer.svg)

A React wrapper around the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## Installation

```bash
$ yarn add @shopify/react-intersection-observer
```

## Usage

### `useIntersection(options: Options)`

The `useIntersection` hook takes in `IntersectionObserver` options, and returns a tuple of:

- The state of the observer.
- An object that you can pass as a `ref` to the DOM element you wish to track.

```tsx
function MyComponent() {
  const [intersection, intersectionRef] = useIntersection();

  return (
    <div ref={intersectionRef}>Intersection: {intersection.isIntersecting}</div>
  );
}
```

You can pass additional options to this hook that are used to create the underlying `IntersectionObserver`:

- `threshold`: a number or array of number indicating the `intersectionRatio` that must be met before the observer is triggered.
- `root`: a string or element that is used as the viewport for visibility testing. If a string is passed, it will be treated as a selector.
- `rootMargin`: a string representing the margins by which to shrink the root’s bounding box before computing intersections.

### `<IntersectionObserver />`

This package also exports an `IntersectionObserver` component, which is a fairly minimal component wrapper around the `useIntersection` hook, and accepts the same `threshold`, `root`, and `rootMargin` values as props. The `onIntersectionChange` prop you pass to this component will be called with an `IntersectionObserverEntry` object, which describes the state of the intersection (and is equivalent to the first value of the tuple returned from the hook).

Unlike the `useIntersection` hook, this component will create its own DOM node that will be observed, rather than requiring you to pass a `ref` to a DOM node you already control. You can customize the rendered markup by passing either of the following props:

- `children`, which will be rendered inside of the node being observed for intersections.
- `wrapperComponent`, which changes the DOM node being wrapped around those children (defaults to a `div`).

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

When `useIntersection` is passed new options (or, when `IntersectionObserver` receives new props), this library will do the minimum amount of work to unobserve/ re-observe with the new fields. The most expensive updates to make are changing `threshold`, `root`, `rootMargin`, and, in the case of the component version, `wrapperComponent`, as these require disconnecting the old observer and recreating a new one.

When a component consuming the `useIntersection` hook is unmounted, the intersection observer is disconnected. The same applies if you unmount an `IntersectionObserver` component.

### Browser support

To polyfill `IntersectionObserver`, please use the `@shopify/polyfills/intersection-observer` package.

If you do not polyfill the feature and it is not supported in the current browser, the `useIntersection` hook and the `IntersectionObserver` component will decide what to do based on the `unsupportedBehavior` option. This value should be a member of the `UnsupportedBehavior` enum (exported from this package). Currently, there are two options:

- `UnsupportedBehavior.TreatAsIntersecting`: immediately sets state/ calls `onIntersectionChange` on mount with a non-0 `intersectionRatio` (this is the default).
- `UnsupportedBehavior.Ignore`: never calls marks the intersection observer as being intersecting.
