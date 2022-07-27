# Changelog

## 5.0.5

### Patch Changes

- Updated dependencies []:
  - @shopify/react-graphql@8.0.4
  - @shopify/react-html@12.0.2
  - @shopify/react-network@5.0.4

## 5.0.4

### Patch Changes

- Updated dependencies []:
  - @shopify/react-network@5.0.3

## 5.0.3

### Patch Changes

- Updated dependencies [[`24a104e16`](https://github.com/Shopify/quilt/commit/24a104e16094d7599c9493390a9841e3475cef45)]:
  - @shopify/react-graphql@8.0.3

## 5.0.2

### Patch Changes

- Updated dependencies [[`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d), [`f70a02825`](https://github.com/Shopify/quilt/commit/f70a02825f7c9942f63a4db0050f28733f695061)]:
  - @shopify/react-graphql@8.0.2
  - @shopify/react-network@5.0.2

## 5.0.1 - 2022-06-08

- No updates. Transitive dependency bump.

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.4.13 - 2022-04-25

- No updates. Transitive dependency bump.

## 4.4.12 - 2022-03-31

- No updates. Transitive dependency bump.

## 4.4.11 - 2022-03-15

- No updates. Transitive dependency bump.

## 4.4.10 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.4.9 - 2022-03-07

- No updates. Transitive dependency bump.

## 4.4.8 - 2022-02-28

- No updates. Transitive dependency bump.

## 4.4.7 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.4.6 - 2022-02-14

- No updates. Transitive dependency bump.

## 4.4.5 - 2022-02-09

- No updates. Transitive dependency bump.

## 4.4.4 - 2022-02-02

- No updates. Transitive dependency bump.

## 4.4.3 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.4.2 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.4.1 - 2022-01-19

- No updates. Transitive dependency bump.

## 4.4.0 - 2022-01-13

- No updates. Transitive dependency bump.

## 4.3.8 - 2022-01-12

- No updates. Transitive dependency bump.

## 4.3.7 - 2021-12-07

- No updates. Transitive dependency bump.

## 4.3.6 - 2021-12-01

- No updates. Transitive dependency bump.

## 4.3.5 - 2021-11-23

- No updates. Transitive dependency bump.

## 4.3.4 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 4.3.3 - 2021-11-01

- No updates. Transitive dependency bump.

## 4.3.2 - 2021-10-08

### Changed

- Use the named import of ApolloClient [[#2052](https://github.com/Shopify/quilt/pull/2052)]

## 4.3.1 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 4.3.0 - 2021-09-14

- No updates. Transitive dependency bump.

## 4.2.0 - 2021-09-14

### Changed

- Only add the SSR link on the server. [[#2037](https://github.com/Shopify/quilt/pull/2037)]

## 4.1.6 - 2021-08-30

- No updates. Transitive dependency bump.

## 4.1.5 - 2021-08-26

- No updates. Transitive dependency bump.

## 4.1.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 4.1.3 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 4.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 4.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 4.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 4.0.2 - 2021-06-29

- No updates. Transitive dependency bump.

## 4.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 3.6.6 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 3.6.1 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

### Changed

- Change the request id header name from `X-Request-ID` to `X-Initiated-By-Request-ID` [#1738](https://github.com/Shopify/quilt/pull/1738)

### Added

- Added the ability to disabled csrfLink or requestIdLink. [#1738](https://github.com/Shopify/quilt/pull/1738)

## 3.5.0 - 2021-01-21

### Added

- Added the ability to use a custom serialized identifier for the apollo cache. [#1724](https://github.com/Shopify/quilt/pull/1724)

## 3.4.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 3.3.3 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 3.3.0 - 2020-08-26

### Added

- Automatically passed `X-Request-ID` header to GraphQL requests when it exist. ([#1609](https://github.com/Shopify/quilt/pull/1609)).

## 3.2.0 - 2020-08-19

### Changed

- Add default cache, ssrMode, ssrForceFetchDelay, and connectToDevTools options with the server prop passed in. ([#1579](https://github.com/Shopify/quilt/pull/1579)).

- Update apollo dependencies to accept a range. ([#1579](https://github.com/Shopify/quilt/pull/1579)).

## 3.1.0 - 2020-03-24

### Added

- The generated `ApolloClient` now automatically includes a `x-shopify-react-xhr: 1` header. ([#1331](https://github.com/Shopify/quilt/pull/1331))

## 3.0.2 - 2020-02-27

- Specify package has no `sideEffects` ([#1233](https://github.com/Shopify/quilt/pull/1233))

## 3.0.0 - 2020-01-24

### Changed

- Uses `@shopify/react-graphql@6.x`, which now requires `apollo-react@>=3.0.0` ([#1153](https://github.com/Shopify/quilt/pull/1153)).

## 2.0.4 - 2019-10-07

### Fixed

- Removed an unnecessary part of the `GraphQLUniversalProvider` component that broke when using `react-apollo@3.x` ([#1087](https://github.com/Shopify/quilt/pull/1087))

## 2.0.0 - 2019-09-13

- 🛑 Breaking change: `GraphQLUniversalProvider` expects a `createClientOptions` prop and will create ApolloClient using the options provided [#1039](https://github.com/Shopify/quilt/pull/1039)

## 1.1.0 - 2019-09-13

### Added

- By default included <ApolloBridge /> from [`@shopify/react-effect-apollo`](../react-effect-apollo). This is needed if the consumer is using `Query` component from `react-apollo` or `@shopify/react-graphql` ([#994](https://github.com/Shopify/quilt/pull/994))

## 1.0.0 - 2019-08-28

### Added

- `@shopify/react-graphql-universal-provider` package
