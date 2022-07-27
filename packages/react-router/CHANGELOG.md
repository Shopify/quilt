# Changelog

## 2.0.4

### Patch Changes

- Updated dependencies []:
  - @shopify/react-network@5.0.4

## 2.0.3

### Patch Changes

- Updated dependencies []:
  - @shopify/react-network@5.0.3

## 2.0.2

### Patch Changes

- Updated dependencies []:
  - @shopify/react-network@5.0.2

## 2.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 2.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 1.5.6 - 2022-04-25

- No updates. Transitive dependency bump.

## 1.5.5 - 2022-03-31

- No updates. Transitive dependency bump.

## 1.5.4 - 2022-03-15

- No updates. Transitive dependency bump.

## 1.5.3 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 1.5.2 - 2022-03-07

- No updates. Transitive dependency bump.

## 1.5.1 - 2022-02-28

- No updates. Transitive dependency bump.

## 1.5.0 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

### Added

- Add generatePath export. [[#2183](https://github.com/Shopify/quilt/pull/2183)]

## 1.4.5 - 2022-02-14

- No updates. Transitive dependency bump.

## 1.4.4 - 2022-02-09

- No updates. Transitive dependency bump.

## 1.4.3 - 2022-02-02

- No updates. Transitive dependency bump.

## 1.4.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 1.4.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 1.4.0 - 2022-01-28

- No updates. Transitive dependency bump.

## 1.3.0 - 2022-01-28

### Added

- Minor: Add RouteProps type export to be able to extend it in projects. [[#2143](https://github.com/Shopify/quilt/pull/2143)]

## 1.2.1 - 2022-01-19

- No updates. Transitive dependency bump.

## 1.2.0 - 2022-01-13

- No updates. Transitive dependency bump.

## 1.1.13 - 2022-01-12

- No updates. Transitive dependency bump.

## 1.1.12 - 2021-12-07

- No updates. Transitive dependency bump.

## 1.1.11 - 2021-11-23

- No updates. Transitive dependency bump.

## 1.1.10 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 1.1.9 - 2021-11-01

- No updates. Transitive dependency bump.

## 1.1.8 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 1.1.7 - 2021-09-14

- No updates. Transitive dependency bump.

## 1.1.6 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2034](https://github.com/Shopify/quilt/pull/2034)]

## 1.1.5 - 2021-08-30

- No updates. Transitive dependency bump.

## 1.1.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 1.1.3 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 1.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 1.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 1.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 1.0.2 - 2021-06-29

- No updates. Transitive dependency bump.

## 1.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 0.2.10 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.2.7 - 2021-04-05

### Added

- Added new `basename` prop to `Router` to match behaviour of React-Router components [#1757](https://github.com/shopify/quilt/pull/1757)

## 0.2.6 - 2021-03-30

### Fixed

- Exported values for `MemoryRouter`, `useRouteMatch`, `useParams`, `useLocation` and `useHistory`, which were previously only exporting their types since 0.2.0 [#1804](https://github.com/Shopify/quilt/pull/1804)

## 0.2.4 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.1.1 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.1.0 - 2020-10-09

### Changed

- Fix typing of Link so it supports the same props as react-router's Link. [1645](https://github.com/Shopify/quilt/pull/1645)
- Export `MemoryRouter`. [1645](https://github.com/Shopify/quilt/pull/1645)
- Reexport `useRouteMatch`, `useParams`, `useLocation` and `useHistory` hooks. [1646](https://github.com/Shopify/quilt/pull/1646)

## 0.0.31 - 2019-08-18

### Changed

- Pass in object with pathname (ie. `/test123`) and search to StaticRouter. The strange behaviour is cause by a react-router using spread operator to copy object. [1589](https://github.com/Shopify/quilt/pull/1589)

## 0.0.30 - 2020-07-28

- ❗️ This version is broken and deprecated. Do not use ❗️
- Fix bug where passing URL object would cause server router to page incorrectly [1567](https://github.com/Shopify/quilt/pull/1567)

## 0.0.25 - 2020-05-29

- Change the Router location prop to accept URL as well as string. [1423](https://github.com/Shopify/quilt/pull/1423)

## 0.0.15 - 2019-10-30

- The `<Router />` component will now give a more useful error message when not given a `location` on the server

## 0.0.13 - 2019-10-29

- Adds `RouterChildContext` to exported types

## 0.0.9 - 2019-10-01

- Fix Redirect component
- Fix <Link /> component to explicitly accept a children prop to delegate to the underlying link from `react-router`. [1073](https://github.com/Shopify/quilt/pull/1073)

## 0.0.4 - 2019-09-05

- Move the types to depenedencies

## 0.0.3 - 2019-08-05

- Add more stock `react-router` components

## 0.0.2 - 2019-08-29

- Fix type error in consuming projects with the props of `<Redirect />`

### Added

- `@shopify/react-router` package
