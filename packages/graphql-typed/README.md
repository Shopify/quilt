# `graphql-typed`

> A more strongly typed version of GraphQL's DocumentNode.

## Installation

```
npm install graphql-typed --save
```

or, with Yarn:

```
yarn add graphql-typed
```

## Usage

You probably don’t need to use this package explicitly. It is used internally by `graphql-typescript-definitions` and `graphql-fixtures` in order to include typing information about an operation in its `DocumentNode`. This allows for better type feedback when using `createFiller` in `graphql-fixtures`.
