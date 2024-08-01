# Changelog

## 5.7.1

### Patch Changes

- [#2815](https://github.com/Shopify/quilt/pull/2815) [`accab3a`](https://github.com/Shopify/quilt/commit/accab3ae3b1a5f7d729e83825c17f8acc1efa736) Thanks [@BPScott](https://github.com/BPScott)! - Fix typing of "enforce" in vite transform

## 5.7.0

### Minor Changes

- [#2791](https://github.com/Shopify/quilt/pull/2791) [`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892) Thanks [@vsumner](https://github.com/vsumner)! - Update typescript, eslint, and prettier

### Patch Changes

- Updated dependencies [[`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892)]:
  - graphql-typed@2.3.0

## 5.6.0

### Minor Changes

- [#2789](https://github.com/Shopify/quilt/pull/2789) [`bdebd9197`](https://github.com/Shopify/quilt/commit/bdebd919729fa9f2145aa7003395316081afadef) Thanks [@lemonmade](https://github.com/lemonmade)! - Add `type` field to `SimpleDocument` type

### Patch Changes

- Updated dependencies [[`bdebd9197`](https://github.com/Shopify/quilt/commit/bdebd919729fa9f2145aa7003395316081afadef)]:
  - graphql-typed@2.2.0

## 5.5.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

### Patch Changes

- Updated dependencies [[`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece)]:
  - graphql-typed@2.1.0

## 5.4.0

### Minor Changes

- [#2783](https://github.com/Shopify/quilt/pull/2783) [`ae1adc100`](https://github.com/Shopify/quilt/commit/ae1adc100d3ad846473f61fd497f789bb0595c5a) Thanks [@lemonmade](https://github.com/lemonmade)! - Add support for omitting GraphQL source text

## 5.3.5

### Patch Changes

- [#2778](https://github.com/Shopify/quilt/pull/2778) [`12f780698`](https://github.com/Shopify/quilt/commit/12f7806982f7b0b890792e9d389cbf6055a68362) Thanks [@BPScott](https://github.com/BPScott)! - Add graphql `^16.0.0` as an allowable graphql dependency version

- Updated dependencies [[`12f780698`](https://github.com/Shopify/quilt/commit/12f7806982f7b0b890792e9d389cbf6055a68362)]:
  - graphql-typed@2.0.3

## 5.3.4

### Patch Changes

- [#2767](https://github.com/Shopify/quilt/pull/2767) [`957132820`](https://github.com/Shopify/quilt/commit/9571328209ef77c247f957c68f63eb5c1c971a86) Thanks [@BPScott](https://github.com/BPScott)! - Allow rollup ^4.0.0 as a peer dependency

## 5.3.3

### Patch Changes

- [#2760](https://github.com/Shopify/quilt/pull/2760) [`6efb94586`](https://github.com/Shopify/quilt/commit/6efb94586f4d85553606e24184aa790518fece7c) Thanks [@ryanwilsonperkin](https://github.com/ryanwilsonperkin)! - Prevent bad cache entry for jest and jest-simple transforms referencing stale node_modules paths

## 5.3.2

### Patch Changes

- [#2692](https://github.com/Shopify/quilt/pull/2692) [`762a27333`](https://github.com/Shopify/quilt/commit/762a273337cb2d55633c379c6bd6deb760d73366) Thanks [@vsumner](https://github.com/vsumner)! - Update rollup plugin to ignore sourcemaps to prevent build warnings

## 5.3.1

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

- Updated dependencies [[`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86)]:
  - graphql-typed@2.0.2

## 5.3.0

### Minor Changes

- [#2597](https://github.com/Shopify/quilt/pull/2597) [`3fdf54a64`](https://github.com/Shopify/quilt/commit/3fdf54a64f1fd500586e5b3e613f780e49582354) Thanks [@lemonmade](https://github.com/lemonmade)! - Add graphql-mini-transforms Rollup and Vite plugins

### Patch Changes

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 5.2.0

### Minor Changes

- [#2409](https://github.com/Shopify/quilt/pull/2409) [`0bff6fad7`](https://github.com/Shopify/quilt/commit/0bff6fad7b0630d1b796bb457d8d86e81ececedd) Thanks [@BPScott](https://github.com/BPScott)! - Update types to account changes in TypeScript 4.8 and 4.9. [Propogate contstraints on generic types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#unconstrained-generics-no-longer-assignable-to) and update type usage relating to `Window` and `Navigator`. Technically this makes some types stricter, as attempting to pass `null|undefined` into certain functions is now disallowed by TypeScript, but these were never expected runtime values in the first place.

## 5.1.0

### Minor Changes

- [#2465](https://github.com/Shopify/quilt/pull/2465) [`0fd338a58`](https://github.com/Shopify/quilt/commit/0fd338a58ce65e2e98c11995d7f38d97162cca84) Thanks [@eokoneyo](https://github.com/eokoneyo)! - fix export path for jest-simple sub-path

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
