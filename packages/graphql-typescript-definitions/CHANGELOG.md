# Changelog

## 3.2.2

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - graphql-config-utilities@4.1.2
  - graphql-tool-utilities@3.0.1
  - graphql-typed@2.0.1

## 3.2.1

### Patch Changes

- Updated dependencies [[`0d82c68f4`](https://github.com/Shopify/quilt/commit/0d82c68f450f101c516f340656f85e3930919067)]:
  - graphql-config-utilities@4.1.1

## 3.2.0

### Minor Changes

- [#2282](https://github.com/Shopify/quilt/pull/2282) [`6fee77510`](https://github.com/Shopify/quilt/commit/6fee775105044d061973e8731b39c439c7ce950f) Thanks [@vsumner](https://github.com/vsumner)! - Update graphql-config to 4

### Patch Changes

- Updated dependencies [[`6fee77510`](https://github.com/Shopify/quilt/commit/6fee775105044d061973e8731b39c439c7ce950f)]:
  - graphql-config-utilities@4.1.0

## 3.1.1 - 2022-06-16

### Fixed

- Widen peerDependency range for `graphql-typed` to include v2 [[#2308](https://github.com/Shopify/quilt/pull/2308)]

## 3.1.0 - 2022-05-26

### Added

- Added `--export-format=documentWithTypedDocumentNode` export format, which generates types that include the shape of `TypedDocumentNode` from `@graphql-typed-document-node/core`. This enables strict type inferrence when using these documents in `@apollo/client`'s `useQuery` and `useMutation`. [[#2289](https://github.com/Shopify/quilt/pull/2289)]

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.1.11 - 2022-04-25

- No updates. Transitive dependency bump.

## 2.1.10 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.1.9 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.1.8 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.1.7 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.6 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 2.1.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.4 - 2021-09-14

- No updates. Transitive dependency bump.

## 2.1.3 - 2021-09-14

### Changed

- Performance improvements [[#2035](https://github.com/Shopify/quilt/pull/2035)]

## 2.1.2 - 2021-09-03

- No updates. Transitive dependency bump.

## 2.1.1 - 2021-08-30

- No updates. Transitive dependency bump.

## 2.1.0 - 2021-08-26

### Changed

- Support for `graphql`@`15.x`. [[#1978](https://github.com/Shopify/quilt/pull/1978)]

## 2.0.8 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.0.7 - 2021-08-10

### Changed

- Remove dependency on `upper-case-first`. [[#1990](https://github.com/Shopify/quilt/pull/1990)]

## 2.0.6 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.5 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.4 - 2021-06-22

### Changed

- Update `@babel/generator` and `@babel/types to`^7.14.5` [#1948](https://github.com/Shopify/quilt/pull/1948)

## 2.0.3 - 2021-06-17

### Changed

- Update `fs-extra` to `^9.1.0` [#1946](https://github.com/Shopify/quilt/pull/1946)

## 2.0.1 - 2021-06-01

### Fixed

- Fix binary files referencing non-existent files [#1929](https://github.com/Shopify/quilt/pull/1929)

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.0.2 - 2021-05-19

### Fixed

- Fix broken file exports. [#1894](https://github.com/Shopify/quilt/pull/1894)

## 1.0.1 - 2021-05-07

### Breaking Change

- Update `graphql-config` to version 3. Update `graphql-config-utilities`. [#1883](https://github.com/Shopify/quilt/pull/1883)

## 0.24.0 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

### Added

- Minor: `Builder.run` now accepts an optional `graphQLFilesystem` property. Custom filesystems _must_ provide watch/glob functionality mandated by [`GraphQLFileSystem`](./src/filesystem/graphql-filesystem.ts) [[#1824](https://github.com/Shopify/quilt/pull/1824)]
- Minor: `AbstractGraphQLFileSystem` provides emitter boilerplate for `GraphQLFileSystem`'s `change:schema` / `change:document` / `delete:document` events [[#1824](https://github.com/Shopify/quilt/pull/1824)]

## 0.23.2 - 2021-03-23

### Fixed

- Fix `graphql-typescript-definitions` binary not running [[#1798](https://github.com/Shopify/quilt/pull/1798)]

## 0.23.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt

## 0.21.2 - 2021-02-18

- Ensure we add an `export {}` to otherwise blank files to make it clear that they are in the es modules format [[#131](https://github.com/Shopify/graphql-tools-web/pull/131)]

## 0.21.0 - 2020-06-15

- Allow custom scalars that alias built-in types [[#90](https://github.com/Shopify/graphql-tools-web/pull/90)] (thanks [ryanw](https://github.com/ryanw)!)

## 0.20.3 - 2020-06-03

### Fixed

- generated types `index.ts` file now emits all imports before exports [[#118](https://github.com/Shopify/graphql-tools-web/pull/118)]

## 0.20.1 - 2020-04-28

### Fixed

- Fixed `Builder` not respecting the `exportFormat` option.

## 0.20.0 - 2020-04-27

### Added

- Added a new `exportFormat` option to control the type of documents exported from `.graphql` files [[#114](https://github.com/Shopify/graphql-tools-web/pull/114)]

## 0.19.0 - 2020-04-14

### Changed

- Upgrade yargs to `15` [[#107](https://github.com/Shopify/graphql-tools-web/pull/107)]
- Update dependencies (`chalk`, `change-case`, `chokidar`, `upper-case-first`) [[#110](https://github.com/Shopify/graphql-tools-web/pull/110)]
- Upgrade fs-extra to v9 [[#105](https://github.com/Shopify/graphql-tools-web/pull/105)]
- Upgrade prettier to `v2.0.4` and change `eslint-plugin-shopify` to `@shopify/eslint-plugin` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]
- Upgrade graphql to `v14.6.0` [[#104](https://github.com/Shopify/graphql-tools-web/pull/104)]

## 0.18.0 - 2019-10-09

### Changed

- duplicate checks now include fragments [[#88](https://github.com/Shopify/graphql-tools-web/pull/88)]

## 0.17.0 - 2019-04-01

- Added a `--config` option to allow a JSON-serialized config an an alternative to looking up a `.graphqlconfig` [[#70](https://github.com/Shopify/graphql-tools-web/pull/70), thanks to [alexkirsz](https://github.com/alexkirsz)]

## 0.16.0 - 2019-03-11

### Changed

- Upgrading `graphql` to `^14.0.0` (`14.1.1`) [[#72](https://github.com/Shopify/graphql-tools-web/pull/72)]

## 0.15.1 - 2019-01-22

### Fixed

- Using static utility functions from `graphql-tool-utilities` instead of `GraphQLProject` augmentations to prevent `TypeError: project.resolveSchemaPath is not a function` when a duplicate `graphql` packages exist in the node package dependency chain. [[#73](https://github.com/Shopify/graphql-tools-web/pull/73)]

## 0.15.0 - 2019-01-22

### Added

- You can now pass a `--custom-scalars` flag (or the equivalent `customScalars` option in Node.js) to reference custom types that should be used for custom scalars in GraphQL [[#63](https://github.com/Shopify/graphql-tools-web/pull/63)]

### Changed

- The library now generates an `Other` type for union/ intersection fields, even when the type is "fully covered" [[#64](https://github.com/Shopify/graphql-tools-web/pull/64)]. Before, if there were only a single type that implemented the union or interface, it was generated without being postfixed with the implementing type's name, and without an `Other` type. If all implementing types were queried in some way, it would include the types with postfixed names, but would not include an `Other` type.

  This can be a breaking change if you were querying fields where only a single type implemented a union or interface, as the types for these fields will have their names changed. For example, given the following schema:

  ```graphql
  type Ball = {
    color: String!
  }

  union Object = Ball

  type Query = {
    object: Object
  }
  ```

  And this query:

  ```graphql
  query BallQuery {
    object {
      ... on Ball {
        color
      }
    }
  }
  ```

  The library used to generate a type `BallQueryData.Object` with `{color: string}`, because `Ball` was the only implementing type. Now, the library will generate a `BallQueryData.ObjectBall` and a `BallQueryData.ObjectOther`, which represents future implementing types of `Object`. When a `__typename` field is added, either explicitly or with the `--add-typename` flag, the `Other` type has a `__typename: ''` definition, which allows you to disambiguate it from results that did query a member of the union or interface.
