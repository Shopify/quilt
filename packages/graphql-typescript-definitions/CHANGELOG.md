# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 1.0.0 - 2021-05-07

### Breaking Change

- Update `graphql-config` to version 3. Update `graphql-config-utilities`. [#1883](https://github.com/Shopify/quilt/pull/1883)

## 0.24.0 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

### Added

- Minor: `Builder.run` now accepts an optional `graphQLFilesystem` property. Custom filesystems _must_ provide watch/glob functionality mandated by [`GraphQLFileSystem`](./src/filesystem/graphql-filesystem.ts) [[#1824](https://github.com/Shopify/quilt/pull/1824)]
- Minor: `AbstractGraphQLFileSystem` provides emitter boilerplate for `GraphQLFileSystem`'s `change:schema` / `change:document` / `delete:document` events [[#1824](https://github.com/Shopify/quilt/pull/1824)]

## 0.23.2 - 2021-03-23

### Fixed

- Fix `graphql-typescript-definitions` binary not running [[#1798](https://github.com/Shopify/quilt/pull/1798)]

## 0.23.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt

## 0.21.2 - 2021-02-18

- Ensure we add an `export {}` to otherwise blank files to make it clear that they are in the es modules format [[#131](https://github.com/Shopify/graphql-tools-web/pull/131)]

## 0.21.0 - 2020-06-15

- Allow custom scalars that alias built-in types [[#90](https://github.com/Shopify/graphql-tools-web/pull/90)] (thanks [ryanw](https://github.com/ryanw)!)

## 0.20.3 - 2020-06-03

### Fixed

- generated types `index.ts` file now emits all imports before exports [[#118](https://github.com/Shopify/graphql-tools-web/pull/118)]

## 0.20.1 - 2020-04-28

### Fixed

- Fixed `Builder` not respecting the `exportFormat` option.

## 0.20.0 - 2020-04-27

### Added

- Added a new `exportFormat` option to control the type of documents exported from `.graphql` files [[#114](https://github.com/Shopify/graphql-tools-web/pull/114)]

## 0.19.0 - 2020-04-14

### Changed

- Upgrade yargs to `15` [[#107](https://github.com/Shopify/graphql-tools-web/pull/107)]
- Update dependencies (`chalk`, `change-case`, `chokidar`, `upper-case-first`) [[#110](https://github.com/Shopify/graphql-tools-web/pull/110)]
- Upgrade fs-extra to v9 [[#105](https://github.com/Shopify/graphql-tools-web/pull/105)]
- Upgrade prettier to `v2.0.4` and change `eslint-plugin-shopify` to `@shopify/eslint-plugin` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]
- Upgrade graphql to `v14.6.0` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]

## 0.18.0 - 2019-10-09

### Changed

- duplicate checks now include fragments [[#88](https://github.com/Shopify/graphql-tools-web/pull/88)]

## 0.17.0 - 2019-04-01

- Added a `--config` option to allow a JSON-serialized config an an alternative to looking up a `.graphqlconfig` [[#70](https://github.com/Shopify/graphql-tools-web/pull/70), thanks to [alexkirsz](https://github.com/alexkirsz)]

## 0.16.0 - 2019-03-11

### Changed

- Upgrading `graphql` to `^14.0.0` (`14.1.1`) [[#72](https://github.com/Shopify/graphql-tools-web/pull/72)]

## 0.15.1 - 2019-01-22

### Fixed

- Using static utility functions from `graphql-tool-utilities` instead of `GraphQLProject` augmentations to prevent `TypeError: project.resolveSchemaPath is not a function` when a duplicate `graphql` packages exist in the node package dependency chain. [[#73](https://github.com/Shopify/graphql-tools-web/pull/73)]

## 0.15.0 - 2019-01-22

### Added

- You can now pass a `--custom-scalars` flag (or the equivalent `customScalars` option in Node.js) to reference custom types that should be used for custom scalars in GraphQL [[#63](https://github.com/Shopify/graphql-tools-web/pull/63)]

### Changed

- The library now generates an `Other` type for union/ intersection fields, even when the type is "fully covered" [[#64](https://github.com/Shopify/graphql-tools-web/pull/64)]. Before, if there were only a single type that implemented the union or interface, it was generated without being postfixed with the implementing type's name, and without an `Other` type. If all implementing types were queried in some way, it would include the types with postfixed names, but would not include an `Other` type.

  This can be a breaking change if you were querying fields where only a single type implemented a union or interface, as the types for these fields will have their names changed. For example, given the following schema:

  ```graphql
  type Ball = {
    color: String!
  }

  union Object = Ball

  type Query = {
    object: Object
  }
  ```

  And this query:

  ```graphql
  query BallQuery {
    object {
      ... on Ball {
        color
      }
    }
  }
  ```

  The library used to generate a type `BallQueryData.Object` with `{color: string}`, because `Ball` was the only implementing type. Now, the library will generate a `BallQueryData.ObjectBall` and a `BallQueryData.ObjectOther`, which represents future implementing types of `Object`. When a `__typename` field is added, either explicitly or with the `--add-typename` flag, the `Other` type has a `__typename: ''` definition, which allows you to disambiguate it from results that did query a member of the union or interface.
