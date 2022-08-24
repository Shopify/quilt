# Changelog

## 5.0.2

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - graphql-typed@2.0.1

## 5.0.1 - 2022-05-19

### Fixed

- Fix importing `graphql-mini-transforms/webpack-loader` failing to import. `webpack-loader` and `webpack` both import the same thing, for backwards compatability reasons. `webpack-loader` should be preferred name going forwards, to match preferred historic usage. [[#2284](https://github.com/Shopify/quilt/pull/2284)]

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.1.0 - 2022-04-25

### Changed

- Use Jest v28 transform format [#2243](https://github.com/Shopify/quilt/pull/2243)

## 4.0.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.0.4 - 2022-03-07

### Changed

- Export cjs by default for `webpack`, `jest`, and `jest-simple`. [[#2193](https://github.com/Shopify/quilt/pull/2193)]

## 4.0.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.0.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.0.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.0.0 - 2021-12-01

### Breaking Change

- Added support for webpack 5 and removed support for webpack 4 [[#2013](https://github.com/Shopify/quilt/pull/2013)]

## 3.2.2 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.2.1 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.2.0 - 2021-08-26

### Changed

- Support for `graphql`@`15.x`. [[#1978](https://github.com/Shopify/quilt/pull/1978)]

## 3.1.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.1.3 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 3.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.1.0 - 2021-06-22

### Changed

- Update supported `jest` version to `27`. [#1945](https://github.com/Shopify/quilt/pull/1945)

## 3.0.2 - 2021-06-17

### Changed

- Update `fs-extra` to `^9.1.0` and `@types/fs-extra` to `^9.0.11` [#1946](https://github.com/Shopify/quilt/pull/1946)

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.0.3 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.0.2 - 2021-03-23

### Changed

- Updated `jest` and `jest-simple` to not rely on cjs-only concepts [[#1788](https://github.com/Shopify/quilt/pull/1788)]

## 2.0.1 - 2021-03-16

### Changed

- Updated `jest` and `jest-simple` to be compatible with jest [[#1787](https://github.com/Shopify/quilt/pull/1787)]

## 2.0.0 - 2021-03-11

### Changed

- Renamed `webpack` entry point to `webpack-loader`

- Move from graphql-tools-web repo to quilt

## 1.3.0 - 2021-02-24

### Added

- Update dependencies (`jest`) to `26` [[#133](https://github.com/Shopify/graphql-tools-web/pull/133)]

## 1.2.0 - 2020-04-27

### Added

- Added a new `{simple: true}` option to the `graphql-mini-transforms/webpack` loader to produce GraphQL exports without any AST [[#114](https://github.com/Shopify/graphql-tools-web/pull/114)]
- Added a new `graphql-mini-transforms/jest-simple` transformer that produces the same shape as the webpack loader’s `simple` option [[#114](https://github.com/Shopify/graphql-tools-web/pull/114)]

## 1.1.0 - 2020-04-14

### Changed

- Update dependencies (`@types/webpack`) [[#110](https://github.com/Shopify/graphql-tools-web/pull/110)]
- Upgrade fs-extra to v9 [[#105](https://github.com/Shopify/graphql-tools-web/pull/105)]
- Upgrade prettier to `v2.0.4` and change `eslint-plugin-shopify` to `@shopify/eslint-plugin` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]
- Upgrade graphql to `v14.6.0` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]

## 1.0.3 - 2019-04-29

- Fixed issues with the Jest loader ([#81](https://github.com/Shopify/graphql-tools-web/pull/81))

## 1.0.2 - 2019-04-29

- Fixed issues with the Webpack loader when a document had one or more imports ([#80](https://github.com/Shopify/graphql-tools-web/pull/80))

## 1.0.0 - 2019-04-09

Initial release
