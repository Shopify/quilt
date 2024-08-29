# Changelog

⚠️ DEPRECATED

This package has been deprecated and should no longer be used.

For legacy documentation, see [v5.1.1](https://github.com/Shopify/quilt/blob/%40shopify/graphql-persisted%405.1.1/packages/graphql-persisted/README.md).

## 5.1.1

## 5.1.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

## 5.0.3

### Patch Changes

- [#2718](https://github.com/Shopify/quilt/pull/2718) [`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @babel/traverse from 7.17.9 to 7.23.2

## 5.0.2

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

## 5.0.1

## 5.0.0

### Major Changes

- [#2302](https://github.com/Shopify/quilt/pull/2302) [`96a5023e7`](https://github.com/Shopify/quilt/commit/96a5023e7106b91089e29c6a9826948b62bde150) Thanks [@vsumner](https://github.com/vsumner)! - Update Apollo from v2 to v3. Replace dependencies on `apollo-client`, `apollo-cache-inmemory` and `apollo-link` with `@apollo/client`. When updating to Apollo v3, `@shopify/graphql-persisted`, `@shopify/graphql-testing`, `@shopify/react-graphql` and `@shopify/react-graphql-universal-provider` should all be updated at the same time, and you should follow the [Apollo3 migration guide](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/).

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 4.0.4

## 4.0.3

## 4.0.2

## 4.0.1

## 4.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 3.1.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 3.1.4 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.1.3 - 2022-02-02

- No updates. Transitive dependency bump.

## 3.1.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.1.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.1.0 - 2022-01-13

### Changed

- Update `koa-compose` to `4.1.0` [[#2128](https://github.com/Shopify/quilt/pull/2128)]

## 3.0.0 - 2021-12-01

- No updates. Transitive dependency bump.

## 2.0.9 - 2021-11-23

- No updates. Transitive dependency bump.

## 2.0.8 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 2.0.7 - 2021-11-01

- No updates. Transitive dependency bump.

## 2.0.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.0.5 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.0.4 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.3 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.3.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.3.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2021-01-20

### Added

- Add alwaysIncludeQuery option for PersistedLink. ([#1285](https://github.com/Shopify/quilt/pull/1285))

## 1.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.1.25 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.1.15 - 2019-11-29

- Updated dependency: `@shopify/sewing-kit-koa@6.2.0`

### Added

- `@shopify/graphql-persisted` package
