# `@shopify/jest-mock-apollo`

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
