# `@shopify/deferred`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fdeferred.svg)](https://badge.fury.io/js/%40shopify%2Fdeferred.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/deferred.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/deferred.svg)

A new promise along with methods to change its state.

## Installation

```bash
$ yarn add @shopify/deferred
```

## Usage

```tsx
import {Deferred} from '@shopify/deferred';

const deferred = new Deferred();
await deferred.promise;
```

Resolving with a value:

```tsx
import {Deferred} from '@shopify/deferred';

const deferred = new Deferred();
deferred.resolve(5);

const five = await deferred.promise;
```

## Promise vs. deferred

A deferred has a promise which functions as a proxy for the future result. While a promise is a value returned by an asynchronous function, a deferred can be resolved or rejected by it's caller which separates the promise from the resolver.
