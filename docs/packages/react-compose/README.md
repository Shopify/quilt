# `@shopify/react-compose`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-compose.svg)](https://badge.fury.io/js/%40shopify%2Freact-compose) ![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-compose.svg)

Cleanly compose multiple component enhancers together with minimal fuss.

## Installation

```bash
$ yarn add @shopify/react-compose
```

## Usage

This module exports a single default function `compose`.

```ts
import compose from '@shopify/react-compose';
```

This function can be called on a list of component enhancers ([Higher Order Components](https://reactjs.org/docs/higher-order-components.html)) to return a single master component enhancer that adds all of the props from all of the enhancers you gave it.

```ts
import {withRouter} form 'react-router';
import compose from '@shopify/react-compose';
import {withMousePosition} from './mouse-position';

const enhancer = compose(
  withRouter,
  withMousePosition,
);

class SomeComponent extends React.Component {
 ...
}

// this will be the same as withRouter(withMousePosition(SomeComponent))
export default compose(withRouter, withMousePosition)(SomeComponent);
```

This enhancer will act roughly the same as calling each enhancer in turn. This can save a lot of boilerplate for cases where each enhancer comes from it's own factory with config.

```ts
// In this example each enhancer is actually a factory that takes config.
const EnhancedComponent = enhancerOne(someConfig)(
  enhancerTwo(otherConfig)(enhancerThree(moreConfig)(Component)),
);

// We can clean this up greatly using compose
const EnhancedComponent = compose(
  enhancerOne(someConfig),
  enhancerTwo(otherconfig),
  enhancerThree(moreConfig),
)(Component);
```

## Differences from other `compose` implementations

[Apollo](https://www.apollographql.com/docs/react/api/react-apollo.html#compose), [Redux](https://redux.js.org/api-reference/compose), and [Recompose](https://github.com/acdlite/recompose/blob/master/docs/API.md) also export their own `compose` function. This can be perfectly fine for many usecases, however, this implementation has some advantages (in our opinions).

### Standalone

If you are not using Apollo, Redux, or Recompose, you could still have other enhancers you want to combine. This library is only a few lines long and only depends on `hoist-non-react-statics` (with a peer-dependency on `React`), so you can relatively weightlessly add it to your project even if you are dependency light.

### Less cumbersome Typescript implementation

The Typescript definition for other `compose` functions takes a number of generic parameters equal to the number of enhancers you pass in. This means you can easily end up with something like

```ts
compose<Props & FooProps & BarProps, Props & FooProps, Props>(
  FooEnhancer,
  BarEnhancer,
)(Component);
```

which is difficult to maintain and understand. It's usually fine from a consumers perspective to just define the _output_ props for these types of statements, and the definition for `compose` from this package can be used in this scenario with significantly less type annotations.

```ts
compose<Props>(FooEnhancer, BarEnhancer)(Component);
```

### Static hoisting

Apollo's `compose` function does not hoist static members. If you want to do something like make subcomponents available as static members you would need to attach them manually to the enhanced version of the component.

With this implementation you can be sure any static properties on your classical components will be hoisted up to the wrapper Component.
