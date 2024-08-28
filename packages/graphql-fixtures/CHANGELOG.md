# Changelog

## 8.0.1

### Patch Changes

- Updated dependencies [[`88f1cbe`](https://github.com/Shopify/quilt/commit/88f1cbed60807594537c52da1d2af1ae74c60795)]:
  - graphql-tool-utilities@3.1.1

## 8.0.0

### Minor Changes

- [#2791](https://github.com/Shopify/quilt/pull/2791) [`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892) Thanks [@vsumner](https://github.com/vsumner)! - Update typescript, eslint, and prettier

### Patch Changes

- Updated dependencies [[`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892)]:
  - graphql-typed@2.3.0
  - @shopify/useful-types@5.3.0

## 7.0.0

### Patch Changes

- Updated dependencies [[`bdebd9197`](https://github.com/Shopify/quilt/commit/bdebd919729fa9f2145aa7003395316081afadef)]:
  - graphql-typed@2.2.0

## 6.0.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

### Patch Changes

- Updated dependencies [[`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece)]:
  - graphql-tool-utilities@3.1.0
  - graphql-typed@2.1.0
  - @shopify/useful-types@5.2.0

## 5.0.3

### Patch Changes

- [#2778](https://github.com/Shopify/quilt/pull/2778) [`12f780698`](https://github.com/Shopify/quilt/commit/12f7806982f7b0b890792e9d389cbf6055a68362) Thanks [@BPScott](https://github.com/BPScott)! - Add graphql `^16.0.0` as an allowable graphql dependency version

- Updated dependencies [[`12f780698`](https://github.com/Shopify/quilt/commit/12f7806982f7b0b890792e9d389cbf6055a68362)]:
  - graphql-tool-utilities@3.0.4
  - graphql-typed@2.0.3

## 5.0.2

### Patch Changes

- [#2718](https://github.com/Shopify/quilt/pull/2718) [`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @babel/traverse from 7.17.9 to 7.23.2

## 5.0.1

### Patch Changes

- [#2732](https://github.com/Shopify/quilt/pull/2732) [`46056a94c`](https://github.com/Shopify/quilt/commit/46056a94ce17ae47c8f8cab6714a84aae8815f3a) Thanks [@BPScott](https://github.com/BPScott)! - Import from faker from `faker-js/faker/locale/en` to avoid the overhead of loading non-english locales

## 5.0.0

### Major Changes

- [#2655](https://github.com/Shopify/quilt/pull/2655) [`54defaeb6`](https://github.com/Shopify/quilt/commit/54defaeb6f15411afffed63ee7eb0e47bc198596) Thanks [@mdentremont](https://github.com/mdentremont)! - Update @faker-js/faker to ^8.0.0 (which is exported from graphql-fixtures).

## 4.0.1

### Patch Changes

- [#2701](https://github.com/Shopify/quilt/pull/2701) [`43ec02dd2`](https://github.com/Shopify/quilt/commit/43ec02dd2ff6a21f6d3adb96220d3991dda0c92c) Thanks [@Flufd](https://github.com/Flufd)! - Removes calls to set faker seed if it's not needed

## 4.0.0

### Major Changes

- [#2100](https://github.com/Shopify/quilt/pull/2100) [`27932c219`](https://github.com/Shopify/quilt/commit/27932c219203f31d2a9073f670e6bb0b59bfae6d) Thanks [@alexandcote](https://github.com/alexandcote)! - Add a new function `createFillers`. The function return an object containing `fillOperation` and `fillFragment`. It's now possible to fill a fragment without a query. You can replace `createFiller` by `createFillers` if you need to be able to fill fragments. `Thunk`, `DeepThunk`, `Resolver`, `Options`, `Context` and `GraphQLFillerData` generic type changed.

## 3.1.2

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

- Updated dependencies [[`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86)]:
  - graphql-tool-utilities@3.0.3
  - graphql-typed@2.0.2
  - @shopify/useful-types@5.1.2

## 3.1.1

### Patch Changes

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

- Updated dependencies [[`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f)]:
  - graphql-tool-utilities@3.0.2

## 3.1.0

### Minor Changes

- [#2409](https://github.com/Shopify/quilt/pull/2409) [`0bff6fad7`](https://github.com/Shopify/quilt/commit/0bff6fad7b0630d1b796bb457d8d86e81ececedd) Thanks [@BPScott](https://github.com/BPScott)! - Update types to account changes in TypeScript 4.8 and 4.9. [Propogate contstraints on generic types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#unconstrained-generics-no-longer-assignable-to) and update type usage relating to `Window` and `Navigator`. Technically this makes some types stricter, as attempting to pass `null|undefined` into certain functions is now disallowed by TypeScript, but these were never expected runtime values in the first place.

## 3.0.0

### Major Changes

- [#2464](https://github.com/Shopify/quilt/pull/2464) [`aab709b8b`](https://github.com/Shopify/quilt/commit/aab709b8bd10a0537eae6a07aba953006937fae8) Thanks [@notjosh](https://github.com/notjosh)! - Upgraded @faker-js/faker from v6 to v7

## 2.0.3

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - graphql-tool-utilities@3.0.1
  - graphql-typed@2.0.1
  - @shopify/useful-types@5.1.1

## 2.0.2

### Patch Changes

- Updated dependencies [[`b42a99a7d`](https://github.com/Shopify/quilt/commit/b42a99a7de6c2d88b24920fa70f7490ae1086d5f)]:
  - @shopify/useful-types@5.1.0

## 2.0.1 - 2022-06-16

### Fixed

- Widen peerDependency range for `graphql-typed` to include v2 [[#2308](https://github.com/Shopify/quilt/pull/2308)]

## 2.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]
- Updated faker dependency to v6.3.1. [[#2231](https://github.com/Shopify/quilt/pull/2231)]

## 1.4.6 - 2022-04-25

- No updates. Transitive dependency bump.

## 1.4.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 1.4.4 - 2022-03-07

- No updates. Transitive dependency bump.

## 1.4.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 1.4.2 - 2022-02-14

### Changed

- Removes call to `faker.seed()` that uses `Math.random()` as a seed value [[#2161]](https://github.com/Shopify/quilt/pull/2161)

## 1.4.1 - 2022-02-09

- No updates. Transitive dependency bump.

## 1.4.0 - 2022-02-02

### Changed

- Re-export the instance of faker used in graphql-fixtures so that it can be leveraged easily by consumers [[#2155]](https://github.com/Shopify/quilt/pull/2155)

## 1.3.0 - 2022-02-01

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
