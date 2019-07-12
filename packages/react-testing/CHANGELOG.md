# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.0] - 2019-06-04

### Added

- Added a `toContainReactComponentTimes` matcher ([781](https://github.com/Shopify/quilt/pull/781))
- Added a `toProvideReactContext` matcher ([#735](https://github.com/Shopify/quilt/pull/735))

## [1.5.4] - 2019-05-31

### Fixed

- When using a custom mount with `createMount`, calling `setProps` on the resulting elements will now properly set props on the JSX that was mounted, not the element returned from the `createMount` `render` option ([#726](https://github.com/Shopify/quilt/pull/726)).

  > **Note**: In order to support the above, a small change was made to the `Root` class’s constructor. If you were calling this directly (which is discouraged), you will need to use the new `resolveRoot` option instead of the existing second argument. Additionally, if you were manually passing through additional props in a component you used to wrap elements in `createMount.render`, you can now remove this workaround.

## [1.5.3] - 2019-05-22

### Fixed

- Passing unresolved promises within `act()` blocks required additional nesting ([#697](https://github.com/Shopify/quilt/pull/697))

## [1.5.0] - 2019-05-09

### Changed

- Upgraded React to versions 16.9.0-alpha.0 and added support for async `act()` calls ([#688](https://github.com/Shopify/quilt/pull/688))

## [1.4.3] - 2019-05-02

### Fixed

- `Root/Element#find` now correctly find components created by `React.memo` and `React.forwardRef` ([#682](https://github.com/Shopify/quilt/pull/682))

## [1.4.0] - 2019-04-18

### Changed

- `Root/Element#trigger()` now allow passing a deep partial version of the arguments of the prop being triggered ([#661](https://github.com/Shopify/quilt/pull/661))

## [1.3.2] - 2019-04-09

### Fixed

- Fixed an issue were a leaf DOM node would return `null` for `domNode` ([#622](https://github.com/Shopify/quilt/pull/622))

## [1.3.0] - 2019-04-02

### Added

- Added `.toContainReactText` and `.toContainReactHtml` matchers ([#626](https://github.com/Shopify/quilt/pull/626))

### Changed

- Calling `Root#act` within another callback to `Root#act` now groups the update into a single `act()` block ([#626](https://github.com/Shopify/quilt/pull/626))

## [1.2.0] - 2019-04-01

### Added

- Added a `createMount` factory that can create mount functions tailor-made to suit the global state for individual applications ([#624](https://github.com/Shopify/quilt/pull/624))

## [1.1.0] - 2019-03-29

### Added

- Added a `@shopify/react-testing/matchers` directory, which adds `.toHaveReactProps` and `.toContainReactComponent` assertions for Jest ([#621](https://github.com/Shopify/quilt/pull/621))
- `Element#find` and `Element#findAll` now accept a second optional argument for required props on matched elements ([#621](https://github.com/Shopify/quilt/pull/621))

## [1.0.0] - 2019-03-29

Initial release.
