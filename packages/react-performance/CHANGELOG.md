# Changelog

## 3.0.9

### Patch Changes

- Updated dependencies [[`fbf76bcc5`](https://github.com/Shopify/quilt/commit/fbf76bcc550f5178cf939d44d6559c4e882a7ccd)]:
  - @shopify/performance@3.2.2

## 3.0.8

### Patch Changes

- Updated dependencies [[`dcb3c54c0`](https://github.com/Shopify/quilt/commit/dcb3c54c064331ce45cc99958dd68d0d0a769f72)]:
  - @shopify/performance@3.2.1

## 3.0.7

### Patch Changes

- Updated dependencies [[`1570b951d`](https://github.com/Shopify/quilt/commit/1570b951d2f865120dcf7f198d23a4e935fe6042)]:
  - @shopify/performance@3.2.0

## 3.0.6

### Patch Changes

- Updated dependencies [[`1f76ed324`](https://github.com/Shopify/quilt/commit/1f76ed324172fe90048423e7a0503b762d7424af)]:
  - @shopify/performance@3.1.1

## 3.0.5

### Patch Changes

- Updated dependencies [[`21435a256`](https://github.com/Shopify/quilt/commit/21435a2562822ef76d3ede49c8b1eaefc1fe475d)]:
  - @shopify/performance@3.1.0

## 3.0.4

### Patch Changes

- Updated dependencies [[`2094cb39a`](https://github.com/Shopify/quilt/commit/2094cb39a674d38a19394b79bf59c11a65ff9e15)]:
  - @shopify/performance@3.0.2

## 3.0.3

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/performance@3.0.1

## 3.0.2 - 2022-06-15

### Fixed

- Support Netlify Edge Functions

## 3.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.1.14 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.1.13 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.1.12 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.1.11 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.10 - 2021-11-30

- No updates. Transitive dependency bump.

## 2.1.9 - 2021-11-25

- No updates. Transitive dependency bump.

## 2.1.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 2.1.7 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 2.1.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.5 - 2021-08-30

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2014)]

## 2.1.4 - 2021-08-26

- No updates. Transitive dependency bump.

## 2.1.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.4.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.4.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.4.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.3.7 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.3.0 - 2020-02-05

### Added

- Performance report hook and component now accepts a `locale` attribute [#1260](https://github.com/Shopify/quilt/pull/1260)

## 1.2.0 - 2019-10-25

### Added

- special values for `PerformanceMark`'s `stage` prop are now exposed as a `Stage` enum [#1137](https://github.com/Shopify/quilt/pull/1137)

## 1.1.0 - 2019-10-11

### Added

- creates a performance object as the default context value [#1102](https://github.com/Shopify/quilt/pull/1102)

## 1.0.0

### Added

- `@shopify/react-performance` package [#1083](https://github.com/Shopify/quilt/pull/1083)
