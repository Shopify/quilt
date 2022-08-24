# Changelog

## 2.0.3

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/predicates@3.0.1

## 2.0.2

### Patch Changes

- [#2334](https://github.com/Shopify/quilt/pull/2334) [`683c17dad`](https://github.com/Shopify/quilt/commit/683c17dadcef3c7e385c0e4d6f721265ebe0ed93) Thanks [@BPScott](https://github.com/BPScott)! - Adding ignore comments to satisfy updated eslint configs

## 2.0.1 - 2022-06-08

### Changed

- Updated tests to work with React 18 [[#2297](https://github.com/Shopify/quilt/pull/2297)]

## 2.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 1.1.15 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 1.1.14 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 1.1.13 - 2022-02-14

### Changed

- Remove devDependency on `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 1.1.12 - 2022-02-09

- No updates. Transitive dependency bump.

## 1.1.11 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 1.1.10 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 1.1.9 - 2022-01-19

- No updates. Transitive dependency bump.

## 1.1.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 1.1.7 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 1.1.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.1.5 - 2021-08-30

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2014)]

## 1.1.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.1.3 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 1.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 1.0.2 - 2021-06-22

- No updates. Transitive dependency bump.

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.12.5 - 2021-04-22

- [Patch] Remove TypeScript type from distributed mjs [#1845](https://github.com/Shopify/quilt/pull/1845)

## 0.12.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.12.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.12.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)
- Updated `fast-deep-equal` dependency to `^3.1.3` [#1710](https://github.com/Shopify/quilt/pull/1710)

## 0.11.28 - 2020-10-23

### Fixed

- Export `StringMapper` interface [#1655](https://github.com/Shopify/quilt/pull/1655)

## 0.11.27 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.11.11 - 2019-10-01

### Added

- new `asChoiceField` utility function to support `Checkbox` and `RadioButton` [#1070](https://github.com/Shopify/quilt/pull/1070)

## 0.11.8 - 2019-08-29

### Fixed

- Fixed using multiple layers deep of nested `<List />` inside of `<List />`

## 0.11.3

### Added

- Extend the return type of the submit handler for `FormState` component to accept a promise of both `void` and `RemoteError[]`. [#736](https://github.com/Shopify/quilt/pull/736)

## 0.11.2 - 2019-05-22

### Fixed

- validator signatures produced by `validate()` no longer require a `fields` param. [#714](https://github.com/Shopify/quilt/pull/714)

## 0.11.1 - 2019-05-15

### Fixed

- `FormState.Nested` no longer breaks when used in a `FormState.List` and an item is added [#698](https://github.com/Shopify/quilt/pull/698)

## 0.10.0

### Changed

- when `validateOnSubmit` is enabled, validation errors are surfaced on the form's `errors`. [#601](https://github.com/Shopify/quilt/pull/601)

## 0.9.1

### Changed

- `isNumeric` function ReGex now matches for negative numbers. This impacts users of `isNumericString` validator function relying on its previous behaviour of only allowing positive numbers. To reintroduce that behaviour please use `isPostiveNumericString`

## 0.9.0

### Removed

- `<Nested />` and `<List />`: removed logic in `shouldComponentUpdate()` limiting updates

## 0.8.0

### Added

- You can now provide `externalErrors` to the `FormState` component to be merged into the form's `error` objects.

### Changed

- lodash is no longer used internally. [#475](https://github.com/Shopify/quilt/pull/475)

### Fixed

- Fixes validators for cases where `externalErrors` are not provided. [#504](https://github.com/Shopify/quilt/pull/504)

## 0.7.0

### Added

- You can now use the onInitialValueChanged prop with fields having nested properties. [#464](https://github.com/Shopify/quilt/pull/464)

### Fixed

- `submit` now checks for the existence of `preventDefault` on the event passed in before calling it. [#465](https://github.com/Shopify/quilt/pull/465)

## 0.6.0

### Added

- You can control how `<FormState />` reacts to changes in the initialValue prop using onInitialValueChanged.

## 0.5.0

### Added

- `<List />` supports `getChildKey` to provide custom `key`s for it's children. [#387](https://github.com/Shopify/quilt/pull/387)

## 0.4.1

### Fixed

- `<List />` no longer breaks on name generation.

## 0.4.0

### Added

- The `validateRequired` helper can be used to generate validators that run even on empty input.

## 0.3.3

### Fixed

- Validators that depend on `FieldState` have more robust typing.

## 0.3.2

### Fixed

- When validators fail during a submit submitting is reset to false.

## 0.3.0

### Added

- The `validateOnSubmit` prop can be used to have validators run before the `onSubmit` function is called and will prevent `onSubmit` from being called if any fail.

## 0.2.10

### Fixed

- Fixed using multiple layers deep of Nested and List breaking the state.

## 0.2.9

### Fixed

- No longer accidentally import all of lodash.

## 0.2.8

### Changed

- Validators based on `validate` now always succeed for an empty input. The `required` and `requiredString` validators continue to behave the same way they used to.

### Fixed

- Fixed Nested and List component race condition. Nested and List now pass a function to their `onChange` prop instead of an object so that the data object will be created within `setState`.
