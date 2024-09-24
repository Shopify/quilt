# Changelog

## 6.4.0

### Minor Changes

- [#2816](https://github.com/Shopify/quilt/pull/2816) [`4638287`](https://github.com/Shopify/quilt/commit/46382871c238fe6563e093697b508f500842b80d) Thanks [@admirsaheta](https://github.com/admirsaheta)! - - Allow `output.chunkFilename` to be a function or string.
  - `compiler.options.output.filename` and `compiler.options.output.chunkFilename` now default to `[name].js` when undefined.

## 6.3.1

### Patch Changes

- [#2835](https://github.com/Shopify/quilt/pull/2835) [`3a1077c`](https://github.com/Shopify/quilt/commit/3a1077c2d2d8a55797d83e330c5a9607e42da78b) Thanks [@jesstelford](https://github.com/jesstelford)! - Ensure the correct babel types are used internally

## 6.3.0

### Minor Changes

- [#2791](https://github.com/Shopify/quilt/pull/2791) [`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892) Thanks [@vsumner](https://github.com/vsumner)! - Update typescript, eslint, and prettier

## 6.2.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

## 6.1.2

### Patch Changes

- [#2767](https://github.com/Shopify/quilt/pull/2767) [`957132820`](https://github.com/Shopify/quilt/commit/9571328209ef77c247f957c68f63eb5c1c971a86) Thanks [@BPScott](https://github.com/BPScott)! - Allow webpack-virtual-modules ^0.6.0 as a peer dependency

## 6.1.1

### Patch Changes

- [#2718](https://github.com/Shopify/quilt/pull/2718) [`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @babel/traverse from 7.17.9 to 7.23.2

## 6.1.0

### Minor Changes

- [#2747](https://github.com/Shopify/quilt/pull/2747) [`f019b983e`](https://github.com/Shopify/quilt/commit/f019b983eb45d317468ca8a4b258192ac05fd0be) Thanks [@robin-drexler](https://github.com/robin-drexler)! - Allow to override worker public path

## 6.0.5

### Patch Changes

- [#2654](https://github.com/Shopify/quilt/pull/2654) [`e470978cf`](https://github.com/Shopify/quilt/commit/e470978cfa2b4e147dde7a97fa57ad305c3daa1b) Thanks [@BPScott](https://github.com/BPScott)! - Widen peerDependency range for webpack-virtual-modules, to allow for v0.5.x

## 6.0.4

### Patch Changes

- [#2630](https://github.com/Shopify/quilt/pull/2630) [`739988dc8`](https://github.com/Shopify/quilt/commit/739988dc8c3d76c9219ab54e27d993bd177a2d16) Thanks [@vsumner](https://github.com/vsumner)! - Expose `@shopify/web-worker/webpack-loader` export

## 6.0.3

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

## 6.0.2

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 6.0.1

### Patch Changes

- [#2567](https://github.com/Shopify/quilt/pull/2567) [`85728a2f3`](https://github.com/Shopify/quilt/commit/85728a2f3a96ccba30a1f2ef0ca1ea3f6572b073) Thanks [@alexandcote](https://github.com/alexandcote)! - Fixing an issue with the babel-plugin when user try to import `createWorkerFactory` or `createPlainWorkerFactory` from `@shopify/react-web-worker`

## 6.0.0

### Major Changes

- [#2526](https://github.com/Shopify/quilt/pull/2526) [`eece629bd`](https://github.com/Shopify/quilt/commit/eece629bd750fb9c8eef26bb39937d3f645cd486) Thanks [@atesgoral](https://github.com/atesgoral)! - Remove the deprecated type attribute from generated HTML for <style> and <script> elements.

  Marking this as a breaking change because it may affect consumers expecting these attributes to be present.

## 5.0.1

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

## 5.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 4.0.5 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 4.0.4 - 2022-03-07

### Changed

- Export cjs by default for `babel` and `webpack`. [[#2193](https://github.com/Shopify/quilt/pull/2193)]

## 4.0.3 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 4.0.2 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 4.0.1 - 2022-02-01

- No updates. Transitive dependency bump.

## 4.0.0 - 2021-12-01

### Breaking Change

- Added support for webpack 5 and removed support for webpack 4 [[#2013](https://github.com/Shopify/quilt/pull/2013)]

## 3.0.3 - 2021-11-25

### Changed

- Update error messages to report `@shopify/web-worker`. [[#2088](https://github.com/Shopify/quilt/pull/2088)]

## 3.0.2 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.0.1 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.0.0 - 2021-11-08

### Changed

- Replaced this package with the contents of [`@remote-ui/web-workers`](https://github.com/Shopify/remote-dom/tree/667a04b5c0e618436781164a2546390c984dd8ec/packages/web-workers) as of version `1.5.7`. This change was made in order to deprecate `@remote-ui/web-workers`; anyone who was previously using that package should move to depending on this one (`@shopify/web-worker`) instead.

## 2.1.5 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 2.1.4 - 2021-08-26

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2011)]

## 2.1.3 - 2021-08-24

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]
- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 2.1.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 2.1.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 2.1.0 - 2021-06-08

### Changed

- Update `webpack-virtual-modules` to 0.4.3 which support webpack 5

## 2.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 1.5.5 - 2021-04-27

### Changed

- Updated webpack dependency to be ^4.25.1

## 1.5.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.5.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.4.2 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.4.0 - 2020-05-29

- Bump `webpack-virtual-modules` to `v0.2.2` [[#1484]](https://github.com/Shopify/quilt/pull/1484)

## 1.3.1 - 2019-11-12

### Fixed

- Fixed an issue where imports would not be processed by the Babel plugin if multiple values were imported from `@shopify/web-worker` or `@shopify/react-web-worker`.

## 1.3.0 - 2019-11-11

### Added

- This library now exports a `createPlainWorkerFactory` function, which can be used to create a function that will create `Worker` objects wrapping a module. This can be used in cases where the automatic wrapping of the worker in `@shopify/rpc` is not desirable ([#1174](https://github.com/Shopify/quilt/pull/1174)).
- The functions returned by `createWorkerFactory` and `createPlainWorkerFactory` now have a `url` property ([#1174](https://github.com/Shopify/quilt/pull/1174)).

### Fixed

- Fixed an issue with messages being lost when using the `createIframeWorkerMessenger` function ([#1174](https://github.com/Shopify/quilt/pull/1174)).

## 1.2.0 - 2019-11-08

### Changed

- Uses the new `@shopify/rpc` library for communication with the worker ([#1172](https://github.com/Shopify/quilt/pull/1172)).

### Added

- You can now supply an optional options object to the `createWorkerFactory` functions. One option is currently supported: `createMessenger`, which allows you to customize the message channel for the worker ([#1172](https://github.com/Shopify/quilt/pull/1172)).
- To support creating workers that are not treated as same-origin, the library now provides a `createIframeWorkerMessenger` function. This function is passed to the new `createMessenger` API, and works by creating a message channel directly from the host page to a worker in a sandboxed `iframe` ([#1172](https://github.com/Shopify/quilt/pull/1172)).

## 1.1.0 - 2019-10-21

### Added

- Multiple workers in a single app now get unique names automatically, and can provide an explicit name for the worker file using the `webpackChunkName` comment ([#1132](https://github.com/Shopify/quilt/pull/1132))

## 1.0.1 - 2019-10-18

### Fixed

- `terminate()` now releases the script created with `URL.createObjectURL()` alongside terminating the worker.

## 1.0.0 - 2019-10-18

### Changed

- `createWorker` has been renamed to `createWorkerFactory` ([#1129](https://github.com/Shopify/quilt/pull/1129)).

### Fixed

- Fixed additional issues with `retain` and `release` on deep structures ([#1129](https://github.com/Shopify/quilt/pull/1129)).

## 0.0.8 - 2019-10-18

### Fixed

- `createWorker` now works correctly when the webpack build uses only a pathname for `output.publicPath` ([#1126](https://github.com/Shopify/quilt/pull/1126)).
- `retain` and `release` now correctly deeply retain/ release objects and arrays.

## 0.0.4 - 2019-10-15

### Added

- `createWorker` now falls back to using the module directly in cases (like the test environment) where the value is not transformed into a script URL ([#1113](https://github.com/Shopify/quilt/pull/1113))
- `@shopify/web-worker/babel` now supports a `noop` mode (for generating a noop worker in environments that don’t support `Worker`, like the server) and properly restricts transformations to only relevant packages ([#1112](https://github.com/Shopify/quilt/pull/1112))

## 0.0.1 - 2019-10-07

Initial (pre-)release.
