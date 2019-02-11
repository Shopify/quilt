# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [0.8.0]

### Added

- You can now provide `externalErrors` to the `FormState` component to be merged into the form's `error` objects.

### Changed

- lodash is no longer used internally. [#475](https://github.com/Shopify/quilt/pull/475)

### Fixed

- Fixes validators for cases where `externalErrors` are not provided. [#504](https://github.com/Shopify/quilt/pull/504)

## [0.7.0]

### Added

- You can now use the onInitialValueChanged prop with fields having nested properties. [#464](https://github.com/Shopify/quilt/pull/464)

### Fixed

- `submit` now checks for the existence of `preventDefault` on the event passed in before calling it. [#465](https://github.com/Shopify/quilt/pull/465)

## [0.6]

### Added

- You can control how `<FormState />` reacts to changes in the initialValue prop using onInitialValueChanged.

## [0.5]

### Added

- `<List />` supports `getChildKey` to provide custom `key`s for it's children. [#387](https://github.com/Shopify/quilt/pull/387)

## [0.4.1]

### Fixed

- `<List />` no longer breaks on name generation.

## [0.4.0]

### Added

- The `validateRequired` helper can be used to generate validators that run even on empty input.

## [0.3.3]

### Fixed

- Validators that depend on `FieldState` have more robust typing.

## [0.3.2]

### Fixed

- When validators fail during a submit submitting is reset to false.

## [0.3.0]

### Added

- The `validateOnSubmit` prop can be used to have validators run before the `onSubmit` function is called and will prevent `onSubmit` from being called if any fail.

## [0.2.10]

### Fixed

- Fixed using multiple layers deep of Nested and List breaking the state.

## [0.2.9]

### Fixed

- No longer accidentally import all of lodash.

## [0.2.8]

### Changed

- Validators based on `validate` now always succeed for an empty input. The `required` and `requiredString` validators continue to behave the same way they used to.

### Fixed

- Fixed Nested and List component race condition. Nested and List now pass a function to their `onChange` prop instead of an object so that the data object will be created within `setState`.
