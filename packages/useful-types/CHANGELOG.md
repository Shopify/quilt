# Changelog

## 5.1.0

### Minor Changes

- [#2340](https://github.com/Shopify/quilt/pull/2340) [`b42a99a7d`](https://github.com/Shopify/quilt/commit/b42a99a7de6c2d88b24920fa70f7490ae1086d5f) Thanks [@melnikov-s](https://github.com/melnikov-s)! - Added DeepReadonly type

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.0.3 - 2022-04-25

### Changed

- Bugs in `DeepPartial`, `IfEmptyObject`, and `DeepOmit` fixed with tests. [[#2195](https://github.com/Shopify/quilt/pull/2195)]

## 4.0.2 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.0.1 - 2022-03-07

- No updates. Transitive dependency bump.

## 4.0.0 - 2022-02-25

### Breaking Change

- `Omit` has been removed. Remove any `import { Omit } from '@shopify/useful-types';` and use the built-in [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) type
- `ThenType` has been removed. You should use the built-in `Awaited` type instead
- `Arguments`, `ArgumentsAtIndex` and `FirstArgument` have been removed. Replace usage of `Arguments` with the built-in [`Parameters`](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype) type. Replace usage of `ArgumentAtIndex` with `Parameters<T>[i]` and `FirstArgument<T>` with `Parameters<T>[0]`.
- `ConstructorArguments`, `ConstructorArgumentAtIndex` and `FirstConstructorArgument` have been removed. Replace usage of `ConstructorArguments` with the built-in [`ConstructorParameters`](https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype) type. Replace usage of `ConstructorArgumentAtIndex` with `ConstructorParameters<T>[i]` and `FirstConstructorArgument<T>` with `ConstructorParameters<T>[0]`
- `MaybeFunctionReturnType` has been removed. Replace usage of `MaybeFunctionReturnType` with the built-in `ReturnType` type

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.1.0 - 2022-02-09

### Added

- Added `PartialSome` and `RequireSome` types to set specified fields of a property to optional or required

## 3.0.7 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.0.6 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.0.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.4.0 - 2021-04-23

### Added

- Add `DeepOmit` and `DeepOmitArray` type to recursively omit field from nested type definition [#1807](https://github.com/Shopify/quilt/pull/1807)

## 2.3.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.2.1 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.2.0 - 2019-06-12

### Added

- Added the `ConstructorArguments`, `ConstructorArgumentAtIndex`, and `FirstConstructorArgument` type aliases

## 2.1.4 - 2019-01-27

- Specify package has no `sideEffects` ([#1233](https://github.com/Shopify/quilt/pull/1233))

## 2.1.0 - 2019-10-30

### Added

- Added the `NoInfer<T>` type alias.

## 2.0.0

- Removed `Props<T>`, see `ComponentProps`, `ComponentPropsWithRef`, and `ComponentPropsWithoutRef` from `react` for a replacement strategy ([#846](https://github.com/Shopify/quilt/pull/846))

## 1.3.0

### Added

- Added the `ArgumentAtIndex` type ([#691](https://github.com/Shopify/quilt/pull/691))

## 1.1.0

### Added

- Added new `DeepPartial` type. ([#456](https://github.com/Shopify/quilt/pull/456))
- Added new `ArrayElement` type. ([#470](https://github.com/Shopify/quilt/pull/470))

## 1.0.0

Initial release
