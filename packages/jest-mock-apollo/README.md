# `@shopify/jest-mock-apollo`

[![CircleCI](https://circleci.com/gh/Shopify/quilt.svg?style=svg&circle-token=8dafbec2d33dcb489dfce1e82ed37c271b26aeba)](https://circleci.com/gh/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo)

Jest + Enzyme mocks for Apollo 2.x.

## Installation

```bash
$ yarn add @shopify/jest-mock-apollo
```

## Setup

This package provides a method, `registerSchema`, which should be called in the jest `setup` file. For example:

```ts
registerSchema({
  schemaBuildPath: './fixtures/schema.graphql',
  unionOrIntersectionTypes,
});
```

this will ensure that more useful error messages are shown and that mocks are validated against the schema.

## Example Usage

Take a look at the test suite for examples on how to use enzyme's mock context.

## API Reference

See the comments and TypeScript annotations in the code for details on the provided utilities.
