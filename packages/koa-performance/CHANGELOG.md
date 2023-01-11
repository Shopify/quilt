# Changelog

## 3.4.3

### Patch Changes

- Updated dependencies [[`fbf76bcc5`](https://github.com/Shopify/quilt/commit/fbf76bcc550f5178cf939d44d6559c4e882a7ccd)]:
  - @shopify/performance@3.2.2

## 3.4.2

### Patch Changes

- Updated dependencies [[`3b228b4f3`](https://github.com/Shopify/quilt/commit/3b228b4f34a57894ad552188f55dfce372324b85)]:
  - @shopify/statsd@4.2.0

## 3.4.1

### Patch Changes

- Updated dependencies [[`da04b9e63`](https://github.com/Shopify/quilt/commit/da04b9e63819a51abfca04008e01f6935d886297)]:
  - @shopify/statsd@4.1.1

## 3.4.0

### Minor Changes

- [#2490](https://github.com/Shopify/quilt/pull/2490) [`c31016fa3`](https://github.com/Shopify/quilt/commit/c31016fa321ef5449973a7eb50e63fe7a86184dc) Thanks [@alexandcote](https://github.com/alexandcote)! - The middleware now accepts an optional StatsDClient instance

## 3.3.1

### Patch Changes

- Updated dependencies [[`9396ac6eb`](https://github.com/Shopify/quilt/commit/9396ac6eb66220ad1dd40c57f66c193cd14e4780), [`472e3556a`](https://github.com/Shopify/quilt/commit/472e3556a07cb3315261e043d19a44a01ca17432), [`dcb3c54c0`](https://github.com/Shopify/quilt/commit/dcb3c54c064331ce45cc99958dd68d0d0a769f72), [`da62f58f4`](https://github.com/Shopify/quilt/commit/da62f58f46bb3a27f55ef4cc59c5292b9a842a24)]:
  - @shopify/statsd@4.1.0
  - @shopify/performance@3.2.1

## 3.3.0

### Minor Changes

- [#2478](https://github.com/Shopify/quilt/pull/2478) [`1570b951d`](https://github.com/Shopify/quilt/commit/1570b951d2f865120dcf7f198d23a4e935fe6042) Thanks [@ryanwilsonperkin](https://github.com/ryanwilsonperkin)! - Add a new metric to track Largest Contentful Paint

### Patch Changes

- Updated dependencies [[`1570b951d`](https://github.com/Shopify/quilt/commit/1570b951d2f865120dcf7f198d23a4e935fe6042)]:
  - @shopify/performance@3.2.0

## 3.2.1

### Patch Changes

- Updated dependencies [[`1f76ed324`](https://github.com/Shopify/quilt/commit/1f76ed324172fe90048423e7a0503b762d7424af)]:
  - @shopify/performance@3.1.1

## 3.2.0

### Minor Changes

- [#2410](https://github.com/Shopify/quilt/pull/2410) [`d177f331f`](https://github.com/Shopify/quilt/commit/d177f331fad258efa87ef4a38c4359e702144a89) Thanks [@jakejosephcs](https://github.com/jakejosephcs)! - An anomalous navigation download size threshold can now be passed in as a parameter to `clientPerformanceMetrics`

## 3.1.0

### Minor Changes

- [#2413](https://github.com/Shopify/quilt/pull/2413) [`21435a256`](https://github.com/Shopify/quilt/commit/21435a2562822ef76d3ede49c8b1eaefc1fe475d) Thanks [@rorans](https://github.com/rorans)! - Introduce a RedirectDuration metric to get more specific server latency timings. This information will be sent via TTFB metadata. No changes need to be made on the consumer.

### Patch Changes

- Updated dependencies [[`21435a256`](https://github.com/Shopify/quilt/commit/21435a2562822ef76d3ede49c8b1eaefc1fe475d)]:
  - @shopify/performance@3.1.0

## 3.0.4

### Patch Changes

- Updated dependencies [[`2094cb39a`](https://github.com/Shopify/quilt/commit/2094cb39a674d38a19394b79bf59c11a65ff9e15)]:
  - @shopify/performance@3.0.2

## 3.0.3

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/network@3.2.1
  - @shopify/performance@3.0.1
  - @shopify/statsd@4.0.1

## 3.0.2

### Patch Changes

- Updated dependencies [[`30005950b`](https://github.com/Shopify/quilt/commit/30005950baa33cf0ae7eda6d4fe1cc81fdb2ef70)]:
  - @shopify/network@3.2.0

## 3.0.1

### Patch Changes

- Updated dependencies [[`44eb34763`](https://github.com/Shopify/quilt/commit/44eb347633a86f4407f6f794f16c75e68e25c11d)]:
  - @shopify/network@3.1.0

## 3.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 2.2.0 - 2022-05-03

### Added

- additionalTags, additionalNavigationTags, and additionalNavigationMetrics
  callbacks are now passed a context argument. [[#2262](https://github.com/Shopify/quilt/pull/2262)]

## 2.1.4 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 2.1.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 2.1.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 2.1.1 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 2.1.0 - 2022-01-13

### Changed

- Update `koa-compose` to `4.1.0` [[#2128](https://github.com/Shopify/quilt/pull/2128)]

## 2.0.10 - 2021-11-30

- No updates. Transitive dependency bump.

## 2.0.9 - 2021-11-25

- No updates. Transitive dependency bump.

## 2.0.8 - 2021-11-23

- No updates. Transitive dependency bump.

## 2.0.7 - 2021-11-22

- No updates. Transitive dependency bump.

## 2.0.6 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.0.5 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 2.0.4 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.0.3 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.0.2 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.4.1 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.4.0 - 2021-03-23

### Added

- Adds the ability to pass custom tags to additional navigation metrics [#1792](https://github.com/Shopify/quilt/pull/1792)

## 1.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.2.8 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.2.0 - 2020-02-05

### Added

- Middleware now adds a `locale` tag to distributions (if provided) [#1260](https://github.com/Shopify/quilt/pull/1260)

## 1.1.0 - 2019-10-25

### Added

- `clientMetricsMiddleware` no longer requires `development?` to be explicitly set in it's `options` parameter. If the parameter is missing it will default to `true` when `process.env.NODE_ENV` is `true`, and `false` otherwise.

## 1.0.0 - 2019-10-08

### Added

- `@shopify/koa-performance` package [#1095](https://github.com/Shopify/quilt/pull/1095)
