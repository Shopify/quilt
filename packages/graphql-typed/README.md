# `graphql-typed`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/graphql-typed.svg)](https://badge.fury.io/js/graphql-typed.svg)

A more strongly typed version of GraphQL's DocumentNode.

## Installation

```bash
$ yarn add graphql-typed
```

## Usage

You probably don’t need to use this package explicitly. It is used internally by `graphql-typescript-definitions` and `graphql-fixtures` in order to include typing information about an operation in its `DocumentNode`. This allows for better type feedback when using `createFiller` in `graphql-fixtures`.
