# Changelog

## 3.1.3

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/address-consts@4.1.2
  - @shopify/jest-dom-mocks@4.0.1

## 3.1.2

### Patch Changes

- Updated dependencies [[`0b3737b7d`](https://github.com/Shopify/quilt/commit/0b3737b7dc7531055b5cba7239a8210bb5e95f22)]:
  - @shopify/address-consts@4.1.1

## 3.1.1 - 2022-06-16

### Fixed

- Remove unused devDependency on an outdated version of `@shopify/jest-dom-mocks` [[#2308](https://github.com/Shopify/quilt/pull/2308)]

## 3.1.0 - 2022-05-31

### Added

- French locale support for all countries [[#2296](https://github.com/Shopify/quilt/pull/2296)]

## 3.0.2 - 2022-05-30

### Changed

- Fixed address mock for canada country requests [[#2293](https://github.com/Shopify/quilt/pull/2293)]

## 3.0.1 - 2022-05-27

- No updates. Transitive dependency bump.

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.1.0 - 2022-03-10

### Changed

- `mockCountryRequests` will now return the fixture for the country code passed in the variables if available or return a relevant GraphQL response error if not. [[#2179](https://github.com/Shopify/quilt/pull/2179)]

## 2.0.18 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.0.17 - 2022-03-07

- No updates. Transitive dependency bump.

## 2.0.16 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.0.15 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.0.14 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.0.13 - 2022-01-06

- No updates. Transitive dependency bump.

## 2.0.12 - 2021-12-01

- No updates. Transitive dependency bump.

## 2.0.11 - 2021-11-23

- No updates. Transitive dependency bump.

## 2.0.10 - 2021-11-22

- No updates. Transitive dependency bump.

## 2.0.9 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.0.8 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.0.7 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 2.0.6 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.5 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.4 - 2021-07-15

- No updates. Transitive dependency bump.

## 2.0.3 - 2021-06-29

- No updates. Transitive dependency bump.

## 2.0.1 - 2021-05-28

- Bumped `countries_en` fixture with latest country service data [#1920](https://github.com/Shopify/quilt/pull/1920)

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.5.6 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.5.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.4.2 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.4.0 - 2020-09-02

- Updated mocks for countries and country calls to include `optionalLabels`. [#1610](https://github.com/Shopify/quilt/pull/1610)

## 1.3.0 - 2020-03-10

- Add mocks for request to CountryService with unsupported locales [#1301](https://github.com/Shopify/quilt/pull/1301)
