# Changelog

## 6.0.0

### Major Changes

- [#2820](https://github.com/Shopify/quilt/pull/2820) [`df5d12a`](https://github.com/Shopify/quilt/commit/df5d12ae4b070a39198644a02e5908720248d719) Thanks [@alex-page](https://github.com/alex-page)! - Remove React 17 compatability

## 5.4.0

### Minor Changes

- [#2791](https://github.com/Shopify/quilt/pull/2791) [`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892) Thanks [@vsumner](https://github.com/vsumner)! - Update typescript, eslint, and prettier

### Patch Changes

- Updated dependencies [[`d691952`](https://github.com/Shopify/quilt/commit/d691952749248efd274a2a9a67c8879b9241c892)]:
  - @shopify/useful-types@5.3.0

## 5.3.0

### Minor Changes

- [#2785](https://github.com/Shopify/quilt/pull/2785) [`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for node 14 and 16. Support node LTS and up.

- [#2787](https://github.com/Shopify/quilt/pull/2787) [`f50049004`](https://github.com/Shopify/quilt/commit/f500490042d922b66a6781c3450f876a83a120cb) Thanks [@vsumner](https://github.com/vsumner)! - Drop support for React 17

### Patch Changes

- Updated dependencies [[`97f8f6cf5`](https://github.com/Shopify/quilt/commit/97f8f6cf5f0f5c8adc03ff6d907fb16d878fbece)]:
  - @shopify/useful-types@5.2.0

## 5.2.0

### Minor Changes

- [#2773](https://github.com/Shopify/quilt/pull/2773) [`8498746a7`](https://github.com/Shopify/quilt/commit/8498746a7478a33ad64b3e3e99a4a7a02e5ae41a) Thanks [@jas7457](https://github.com/jas7457)! - Change act to use from 'react' if it exists, fallback to 'react-dom/test-utils'

## 5.1.5

### Patch Changes

- [#2718](https://github.com/Shopify/quilt/pull/2718) [`591e65366`](https://github.com/Shopify/quilt/commit/591e653663440408588447159d1758273b189d47) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @babel/traverse from 7.17.9 to 7.23.2

## 5.1.4

### Patch Changes

- [#2709](https://github.com/Shopify/quilt/pull/2709) [`a1ed06dc9`](https://github.com/Shopify/quilt/commit/a1ed06dc9f11379b685e48afabd3d621ff88e63c) Thanks [@developit](https://github.com/developit)! - Fix forceUpdate via cloneElement to re-render TestWrapper React tree

## 5.1.3

### Patch Changes

- [#2612](https://github.com/Shopify/quilt/pull/2612) [`39e910e30`](https://github.com/Shopify/quilt/commit/39e910e30f1cd7803a66afde5c2c8ab894b57e59) Thanks [@melnikov-s](https://github.com/melnikov-s)! - Fixed a null exception if the inner root component is unmounted by the outer wrapper during an act

## 5.1.2

### Patch Changes

- [#2608](https://github.com/Shopify/quilt/pull/2608) [`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` everywhere that we deal with importing types

- Updated dependencies [[`ba4da84d5`](https://github.com/Shopify/quilt/commit/ba4da84d5237603433f8097f79421bab6ea48f86)]:
  - @shopify/useful-types@5.1.2

## 5.1.1

### Patch Changes

- [#2593](https://github.com/Shopify/quilt/pull/2593) [`2f731db68`](https://github.com/Shopify/quilt/commit/2f731db6883193d3d9fe9ada9374fb7d4d8a762f) Thanks [@BPScott](https://github.com/BPScott)! - Remove unneeded `void 0` class property initializations

- [#2595](https://github.com/Shopify/quilt/pull/2595) [`93ec0a0e5`](https://github.com/Shopify/quilt/commit/93ec0a0e57a1962a455f15a46977a3c05a02369f) Thanks [@BPScott](https://github.com/BPScott)! - Use `import type` when importing types

## 5.1.0

### Minor Changes

- [#2540](https://github.com/Shopify/quilt/pull/2540) [`8ba6cbbe0`](https://github.com/Shopify/quilt/commit/8ba6cbbe025c3471235037f404b6c6a76b9681be) Thanks [@phbou72](https://github.com/phbou72)! - Remove last require() in react-testing so we can use it with a modern tests runner

- [#2409](https://github.com/Shopify/quilt/pull/2409) [`0bff6fad7`](https://github.com/Shopify/quilt/commit/0bff6fad7b0630d1b796bb457d8d86e81ececedd) Thanks [@BPScott](https://github.com/BPScott)! - Update types to account changes in TypeScript 4.8 and 4.9. [Propogate contstraints on generic types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#unconstrained-generics-no-longer-assignable-to) and update type usage relating to `Window` and `Navigator`. Technically this makes some types stricter, as attempting to pass `null|undefined` into certain functions is now disallowed by TypeScript, but these were never expected runtime values in the first place.

## 5.0.1

### Patch Changes

- [#2438](https://github.com/Shopify/quilt/pull/2438) [`bc50c0de2`](https://github.com/Shopify/quilt/commit/bc50c0de23d6711e631ab2d808a820fc1eebf604) Thanks [@melnikov-s](https://github.com/melnikov-s)! - Fix act queue emptying for React 17

- [#2441](https://github.com/Shopify/quilt/pull/2441) [`cf70a15a6`](https://github.com/Shopify/quilt/commit/cf70a15a6690c93823a0803200ddba1a71077211) Thanks [@melnikov-s](https://github.com/melnikov-s)! - Fixed an issue with useLazyQuery failing due to act resolving a tick later

## 5.0.0

### Major Changes

- [#2352](https://github.com/Shopify/quilt/pull/2352) [`963f1caf4`](https://github.com/Shopify/quilt/commit/963f1caf4d7c80ca089b49309d9833a14ca2b3e2) Thanks [@melnikov-s](https://github.com/melnikov-s)! - React `act` promise queues are now emptied when root wrappers are destroyed. This prevents unresolved promises from causing stuck queues and thus failures in subsequent test cases.

  The `destroyAll()` and `root.destroy()` functions are now asynchronous and return promises. Calls to either of these functions must now be `await`ed.

  ```diff
  - destroyAll()
  + await destroyAll()
  ```

## 4.2.2

### Patch Changes

- [#2404](https://github.com/Shopify/quilt/pull/2404) [`afdf2f9dd`](https://github.com/Shopify/quilt/commit/afdf2f9dd84f1f5a416d804efa5d459935a9d178) Thanks [@melnikov-s](https://github.com/melnikov-s)! - TriggerKeypath now fails typecheck on invalid array indices

## 4.2.1

### Patch Changes

- [#2398](https://github.com/Shopify/quilt/pull/2398) [`b37ec58b6`](https://github.com/Shopify/quilt/commit/b37ec58b6b0a9186736fa8e39fbf3f304beb2336) Thanks [@melnikov-s](https://github.com/melnikov-s)! - Fix triggerKeyPath when path resolves to a type that is unioned with an empty object type ({})

## 4.2.0

### Minor Changes

- [#2356](https://github.com/Shopify/quilt/pull/2356) [`84d4756eb`](https://github.com/Shopify/quilt/commit/84d4756eb5149ee419cf6b989b2247db9932b95d) Thanks [@melnikov-s](https://github.com/melnikov-s)! - Fully typed triggerKeypath method

### Patch Changes

- [#2389](https://github.com/Shopify/quilt/pull/2389) [`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532) Thanks [@BPScott](https://github.com/BPScott)! - Add types field to package.json export maps to support typescript consumers that use `moduleResolution: "node16"`

- Updated dependencies [[`03c1abc8c`](https://github.com/Shopify/quilt/commit/03c1abc8c293d4c79f34796f9eefc777812df532)]:
  - @shopify/useful-types@5.1.1

## 4.1.1

### Patch Changes

- Updated dependencies [[`b42a99a7d`](https://github.com/Shopify/quilt/commit/b42a99a7de6c2d88b24920fa70f7490ae1086d5f)]:
  - @shopify/useful-types@5.1.0

## 4.1.0 - 2022-06-08

### Added

- Support for React 18 and backwards compatibility for React 17 [[#2248](https://github.com/Shopify/quilt/pull/2248)]
- Matrix testing of React 17 & 18 versions in CI [[#2248](https://github.com/Shopify/quilt/pull/2248)]

## 4.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

## 3.3.10 - 2022-04-25

- No updates. Transitive dependency bump.

## 3.3.9 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 3.3.8 - 2022-03-07

- No updates. Transitive dependency bump.

## 3.3.7 - 2022-02-28

### Changed

- Fix `Node.trigger()` not resolving values that can be `undefined`. [[#2192](https://github.com/Shopify/quilt/pull/2192)]

## 3.3.6 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

## 3.3.5 - 2022-02-14

### Changed

- Reduce usage of `@shopify/useful-types` by using built-in types. [[#2163](https://github.com/Shopify/quilt/pull/2163)]

## 3.3.4 - 2022-02-09

- No updates. Transitive dependency bump.

## 3.3.3 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 3.3.2 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 3.3.1 - 2022-01-19

- No updates. Transitive dependency bump.

## 3.3.0 - 2021-12-07

### Added

- Added new `cleanup` option to `createMount` [[#2102](https://github.com/Shopify/quilt/pull/2102)]

## 3.2.9 - 2021-11-23

- No updates. Transitive dependency bump.

## 3.2.8 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 3.2.7 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 3.2.6 - 2021-09-14

- No updates. Transitive dependency bump.

## 3.2.5 - 2021-09-14

### Changed

- Enable type checking in tests and fix type errors. [[#2034](https://github.com/Shopify/quilt/pull/2034)]

## 3.2.4 - 2021-08-24

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 3.2.3 - 2021-08-13

### Changed

- Added ability to specify a generic when calling `findWhere` and `findWhereAll` [[#1999](https://github.com/Shopify/quilt/pull/1999)]
- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 3.2.2 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 3.2.1 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 3.2.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

### Fixed

- Changes to tests for compatibility in dev. [#1957](https://github.com/Shopify/quilt/issues/1957)

## 3.1.0 - 2021-06-29

### Added

- Now supports React-17 [#1958](https://github.com/Shopify/quilt/pull/1958)

## 3.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.3.1 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 2.3.0 - 2021-04-07

- Improved the performance of Root wrapper updates [#1812](https://github.com/Shopify/quilt/pull/1812)

## 2.2.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 2.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 2.1.4 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 2.1.1 - 2020-05-29

### Fixed

- Remove cast for `act` following update to `@types/react-dom`

## 2.1.0 - 2020-04-20

### Changed

- `jest.Matchers` type updated to match `@types/jest` version `25` [[#1239](https://github.com/Shopify/quilt/pull/1239)]
- Update `jest-matcher-utils` to `25` [[#1375](https://github.com/Shopify/quilt/pull/1375)]

## 2.0.0 - 2020-02-27

- Type error while using `[toHaveReactProps](https://github.com/Shopify/quilt/issues/1212) is now resolved by updating`@types/jest`to`24.9.1`. [#1212](https://github.com/Shopify/quilt/issues/1212)

## 1.8.0 - 2019-10-08

### Added

- new `debug()` function added to `Root` and `Element` to inspect mounted structure ([#1088](https://github.com/Shopify/quilt/pull/1088))

## 1.7.10 - 2019-09-30

### Fixed

- Fixed `html()` to properly return the outermost wrapping DOM tags ([#1042](https://github.com/Shopify/quilt/pull/1042))

## 1.7.9 - 2019-09-27

### Changed

- Both `toContainReactComponent` and `toContainReactComponentTimes` matcher will now throw a more useful error if the expected value is `null` or `undefined` ([#1047](https://github.com/Shopify/quilt/pull/1047))

## 1.7.6 - 2019-08-27

### Fixed

- Fixed `find` and `findAll` not returning the correct type when being passed a string that matches `JSX.IntrinsicElements` ([#906](https://github.com/Shopify/quilt/pull/906))

## 1.7.1 - 2019-07-16

### Fixed

- explicitly defining return type for `findWhere` and `findAllWhere` operators ([#795](https://github.com/Shopify/quilt/pull/795))

## 1.7.0 - 2019-07-15

### Added

- Added a `toContainReactComponentTimes` matcher ([#781](https://github.com/Shopify/quilt/pull/781))
- Added the ability to extend a custom mount function with `createMount().extend()` ([#788](https://github.com/Shopify/quilt/pull/788))
- `Root` and `Element` now both implement the newly-exported `Node` type, which can be used to request any object that satisfies the traversal and introspection APIs ([#793](https://github.com/Shopify/quilt/pull/793))

## 1.6.0 - 2019-06-04

### Added

- Added a `toProvideReactContext` matcher ([#735](https://github.com/Shopify/quilt/pull/735))

## 1.5.4 - 2019-05-31

### Fixed

- When using a custom mount with `createMount`, calling `setProps` on the resulting elements will now properly set props on the JSX that was mounted, not the element returned from the `createMount` `render` option ([#726](https://github.com/Shopify/quilt/pull/726)).

  > **Note**: In order to support the above, a small change was made to the `Root` class’s constructor. If you were calling this directly (which is discouraged), you will need to use the new `resolveRoot` option instead of the existing second argument. Additionally, if you were manually passing through additional props in a component you used to wrap elements in `createMount.render`, you can now remove this workaround.

## 1.5.3 - 2019-05-22

### Fixed

- Passing unresolved promises within `act()` blocks required additional nesting ([#697](https://github.com/Shopify/quilt/pull/697))

## 1.5.0 - 2019-05-09

### Changed

- Upgraded React to versions 16.9.0-alpha.0 and added support for async `act()` calls ([#688](https://github.com/Shopify/quilt/pull/688))

## 1.4.3 - 2019-05-02

### Fixed

- `Root/Element#find` now correctly find components created by `React.memo` and `React.forwardRef` ([#682](https://github.com/Shopify/quilt/pull/682))

## 1.4.0 - 2019-04-18

### Changed

- `Root/Element#trigger()` now allow passing a deep partial version of the arguments of the prop being triggered ([#661](https://github.com/Shopify/quilt/pull/661))

## 1.3.2 - 2019-04-09

### Fixed

- Fixed an issue were a leaf DOM node would return `null` for `domNode` ([#622](https://github.com/Shopify/quilt/pull/622))

## 1.3.0 - 2019-04-02

### Added

- Added `.toContainReactText` and `.toContainReactHtml` matchers ([#626](https://github.com/Shopify/quilt/pull/626))

### Changed

- Calling `Root#act` within another callback to `Root#act` now groups the update into a single `act()` block ([#626](https://github.com/Shopify/quilt/pull/626))

## 1.2.0 - 2019-04-01

### Added

- Added a `createMount` factory that can create mount functions tailor-made to suit the global state for individual applications ([#624](https://github.com/Shopify/quilt/pull/624))

## 1.1.0 - 2019-03-29

### Added

- Added a `@shopify/react-testing/matchers` directory, which adds `.toHaveReactProps` and `.toContainReactComponent` assertions for Jest ([#621](https://github.com/Shopify/quilt/pull/621))
- `Element#find` and `Element#findAll` now accept a second optional argument for required props on matched elements ([#621](https://github.com/Shopify/quilt/pull/621))

## 1.0.0 - 2019-03-29

Initial release.
