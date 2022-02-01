# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## Unreleased

### Changed

- Load a single locale of faker (en) instead of loading all locales. [[#2152](https://github.com/Shopify/quilt/pull/2152)]

## 1.2.3 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 1.2.2 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 1.2.1 - 2022-01-26

### Changed

- Replace deprecated faker.random.boolean with faker.datatype.boolean [[#2140](https://github.com/Shopify/quilt/pull/2140)]

## 1.2.0 - 2022-01-19

### Changed

- Switches `faker` library to `@faker-js/faker` and upgrades to version `5.5.3` [[#2132](https://github.com/Shopify/quilt/pull/2132)]

## 1.1.5 - 2021-11-24

### Changed

- Adjusted DeepThunk type in response to breaking changes in Typescript 4.5 [[#2087](https://github.com/Shopify/quilt/pull/2087)]

## 1.1.4 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 1.1.3 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.1.2 - 2021-09-03

### Changed

- Update `graphql-typed` range. [[#2027](https://github.com/Shopify/quilt/pull/2027)]

## 1.1.1 - 2021-08-30

- No updates. Transitive dependency bump.

## 1.1.0 - 2021-08-26

### Changed

- Support for `graphql`@`15.x`. [[#1978](https://github.com/Shopify/quilt/pull/1978)]

## 1.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.11.2 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.11.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt
