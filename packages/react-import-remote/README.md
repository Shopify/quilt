# `@shopify/react-import-remote`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-import-remote.svg)](https://badge.fury.io/js/%40shopify%2Freact-import-remote.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-import-remote.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-import-remote.svg)

Asynchronous script loading for React

## Installation

```bash
$ yarn add @shopify/react-import-remote
```

## Usage

The provided utilities are intended only for external scripts that load globals. Other JavaScript should use the native `import()` operator for asynchronously loading code. These utilities cache results by source, so only a single `script` tag is ever added for a particular source.

```tsx
import * as React from 'react';
import ImportRemote from '@shopify/react-import-remote';
import {DeferTiming} from '@shopify/async';

interface RemoteGlobal {}
interface WindowWithGlobal extends Window {
  remoteGlobal: RemoteGlobal;
}

class MyComponent extends React.Component {
  ...

  render() {
    ...

    return (
      <ImportRemote
        preconnect
        source="https://some-external-service.com/global.js"
        getImport={(window: WindowWithGlobal) => window.remoteGlobal}
        onError={(error: Error) => this.setState({error})}
        onImported={(remoteGlobal: RemoteGlobal) => doSomethingWithGlobal(remoteGlobal)}
        defer={DeferTiming.Mount}
      />
    );
  }
}
```

## Interface

```ts
interface Props<Imported = any> {
  source: string;
  preconnect?: boolean;
  onError(error: Error): void;
  getImport(window: Window): Imported;
  onImported(imported: Imported): void;
  defer?: DeferTiming;
}
```

**source**

Source of the script to load the global from

**preconnect**

Generates a preconnect link tag for the source’s domain using [`@shopify/react-preconnect`](https://github.com/Shopify/quilt/tree/master/packages/react-preconnect)

**onError**

Callback that takes in `error` is called if an error occurs

**getImport**

Callback that takes in `window` with the added global and returns the global added to the `window` by the new script

**onImported**

Callback that gets called with the imported global

**defer**

A member of the `DeferTiming` enum (from `@shopify/async`) allowing the import request to wait until:

- Component mount (`DeferTiming.Mount`; this is the default)
- Browser idle (`DeferTiming.Idle`; if `window.requestIdleCallback` is not available, it will load on mount), or
- Component is in the viewport (`DeferTiming.InViewport`; if `IntersectionObserver` is not available, it will load on mount)
