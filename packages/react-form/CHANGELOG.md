# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.4.1] - 2020-03-10

## Fixed

- Overloaded `useList` to accept list as argument ([#1308](https://github.com/Shopify/quilt/issues/1308))

## [0.4.0] - 2020-03-04

### Added

- Add option to use a custom comparator for determining if a field is dirty [#1296](https://github.com/Shopify/quilt/pull/1296/)

## [0.3.34] - 2020-02-27

### Fixed

- Update `isChangeEvent` to check for null ([#1288](https://github.com/Shopify/quilt/issues/1288))

## [0.3.24]

### Fixed

- Update reduceField() to check array equality when determining if a field is dirty [#1222](https://github.com/Shopify/quilt/pull/1222)

## [0.3.23]

### Added

- new `useChoiceField` and `asChoiceField` functions to support `Checkbox` and `RadioButton` [#1070](https://github.com/Shopify/quilt/pull/1070)

### Fixed

- handle invalid error path for submission errors [#1007](https://github.com/Shopify/quilt/pull/1007)

## [0.3.9]

### Added

- new `positiveIntegerString` validator to validate fractionless numbers [#760](https://github.com/Shopify/quilt/pull/760)

### Fixed

- `notEmptyString` now rejects empty strings, similar to `notEmpty` [#759](https://github.com/Shopify/quilt/pull/759)

## [0.3.4]

### Fixed

- now keeps all imperative methods returned by `useForm` reference equal regardless of the `fieldBag` changing, preventing needless rerenders of `PureComponent`s [(716)](https://github.com/Shopify/quilt/pull/716)

## [0.2.0]

### Changed

- now expects errors in the form `{field?: string[], message: string}` rather than `{fieldPath?: string[], message: string}` to better match common GraphQL api error patterns.
- no longer exports `useErrorPropagation` or `useValidateAll`
- `useSubmit` now handles propagating errors and running client validations itself
- now exports non-hook utility functions `validateAll` and `propagateErrors`

## [0.1.1]

### Fixed

- now correctly depends on `fast-deep-equal` [#680](https://github.com/Shopify/quilt/pull/680)
- no longer triggers set-state warnings when the component calling `useSubmit` is unmounted during submission [#680](https://github.com/Shopify/quilt/pull/680)

## [0.1.0]

### Changed

- `useList` now reinitializes based on `deepEquals` rather than reference equality [#675](https://github.com/Shopify/quilt/pull/675)
- `useField` can better tell the difference between field config objects and regular old object literals [#675](https://github.com/Shopify/quilt/pull/675)
- `useField` now reinitializes based on `deepEquals` rather than reference equality [#675](https://github.com/Shopify/quilt/pull/675)

## [0.0.1]

### Added

- `@shopify/react-form` package
