# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [0.5]

## Added

- `<List />` supports `getChildKey` to provide custom `key`s for it's children. [#387](https://github.com/Shopify/quilt/pull/387)

## [0.4.1]

## Fixed

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
