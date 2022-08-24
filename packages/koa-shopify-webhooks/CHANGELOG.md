# Changelog

## 5.0.3

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/network@3.2.1

## 5.0.2

### Patch Changes

- Updated dependencies [[`30005950b`](https://github.com/Shopify/quilt/commit/30005950baa33cf0ae7eda6d4fe1cc81fdb2ef70)]:
  - @shopify/network@3.2.0

## 5.0.1

### Patch Changes

- Updated dependencies [[`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d)]:
  - @shopify/network@3.1.0

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.4.4 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.4.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.4.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.4.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 4.4.0 - 2022-01-31

### Changed

- Changed Forbidden response to Unauthorized [[#2147](https://github.com/Shopify/quilt/pull/2147)]

## 4.3.0 - 2022-01-13

### Changed

- Update `koa-compose` to `4.1.0` [[#2128](https://github.com/Shopify/quilt/pull/2128)]

## 4.2.1 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 4.2.0 - 2021-09-14

- No updates. Transitive dependency bump.

## 4.1.0 - 2021-09-14

### Added

- Omit `includeFields` arg from webhook registration mutation when it's null [[#2033](https://github.com/Shopify/quilt/pull/2033)]
- Add support for the `includeFields` argument for webhook registrations [[#2024](https://github.com/Shopify/quilt/pull/2024)]

## 4.0.2 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 4.0.1 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json and enable type checking for tests. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 4.0.0 - 2021-08-18

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

### Breaking Change

- Replace ApiVersion enum with a looser string union type and update supported versions [[#2001](https://github.com/Shopify/quilt/pull/2001)]

## 3.0.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.0.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.6.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.6.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.6.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.5.3 - 2020-12-08

- The `ApiVersion` enum now has an `October20` option. [#1697](https://github.com/Shopify/quilt/pull/1697)

## 2.5.2 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.5.1 - 2020-09-28

### Added

- The `ApiVersion` enum now has an `July20` option.

## 2.5.0 - 2020-08-20

- Add an option to register EventBridge webhooks to `registerWebhook`.

## 2.4.0 - 2020-02-19

- The `ApiVersion` enum now has an `January20` and `April20` options

## 2.3.0 - 2020-01-27

- Add [webhooks for billing](https://help.shopify.com/en/api/guides/billing-api#webhooks-for-billing) to topics

## 2.2.0 - 2019-11-08

### Added

- Add payload to webhook data for the `receiveWebhook` middleware ([#1168](https://github.com/Shopify/quilt/pull/1168)).

### Fixed

- Fixed a typo in the README ([#1167](https://github.com/Shopify/quilt/pull/1167)).

## 2.1.0 - 2019-10-03

- The `ApiVersion` enum now has an `October19` option

## 2.0.0 - 2019-09-26

_Breaking change_

- Added API version to GraphQL endpoint.

## 1.1.4 - 2019-03-29

- Check success via valid webhookSubscription field

## 1.1.3 - 2019-03-22

- Return a GraphQL formatted topic

## 1.1.2

- Added 1.1.1 version to CHANGELOG

## 1.1.1

### Fixed

- Fixed a typo in the README

## 1.1.0

### Changed

- Updates webhook registration to use GraphQL

## 1.0.1

### Fixed

- Fixed a typo in the README

## 1.0.0

### Added

- `@shopify/koa-shopify-webhooks` package
