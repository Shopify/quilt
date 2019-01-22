# Changelog

All notable consumer-facing changes are documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and from `v0.14.0`, this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [0.15.0] - 2019-01-22

### Added

* You can now pass a `--custom-scalars` flag (or the equivalent `customScalars` option in Node.js) to reference custom types that should be used for custom scalars in GraphQL [[#63](https://github.com/Shopify/graphql-tools-web/pull/63)]

### Changed

* The library now generates an `Other` type for union/ intersection fields, even when the type is "fully covered" [[#64](https://github.com/Shopify/graphql-tools-web/pull/64)]. Before, if there were only a single type that implemented the union or interface, it was generated without being postfixed with the implementing type's name, and without an `Other` type. If all implementing types were queried in some way, it would include the types with postfixed names, but would not include an `Other` type.

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
