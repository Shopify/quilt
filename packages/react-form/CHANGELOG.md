# Changelog

## 2.2.0

### Minor Changes

- [#2307](https://github.com/Shopify/quilt/pull/2307) [`04f570dd9`](https://github.com/Shopify/quilt/commit/04f570dd90bb750e16d1e57369d71ceb6bd8ba0b) Thanks [@devonpmack](https://github.com/devonpmack)! - Added `asChoiceList` helper

## 2.1.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 2.1.0 - 2022-05-20

### Added

- Add `getDirtyValues` utility function [#2270](https://github.com/Shopify/quilt/pull/2270)

## 2.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 1.1.19 - 2022-04-25

- No updates. Transitive dependency bump.

## 1.1.18 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 1.1.17 - 2022-03-07

- No updates. Transitive dependency bump.

## 1.1.16 - 2022-02-28

- No updates. Transitive dependency bump.

## 1.1.15 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 1.1.14 - 2022-02-14

- No updates. Transitive dependency bump.

## 1.1.13 - 2022-02-09

- No updates. Transitive dependency bump.

## 1.1.12 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 1.1.11 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 1.1.10 - 2022-01-19

- No updates. Transitive dependency bump.

## 1.1.9 - 2021-12-07

- No updates. Transitive dependency bump.

## 1.1.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 1.1.7 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 1.1.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.1.5 - 2021-09-14

- No updates. Transitive dependency bump.

## 1.1.4 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2034](https://github.com/Shopify/quilt/pull/2034)]

## 1.1.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)
- Adds a makeCleanDynamicLists function, which adds the ability to set [newDefaultValue, defaultValue] and get the value of a dynamic list. [#1871](https://github.com/Shopify/quilt/pull/1871)

## 0.13.1 - 2021-04-29

- Include `dynamicLists` values in `onSubmit` type [#1865](https://github.com/Shopify/quilt/pull/1865)

## 0.13.0 - 2021-04-22

- Adds reset functionality, dirty state for dynamic list, and the ability to add multiple dynamic lists to a form by adding a dynamicLists parameter to useForm [#1828](https://github.com/Shopify/quilt/pull/1828)

## 0.12.8 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.12.6 - 2021-04-07

- Exporting type ErrorContent [#1818](https://github.com/Shopify/quilt/pull/1818)

## 0.12.5 - 2021-04-05

- Undoing blur event change due to additional issues [#1809](https://github.com/Shopify/quilt/pull/1809)

## 0.12.4 - 2021-04-01

### Fixed

- Fixed a TypeScript bug in FormMapping for FieldDictionary arrays [#1795](https://github.com/Shopify/quilt/pull/1795)

## 0.12.3 - 2021-03-30

### Fixed

- Fixed a bug in `makeCleanAfterSubmit` for `useForm` [#1762](https://github.com/Shopify/quilt/pull/1762)

## 0.12.2 - 2021-03-30

### Fixed

- Fixed blur event causing fields to lose focus [#1803](https://github.com/Shopify/quilt/pull/1803)

## 0.12.0 - 2021-03-16

### Added

- Add ability to reorder dynamic lists [#1785](https://github.com/Shopify/quilt/pull/1785)

## 0.11.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.11.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)
- Updated `fast-deep-equal` dependency to `^3.1.3` [#1710](https://github.com/Shopify/quilt/pull/1710)

## 0.10.0 - 2020-12-08

- Added new functionality to `useDynamicList`. Added the ability to dynamically add more than one list item and the ability to pass in an argument into the dynamic list factory. [#1679](https://github.com/Shopify/quilt/pull/1679)

## 0.9.0 - 2020-12-03

- Added `useDynamicList` functionality. `useDynamicList` adds the ability to dynamically add and remove list items. [#1665](https://github.com/Shopify/quilt/pull/1665)

## 0.8.1 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.8.0 - 2020-09-28

### Added

- New multi-value base field api for `asChoiceField` utility to support `<RadioButton />` groups [#1615](https://github.com/Shopify/quilt/pull/1615)

## 0.7.0 - 2020-06-02

### Added

- Add optional `makeCleanAfterSubmit` param to both `useSubmit` and `useForm` config (defaults to `false`)
- Provide bound `makeClean` in `Form` object returned from `useForm`
- Provide `makeCleanFields` utility for other use cases

## 0.6.0 - 2020-04-23

### Added

- Add optional `allErrors` property to `Field` type definition that stores all error messages resulting from `runValidation` [#1383](https://github.com/Shopify/quilt/pull/1383)

## 0.5.4 - 2020-04-13

### Fixed

- [Patch] Add optional `value` parameter to `runValidation` type definition [#1362](https://github.com/Shopify/quilt/pull/1362)

## 0.5.2 - 2020-04-07

### Fixed

- Fixed a bug where onSubmit fieldValues doesn't return empty arrays [#1353](https://github.com/Shopify/quilt/pull/1353)
- Fixed a bug where useDirty does not update dirty state properly on lists [#1353](https://github.com/Shopify/quilt/pull/1353)

## 0.5.1 - 2020-04-02

### Fixed

- Fixed a bug in useList [#1335](https://github.com/Shopify/quilt/pull/1335)

## 0.5.0 - 2020-03-12

### Added

- Added `reduceFields` utilities [#1307](https://github.com/Shopify/quilt/pull/1307)

## 0.4.2 - 2020-03-12

### Fixed

- Fixed a bug in the custom comparator introduced in 0.4.0 [#1305](https://github.com/Shopify/quilt/pull/1305)

## 0.4.1 - 2020-03-10

### Fixed

- Overloaded `useList` to accept list as argument ([#1308](https://github.com/Shopify/quilt/issues/1308))

## 0.4.0 - 2020-03-04

### Added

- Add option to use a custom comparator for determining if a field is dirty [#1296](https://github.com/Shopify/quilt/pull/1296/)

## 0.3.34 - 2020-02-27

### Fixed

- Update `isChangeEvent` to check for null ([#1288](https://github.com/Shopify/quilt/issues/1288))

## 0.3.24

### Fixed

- Update reduceField() to check array equality when determining if a field is dirty [#1222](https://github.com/Shopify/quilt/pull/1222)

## 0.3.23

### Added

- new `useChoiceField` and `asChoiceField` functions to support `Checkbox` and `RadioButton` [#1070](https://github.com/Shopify/quilt/pull/1070)

### Fixed

- handle invalid error path for submission errors [#1007](https://github.com/Shopify/quilt/pull/1007)

## 0.3.9

### Added

- new `positiveIntegerString` validator to validate fractionless numbers [#760](https://github.com/Shopify/quilt/pull/760)

### Fixed

- `notEmptyString` now rejects empty strings, similar to `notEmpty` [#759](https://github.com/Shopify/quilt/pull/759)

## 0.3.4

### Fixed

- now keeps all imperative methods returned by `useForm` reference equal regardless of the `fieldBag` changing, preventing needless rerenders of `PureComponent`s [(716)](https://github.com/Shopify/quilt/pull/716)

## 0.2.0

### Changed

- now expects errors in the form `{field?: string[], message: string}` rather than `{fieldPath?: string[], message: string}` to better match common GraphQL api error patterns.
- no longer exports `useErrorPropagation` or `useValidateAll`
- `useSubmit` now handles propagating errors and running client validations itself
- now exports non-hook utility functions `validateAll` and `propagateErrors`

## 0.1.1

### Fixed

- now correctly depends on `fast-deep-equal` [#680](https://github.com/Shopify/quilt/pull/680)
- no longer triggers set-state warnings when the component calling `useSubmit` is unmounted during submission [#680](https://github.com/Shopify/quilt/pull/680)

## 0.1.0

### Changed

- `useList` now reinitializes based on `deepEquals` rather than reference equality [#675](https://github.com/Shopify/quilt/pull/675)
- `useField` can better tell the difference between field config objects and regular old object literals [#675](https://github.com/Shopify/quilt/pull/675)
- `useField` now reinitializes based on `deepEquals` rather than reference equality [#675](https://github.com/Shopify/quilt/pull/675)

## 0.0.1

### Added

- `@shopify/react-form` package
