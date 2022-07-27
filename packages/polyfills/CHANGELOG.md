# Changelog

## 4.0.1

### Patch Changes

- Updated dependencies [[`b42a99a7d`](https://github.com/Shopify/quilt/commit/b42a99a7de6c2d88b24920fa70f7490ae1086d5f)]:
  - @shopify/useful-types@5.1.0

## 4.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 3.1.13 - 2022-04-25

- No updates. Transitive dependency bump.

## 3.1.12 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 3.1.11 - 2022-03-07

- No updates. Transitive dependency bump.

## 3.1.10 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.1.9 - 2022-02-14

### Fixed

- Fix published builds not having the correct exports when filename contains a period

## 3.1.8 - 2022-02-09

- No updates. Transitive dependency bump.

## 3.1.7 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.1.6 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.1.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.1.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.1.3 - 2021-08-05

### Changed

- Fix `idle-callback.browser` entrypoint path in `typesVersions` field. [[#1985](https://github.com/Shopify/quilt/pull/1985)]

## 3.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.1.0 - 2021-06-08

### Fixed

- Replace `require` statements with `import` statements (except for the conditional Jest polyfills) so we get a proper strict ESM module.

## 3.0.1 - 2021-05-31

### Fixed

- Prevent latest unsupported `fetch-blob` packages from being installed. [#1926](https://github.com/Shopify/quilt/pull/1926)

## 3.0.0 - 2021-05-28

### Breaking Change

- Update `core-js` to version 3, remove deprecated polyfills, and update dependencies. See [the migration guide](./migration-guide.md). [#1900](https://github.com/Shopify/quilt/pull/1900)

## 2.0.1 - 2021-05-28

### Fixed

- Prevent this package from being polyfilled. [#1921](https://github.com/Shopify/quilt/pull/1921)

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.3.5 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.3.4 - 2021-04-07

### Changed

- Updated types within fetch.node so it passes TypeScript's "noImplicitThis" checks. [#1814](https://github.com/Shopify/quilt/pull/1814)

## 1.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.2.4 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.2.3 - 2020-06-30

- Fix an issue with bundle size increased by ~20kb [#1518](https://github.com/Shopify/quilt/pull/1518)

## 1.2.0 - 2020-05-27

- Update polyfill base imports. [#1461](https://github.com/Shopify/quilt/pull/1461)

## 1.1.6 - 2019-01-12

- Update `package.json` published `files` patterns. [#1233](https://github.com/Shopify/quilt/pull/1233)

## 1.1.5 - 2019-11-25

- Fix `Can't resolve '@shopify/polyfills/<polyfill>'` import error [#1192](https://github.com/Shopify/quilt/pull/1192)

## 1.1.0 - 2019-08-08

- Use `url-polyfill` instead of `url-search-params-polyfill` as it polyfills `URL` as well, including `URL.searchParams`.

## 1.0.1 - 2019-08-07

- Updated `intl` polyfill featureTest from `internationalization-plural-rul` to `intl-pluralrules` as per the update in [`caniuse-lite@1.0.30000989`](https://github.com/ben-eb/caniuse-lite/commit/6966b0553f4584435a4c95a76794a93750a9004d#diff-5264ce81b24e867ed52dcca8f6a162fbR1)

## 1.0.0 - 2019-07-17

Initial release.
