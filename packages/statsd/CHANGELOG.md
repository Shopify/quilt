# Changelog

## 4.2.0

### Minor Changes

- [#2511](https://github.com/Shopify/quilt/pull/2511) [`3b228b4f3`](https://github.com/Shopify/quilt/commit/3b228b4f34a57894ad552188f55dfce372324b85) Thanks [@ryanwilsonperkin](https://github.com/ryanwilsonperkin)! - Introduces an optional parameter to all metrics methods to allow them to accept
  a sampleRate and provide sampling independently of the sampleRate settings
  specified on the client itself. Allows the developer to opt in or out of
  sampling on a metric-by-metric basis.

## 4.1.1

### Patch Changes

- [#2494](https://github.com/Shopify/quilt/pull/2494) [`da04b9e63`](https://github.com/Shopify/quilt/commit/da04b9e63819a51abfca04008e01f6935d886297) Thanks [@alexandcote](https://github.com/alexandcote)! - When using a child client concatenation of prefixes is now ordered as `ParentPrefix.ChildPrefix`, which is a more generally desired behaviour. Previously this was `ChildPrefix.ParentPrefix`.

## 4.1.0

### Minor Changes

- [#2489](https://github.com/Shopify/quilt/pull/2489) [`472e3556a`](https://github.com/Shopify/quilt/commit/472e3556a07cb3315261e043d19a44a01ca17432) Thanks [@alexandcote](https://github.com/alexandcote)! - Updating `hot-shots` to version 9.3.0

### Patch Changes

- [#2489](https://github.com/Shopify/quilt/pull/2489) [`9396ac6eb`](https://github.com/Shopify/quilt/commit/9396ac6eb66220ad1dd40c57f66c193cd14e4780) Thanks [@alexandcote](https://github.com/alexandcote)! - Allowing consumer to create a child client

- [#2492](https://github.com/Shopify/quilt/pull/2492) [`da62f58f4`](https://github.com/Shopify/quilt/commit/da62f58f46bb3a27f55ef4cc59c5292b9a842a24) Thanks [@alexandcote](https://github.com/alexandcote)! - Exposing types needed to create a child client.

## 4.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 4.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 3.0.12 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 3.0.11 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.0.10 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.0.9 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.0.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.7 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.5 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 3.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.1.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.1.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.1.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.0.1 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.0.0 - 2019-12-24

### Changed

- Update `hot-spot` dependencies [[#1650](https://github.com/Shopify/quilt/pull/1650)]

### Added

- added `timing` metric support from `hot-spot`

## 1.2.0 - 2019-12-24

### Added

- added `gauge` metric support from `hot-spot`

## 1.1.0 - 2019-10-08

### Added

- now handles converting non-string values to strings for tag dictionaries and converts empty tag values to `Unknown` [#1095](https://github.com/Shopify/quilt/pull/1095)

## 1.0.0 - 2019-10-07

### Added

- `@shopify/statsd` package
