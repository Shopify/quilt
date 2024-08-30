# Changelog

## 8.2.1

### Patch Changes

- [#2832](https://github.com/Shopify/quilt/pull/2832) [`e1fd441`](https://github.com/Shopify/quilt/commit/e1fd441e259c4454e59b932320c68dc693a38067) Thanks [@nattydodd](https://github.com/nattydodd)! - MockGraphQLResponse should allow an ExecutionResult containing any data.
  GraphQL v15 defaulted ExecutionResult's data to be an object containing any keys
  but v16 narrowed that down to use `unknown` instead of `any`. This change
  explicitly uses the default behaviour of allowing any from v15.

## 8.2.0

### Minor Changes

- [#2791](https://github.com/Shopify/quilt/pull/2791) [`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892) Thanks [@vsumner](https://github.com/vsumner)! - Update typescript, eslint, and prettier

## 8.1.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

## 8.0.2

### Patch Changes

- [#2778](https://github.com/Shopify/quilt/pull/2778) [`12f780698`](https://github.com/Shopify/quilt/commit/12f7806982f7b0b890792e9d389cbf6055a68362) Thanks [@BPScott](https://github.com/BPScott)! - Add graphql `^16.0.0` as an allowable graphql dependency version

## 8.0.1

### Patch Changes

- [#2718](https://github.com/Shopify/quilt/pull/2718) [`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @babel/traverse from 7.17.9 to 7.23.2

## 8.0.0

### Major Changes

- [#2755](https://github.com/Shopify/quilt/pull/2755) [`2fdf9c5d3`](https://github.com/Shopify/quilt/commit/2fdf9c5d36f82ebf6d28daa3851ec3787c1ac4da) Thanks [@jas7457](https://github.com/jas7457)! - Change graphQL.resolveAll() to additionally wait for any newly-pending gql calls

## 7.1.0

### Minor Changes

- [#2708](https://github.com/Shopify/quilt/pull/2708) [`a224c11d7`](https://github.com/Shopify/quilt/commit/a224c11d7d329470d59c0b97484e75c36e6c8231) Thanks [@markbann](https://github.com/markbann)! - - upgrade @apollo/client to the latest (3.8.10)
  - set `connectToDevTools` to false by default
  - allow consumers to pass `defaultOptions` into the options of

## 7.0.1

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

## 7.0.0

### Major Changes

- [#2302](https://github.com/Shopify/quilt/pull/2302) [`96a5023e7`](https://github.com/Shopify/quilt/commit/96a5023e7106b91089e29c6a9826948b62bde150) Thanks [@vsumner](https://github.com/vsumner)! - Update Apollo from v2 to v3. Replace dependencies on `apollo-client`, `apollo-cache-inmemory` and `apollo-link` with `@apollo/client`. When updating to Apollo v3, `@shopify/graphql-persisted`, `@shopify/graphql-testing`, `@shopify/react-graphql` and `@shopify/react-graphql-universal-provider` should all be updated at the same time, and you should follow the [Apollo3 migration guide](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/).

  Remove `assumeImmutableResults` and `unionOrIntersectionTypes` keys from `createGraphQLFactory()`'s options, as these concepts no longer exist in Apollo 3. Cache behavior can be controlled by setting values within the `cacheOptions` key, which is passed to [the cache constructor](https://www.apollographql.com/docs/react/caching/cache-configuration/#configuration-options). Use [`possibleTypes`](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#breaking-cache-changes) in place of `unionOrIntersectionTypes`.

  Remove the ability to filter operations using `operationName` (e.g. `graphQL.operations.all({operationName: 'SampleQuery'})`). Now operations must be filtered using `query` or `mutation` keys.

  Add `graphQL.waitForQueryUpdates()` method to wait for batched cache updates that occur as of Apollo 3.6.0. This is useful if you need to await on the results of a `fetchMore` call.

  Remove internal `TestingApolloClient` - use `ApolloClient` instead.

  Apollo Change: The task/microtask resolution within Apollo has changed slightly, with some behaviors happening slightly later in the event loop than in Apollo 2. This has no visible effect in the browser, but `@shopify/graphql-testing` is very sensitive to these changes. To get some tests passing you may require additional task/microtask queue flushes.

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 6.5.0

### Minor Changes

- [#2543](https://github.com/Shopify/quilt/pull/2543) [`7c8b83134`](https://github.com/Shopify/quilt/commit/7c8b831346ec84150dd8ed178741b39408fb0fe8) Thanks [@acmertz](https://github.com/acmertz)! - Update resolveAll() to accept a custom filter option to selectively resolve requests.

## 6.4.0

### Minor Changes

- [#2486](https://github.com/Shopify/quilt/pull/2486) [`51c0434a9`](https://github.com/Shopify/quilt/commit/51c0434a92134f375bd1fbfd3003bcb5e4d38d06) Thanks [@BPScott](https://github.com/BPScott)! - Deliberatly cause a `NetworkError` with a useful error message if we see a fixture that is a function that returns a function. This can happen if you do `createGraphQL({MyQuery: () => fillGraphQL(MyQuery)})` because fillGraphQL returns a function. Apollo 2 already returns a `NetworkError` if you do this but as it happens later on, the error message was much less helpful.

## 6.3.0

### Minor Changes

- [#2479](https://github.com/Shopify/quilt/pull/2479) [`1f2f7da72`](https://github.com/Shopify/quilt/commit/1f2f7da72dc8db2cc2318521cabc61072fdc4edc) Thanks [@BPScott](https://github.com/BPScott)! - Improve error that is thrown when you test a GraphQL operation that has not been mocked. It now details what mock was absent.

  Calling `createGraphQL()` with no argument now results in the operation returning a NetworkError. This makes it consistent with the error that results from `createGraphQL({})`.

## 6.2.0

### Minor Changes

- [#2419](https://github.com/Shopify/quilt/pull/2419) [`5cf6ca2c1`](https://github.com/Shopify/quilt/commit/5cf6ca2c191acd7dddc75f53554968cbd8f2bc5d) Thanks [@vsumner](https://github.com/vsumner)! - Allow assumeImmutableResults results to be enabled on the apollo client

## 6.1.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 6.1.0

### Minor Changes

- [#2342](https://github.com/Shopify/quilt/pull/2342) [`5d8bc5bdf`](https://github.com/Shopify/quilt/commit/5d8bc5bdfb75a6369ea4e299e9af918875a5a010) Thanks [@vsumner](https://github.com/vsumner)! - Allow ApolloLinks to be passed to createGraphQL

## 6.0.1

### Patch Changes

- [#2323](https://github.com/Shopify/quilt/pull/2323) [`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d) Thanks [@atesgoral](https://github.com/atesgoral)! - Add additional headers and standardize X-prefixed ones

* [#2320](https://github.com/Shopify/quilt/pull/2320) [`f70a02825`](https://github.com/Shopify/quilt/commit/f70a02825f7c9942f63a4db0050f28733f695061) Thanks [@vsumner](https://github.com/vsumner)! - Update useQuery refetch so that it can recover from a network error. Add more tests.

## 6.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 5.1.9 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 5.1.8 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 5.1.7 - 2022-02-14

### Changed

- Remove devDependency on `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 5.1.6 - 2022-02-09

- No updates. Transitive dependency bump.

## 5.1.5 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 5.1.4 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 5.1.3 - 2021-11-23

- No updates. Transitive dependency bump.

## 5.1.2 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 5.1.1 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 5.1.0 - 2021-08-26

### Changed

- Support for `graphql`@`15.x`. [[#1978](https://github.com/Shopify/quilt/pull/1978)]

## 5.0.6 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 5.0.5 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 5.0.4 - 2021-08-05

### Changed

- Add matchers entrypoint to `typesVersions` fields. This should have happened in 5.0.2 but was missed. [[#1985](https://github.com/Shopify/quilt/pull/1985)]

## 5.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 5.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 5.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 4.4.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 4.4.1 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

### Changed

- Update `jest-matcher-utils` to `26` [[#1751](https://github.com/Shopify/quilt/pull/1751)]

## 4.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 4.2.1 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 4.2.0 - 2020-06-24

### Changed

- Add subsequential request mocking support ([#1534](https://github.com/Shopify/quilt/pull/1534))

## 4.1.0 - 2020-04-20

### Changed

- Update `graphql` dependencies [[#1379](https://github.com/Shopify/quilt/pull/1379)]
- `jest.Matchers` type updated to match `@types/jest` version `25` [[#1239](https://github.com/Shopify/quilt/pull/1239)]
- Update `jest-matcher-utils` to `25` [[#1375](https://github.com/Shopify/quilt/pull/1375)]

## 4.0.9 - 2019-12-04

### Fixed

- Adding `TestingApolloClient` to fix scenarios where some `fetchPolicy` values produce React events firing outside of an `act` scope ([#1198](https://github.com/Shopify/quilt/pull/1198))

## 4.0.0 - 2019-07-03

### Changed

- Updated to respect the new asynchronous query components from the 4.x version of `@shopify/react-graphql` ([#762](https://github.com/Shopify/quilt/pull/762))

## 3.2.0 - 2019-06-27

### Added

- Allow `MockLink` to return a full GraphQLError. ([#768](https://github.com/Shopify/quilt/pull/768))

## 3.1.0 - 2019-05-22

### Added

- Added a new entry point, `@shopify/graphql-testing/matchers`, which includes a `toHavePerformedGraphQLOperation` assertion ([#706](https://github.com/Shopify/quilt/pull/706))
- Improved filtering GraphQL operations by allowing you to pass `query` or `mutation` options ([#706](https://github.com/Shopify/quilt/pull/706))

## 3.0.1 - 2019-04-02

### Changed

- Loosened version requirements for Apollo dependencies

## 3.0.0 - 2019-04-01

### Changed

- `createGraphQLFactory` is now a named export, not the default export ([#623](https://github.com/Shopify/quilt/pull/623/))
- Simplified much of the external workings of the library, including removing the custom subclass of `ApolloClient` ([#623](https://github.com/Shopify/quilt/pull/623/))

## 1.0.0

Initial release.
