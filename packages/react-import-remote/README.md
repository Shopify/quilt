# `@shopify/react-import-remote`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-import-remote.svg)](https://badge.fury.io/js/%40shopify%2Freact-import-remote.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-import-remote.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-import-remote.svg)

Asynchronous script loading for React.

## Installation

```bash
$ yarn add @shopify/react-import-remote
```

## Usage

The package provides a hook and component that are intended for loading external scripts. These utilities cache results by source, so only a single `script` tag is ever added for a particular source.

### useImportRemote()

```tsx
import React from 'react';
import {useImportRemote, Status} from '@shopify/react-import-remote';
import {DeferTiming} from '@shopify/async';

function MyComponent() {
  const {result} = useImportRemote(
    'https://some-external-service.com/global.js',
  );

  if (result.status === Status.Failed) {
    // do something with error result
  }

  if (result.status === Status.Complete) {
    // do something with successful result
  }

  return null;
}
```

### <ImportRemote />

```tsx
import React from 'react';
import ImportRemote from '@shopify/react-import-remote';
import {DeferTiming} from '@shopify/async';

interface RemoteGlobal {}
interface WindowWithGlobal extends Window {
  remoteGlobal: RemoteGlobal;
}

function MyComponent() {
  return (
    <ImportRemote
      preconnect
      source="https://some-external-service.com/global.js"
      getImport={}
      onImported={(result: RemoteGlobal | Error) => {
        if (result instanceof Error) {
          // do something with error result
        }

        // do something with successful result
      }}
      defer={DeferTiming.Mount}
    />
  );
}
```

**source**

Source of the script to load the global from

**preconnect**

Generates a preconnect link tag for the source’s domain using `<Preconnect />` component from [`@shopify/react-html`](../react-html)

**getImport**

Callback that takes in `window` with the added global and returns the global added to the `window` by the new script

**onImported**

Callback that gets called with the imported global or an `error` if one occurs

**defer**

A member of the `DeferTiming` enum (from `@shopify/async`) allowing the import request to wait until:

- Component mount (`DeferTiming.Mount`; this is the default)
- Browser idle (`DeferTiming.Idle`; if `window.requestIdleCallback` is not available, it will load on mount), or
- Component is in the viewport (`DeferTiming.InViewport`; if `IntersectionObserver` is not available, it will load on mount)

Note, changing any of these values while rendering will cancel the import.
