# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 5.1.7 - 2022-02-14

### Changed

- Remove devDependency on `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 5.1.6 - 2022-02-09

- No updates. Transitive dependency bump.

## 5.1.5 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 5.1.4 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 5.1.3 - 2021-11-23

- No updates. Transitive dependency bump.

## 5.1.2 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 5.1.1 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 5.1.0 - 2021-08-26

### Changed

- Support for `graphql`@`15.x`. [[#1978](https://github.com/Shopify/quilt/pull/1978)]

## 5.0.6 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 5.0.5 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 5.0.4 - 2021-08-05

### Changed

- Add matchers entrypoint to `typesVersions` fields. This should have happened in 5.0.2 but was missed. [[#1985](https://github.com/Shopify/quilt/pull/1985)]

## 5.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 5.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 5.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 4.4.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 4.4.1 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

### Changed

- Update `jest-matcher-utils` to `26` [[#1751](https://github.com/Shopify/quilt/pull/1751)]

## 4.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 4.2.1 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 4.2.0 - 2020-06-24

### Changed

- Add subsequential request mocking support ([#1534](https://github.com/Shopify/quilt/pull/1534))

## 4.1.0 - 2020-04-20

### Changed

- Update `graphql` dependencies [[#1379](https://github.com/Shopify/quilt/pull/1379)]
- `jest.Matchers` type updated to match `@types/jest` version `25` [[#1239](https://github.com/Shopify/quilt/pull/1239)]
- Update `jest-matcher-utils` to `25` [[#1375](https://github.com/Shopify/quilt/pull/1375)]

## 4.0.9 - 2019-12-04

### Fixed

- Adding `TestingApolloClient` to fix scenarios where some `fetchPolicy` values produce React events firing outside of an `act` scope ([#1198](https://github.com/Shopify/quilt/pull/1198))

## 4.0.0 - 2019-07-03

### Changed

- Updated to respect the new asynchronous query components from the 4.x version of `@shopify/react-graphql` ([#762](https://github.com/Shopify/quilt/pull/762))

## 3.2.0 - 2019-06-27

### Added

- Allow `MockLink` to return a full GraphQLError. ([#768](https://github.com/Shopify/quilt/pull/768))

## 3.1.0 - 2019-05-22

### Added

- Added a new entry point, `@shopify/graphql-testing/matchers`, which includes a `toHavePerformedGraphQLOperation` assertion ([#706](https://github.com/Shopify/quilt/pull/706))
- Improved filtering GraphQL operations by allowing you to pass `query` or `mutation` options ([#706](https://github.com/Shopify/quilt/pull/706))

## 3.0.1 - 2019-04-02

### Changed

- Loosened version requirements for Apollo dependencies

## 3.0.0 - 2019-04-01

### Changed

- `createGraphQLFactory` is now a named export, not the default export ([#623](https://github.com/Shopify/quilt/pull/623/))
- Simplified much of the external workings of the library, including removing the custom subclass of `ApolloClient` ([#623](https://github.com/Shopify/quilt/pull/623/))

## 1.0.0

Initial release.
