# Changelog

## 7.2.0

### Minor Changes

- [#2331](https://github.com/Shopify/quilt/pull/2331) [`79302260e`](https://github.com/Shopify/quilt/commit/79302260e90f5668a67aefb35f1ccc66c3dbc625) Thanks [@depl0y](https://github.com/depl0y)! - Add `DateStyle.DateTime`. to format dates in the style `Jun 12, 2022 at 10:34 pm`

### Patch Changes

- Updated dependencies [[`b42a99a7d`](https://github.com/Shopify/quilt/commit/b42a99a7de6c2d88b24920fa70f7490ae1086d5f)]:
  - @shopify/useful-types@5.1.0

## 7.1.3 - 2022-06-08

- No updates. Transitive dependency bump.

## 7.1.2 - 2022-05-31

### Fixed

- Fixed regression where object replacement values were being cast as strings. [[#2295](https://github.com/Shopify/quilt/pull/2295)]

## 7.1.1 - 2022-05-30

### Fixed

- Passing a number replacement value was returning an array instead of a string. [[#2292](https://github.com/Shopify/quilt/pull/2292)]

## 7.1.0 - 2022-05-19

### Added

- Added an `interpolate` option to support custom placeholder formats [[#2267](https://github.com/Shopify/quilt/pull/2267)]

## 7.0.0 - 2022-05-19

### Breaking Change

- Drop support for node 12 and Safari 10, 11 and 12. Remove wildcard export in exports field. [[#2277](https://github.com/Shopify/quilt/pull/2277)]

### Fixed

- Patch - `generateTranslationIndexes` no longer fails with `ENOBUFS` errors in projects with tens of thousands of translation files [[#2269](https://github.com/Shopify/quilt/pull/2269)]
- Patch - Updated list of currency decimal places according to [ISO 4217 standards](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=maintenance-agency) [[#2260](https://github.com/Shopify/quilt/pull/2260)]

## 6.4.0 - 2022-04-25

### Added

- Minor - `generateTranslationIndexes` now parses jsonc files (when they have a `.json` extension) [[#2239](https://github.com/Shopify/quilt/pull/2239)]

### Fixed

- Patch - `generateTranslationIndexes` no longer fails with `ENOBUFS` errors in projects with many thousands of translation files [[#2239](https://github.com/Shopify/quilt/pull/2239)]
- Patch - `generateTranslationIndexes` now ignores these directories: `.git`; `build`; `node_modules`; `public`; `tmp` [[#2239](https://github.com/Shopify/quilt/pull/2239)]

## 6.3.13 - 2022-03-15

- No updates. Transitive dependency bump.

## 6.3.12 - 2022-03-09

### Changed

- Correct wildcard export to `./*` [[#2209](https://github.com/Shopify/quilt/pull/2209)]

## 6.3.11 - 2022-03-07

### Changed

- Export cjs by default for `babel`. [[#2193](https://github.com/Shopify/quilt/pull/2193)]

## 6.3.10 - 2022-02-28

- No updates. Transitive dependency bump.

## 6.3.9 - 2022-02-25

### Changed

- Use `./*` instead of `./` in package.json exports to fix deprecation warning. [[#2184](https://github.com/Shopify/quilt/pull/2184)]

### Fixed

- Updated list of currency decimal places according to [ISO 4217 standards](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=maintenance-agency) [[#2187](https://github.com/Shopify/quilt/pull/2187)]
- Fixed `unformatNumber` and `unformatCurrency` to return `''` when only non-digits are provided in the input string. [[#2176](https://github.com/Shopify/quilt/pull/2176)]

## 6.3.8 - 2022-02-14

- No updates. Transitive dependency bump.

## 6.3.7 - 2022-02-09

- No updates. Transitive dependency bump.

## 6.3.6 - 2022-02-01

### Changed

- Rerelease after failed publish. No code changes.

## 6.3.5 - 2022-02-01

### Changed

- Reorder exports map to prioritize the `esnext` condition. [[#2148](https://github.com/Shopify/quilt/pull/2148)]
- Update Loom build config. [[#2150](https://github.com/Shopify/quilt/pull/2150)]

## 6.3.4 - 2022-01-28

- No updates. Transitive dependency bump.

## 6.3.3 - 2022-01-28

### Fixed

- Fixed `unformatCurrency` to be callable on its own result for locales like `vi` and `it` when a period is a thousands separator. [[#2139](https://github.com/Shopify/quilt/pull/2139)]

## 6.3.2 - 2022-01-19

- No updates. Transitive dependency bump.

## 6.3.1 - 2022-01-18

### Fixed

- Fixed `unformatCurrency` to unformat correctly for locales like `vi` and `it` when a period is a thousands separator. [[#2126](https://github.com/Shopify/quilt/pull/2126)]

## 6.3.0 - 2022-01-06

### Changed

- Transforming the space for a non-breaking space on formatted time. [[#2041](https://github.com/Shopify/quilt/pull/2041)]

## 6.2.8 - 2021-12-07

- No updates. Transitive dependency bump.

## 6.2.7 - 2021-12-01

- No updates. Transitive dependency bump.

## 6.2.6 - 2021-11-23

- No updates. Transitive dependency bump.

## 6.2.5 - 2021-11-22

### Changed

- Fixed babel helpers file being generated with incorrect filename in esm build. [[#2082](https://github.com/Shopify/quilt/pull/2082)]

## 6.2.4 - 2021-11-15

### Fixed

- Updated regex for humanized timezones to include offsets [#2077](https://github.com/Shopify/quilt/pull/2077)

## 6.2.3 - 2021-09-24

### Changed

- Migrate from `sewing-kit-next` to `loom` for building - package build output remains identical. [[#2039](https://github.com/Shopify/quilt/pull/2039)]

## 6.2.2 - 2021-09-14

- No updates. Transitive dependency bump.

## 6.2.1 - 2021-09-14

- No updates. Transitive dependency bump.

## 6.2.0 - 2021-09-03

### Added

- Added `with-explicit-paths` option to babel plugin. [#1973](https://github.com/Shopify/quilt/pull/1973)

## 6.1.9 - 2021-08-30

### Changed

- Enable type checking in tests and fix type errors. [[#2011](https://github.com/Shopify/quilt/pull/2014)]

## 6.1.8 - 2021-08-26

- No updates. Transitive dependency bump.

## 6.1.7 - 2021-08-24

### Fixed

- Fix format currency double negative bug in nordic regions [[#2004](https://github.com/Shopify/quilt/pull/2004)]

### Changed

- Added file exclusion for tests to package.json. [[#2005](https://github.com/Shopify/quilt/pull/2005)]
- Rename test/ to tests/ [[#2005](https://github.com/Shopify/quilt/pull/2005)]

## 6.1.6 - 2021-08-13

### Changed

- Updated build tooling, types are now compiled with TypeScript 4.3. [[#1997](https://github.com/Shopify/quilt/pull/1997)]

## 6.1.5 - 2021-08-10

### Changed

- Update dependency on `change-case`. [[#1990](https://github.com/Shopify/quilt/pull/1990)]

## 6.1.4 - 2021-08-04

### Changed

- Ensure `tsconfig.tsbuildinfo` file is not uploaded to the npm registry. [[#1982](https://github.com/Shopify/quilt/pull/1982)]. [[#1982](https://github.com/Shopify/quilt/pull/1982)]

## 6.1.3 - 2021-08-03

### Changed

- Update to latest sewing-kit-next for build. Update `types`/`typesVersions` fields to point directly into the build folder [[#1980](https://github.com/Shopify/quilt/pull/1980)]

## 6.1.2 - 2021-07-28

### Changed

- Makes humanized short timezones uppercase. [#1977](https://github.com/Shopify/quilt/pull/1977)

### Fixed

- added back `toLocalLowerCase` to humanized times. [#1972](https://github.com/Shopify/quilt/pull/1972) removed it which caused `am` and `pm` to be capitalized in some cases [#1976](https://github.com/Shopify/quilt/pull/1976)

## 6.1.1 - 2021-07-26

### Fixed

- Fixed issue where humanized date options were repeated and not properly capitalized [#1972](https://github.com/Shopify/quilt/pull/1972)

## 6.1.0 - 2021-07-13

### Added

- Officially supports React `17.x` [1969](https://github.com/Shopify/quilt/pull/1969/files)

## 6.0.4 - 2021-06-29

- No updates. Transitive dependency bump.

## 6.0.3 - 2021-06-22

### Changed

- Update `@babel/core` to `^7.14.6` [#1948](https://github.com/Shopify/quilt/pull/1948)

## 6.0.2 - 2021-06-17

### Changed

- Update `fs-extra` to `^9.1.0` [#1946](https://github.com/Shopify/quilt/pull/1946)

## 6.0.0 - 2021-05-21

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

### Changed

- Updated `currencyDecimalSymbol` to handle mismatched locale/currency [#1912](https://github.com/Shopify/quilt/pull/1912)

## 5.4.0 - 2021-05-20

### Changed

- Added a `none` option to the `CurrencyFormatOptions` that returns a currency-formatted string without a currency symbol [#1907](https://github.com/Shopify/quilt/pull/1907)

### Fixed

- Fixed higher chance of id collision caused by trimming of generated hashes in babel-plugin [#1905](https://github.com/Shopify/quilt/pull/1905)

## 5.3.8 - 2021-05-19

### Fixed

- Fixed `currencyDecimalSymbol` function returning `DECIMAL_NOT_SUPPORTED` for RSD [#1902](https://github.com/Shopify/quilt/pull/1902)

## 5.3.4 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 5.3.2 - 2021-04-07

### Changed

- Error when you don't pass a filename to babel when using the babel plugin. Updated types within babel-plugin so it passes TypeScript's "noImplicitThis" checks. [#1814](https://github.com/Shopify/quilt/pull/1814)

## 5.3.1 - 2021-03-23

### Fixed

- Fixed issue where humanized date for today may be reported as tomorrow [#1797](https://github.com/Shopify/quilt/pull/1797)

## 5.3.0 - 2021-03-11

- Fixed bug in `unformatNumber` that caused the minus sign to be removed from negative numbers [#1758](https://github.com/Shopify/quilt/pull/1758)
- Made private method `numberSymbols` public [#1758](https://github.com/Shopify/quilt/pull/1758)

## 5.2.4 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 5.2.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 5.1.4 - 2020-11-04

- Fix bug in `getTranslationTree` when having multiple translation dictionaries. [#1662](https://github.com/Shopify/quilt/pull/1662)
- Remove unused `noop` util helper [#1669](https://github.com/Shopify/quilt/pull/1669)

## 5.1.3 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 5.1.1 - 2020-09-28

### Fixed

- Fixed `DateStyle.Humanize`'s handling of time zones for dates that are yesterday, today, or tomorrow [[#1623](https://github.com/Shopify/quilt/pull/1623)]

## 5.1.0 - 2020-09-15

### Fixed

- Fixed (updated) currencies list. [[#1632](https://github.com/Shopify/quilt/pull/1632)]

## 5.0.0 - 2020-06-04

### Changed

- Adds future date formatting to `formatDate` for dates less than 1 week away and less than 1 year away [[#1438](https://github.com/Shopify/quilt/pull/1438)]

  Please see the [migration guide](./migration-guide.md) for more information.

## 4.0.0 - 2020-05-29

### Changed

- Updated `I18n#humanizeDate` to humanize today's date as `Today at {time}` [[#1459](https://github.com/Shopify/quilt/pull/1459)]

  Please see the [migration guide](./migration-guide.md) for more information.

### Fixed

- Fixed `DateStyle.Short` zero-padding days ([#1468](https://github.com/Shopify/quilt/pull/1468))

## 3.0.0 - 2020-04-23

### Changed

- Modified `I18n#humanizeDate` to humanize future dates, specifically `Tomorrow at {time}` [[#1391](https://github.com/Shopify/quilt/pull/1391)]

  Please see the [migration guide](./migration-guide.md) for more information.

## 2.6.0 - 2020-04-20

### Changed

- `jest.Matchers` type updated to match `@types/jest` version `25` [[#1239](https://github.com/Shopify/quilt/pull/1239)]

## 2.5.5 - 2020-04-13

### Fixed

- updated `memoizedNumberFormatter` to support all `Intl.NumberFormat` constructor inputs ([#1366](https://github.com/Shopify/quilt/pull/1366))

## 2.5.4 - 2020-04-09

### Added

- adding additional exports: `RegisterOptions`, `CurrencyFormatOptions`, `NumberFormatOptions`, `TranslateOptions`, `RootTranslateOptions`, `Replacements` ([#1365](https://github.com/Shopify/quilt/pull/1365))

### Fixed

- Updated `formatCurrency` to use `memoizedNumberFormatter` to eliminate memory leak ([#1310](https://github.com/Shopify/quilt/pull/1310))

## 2.5.3 - 2020-04-09

### Fixed

- Removed the unicode `RegExp` flag on `getCurrencySymbol` in order to support IE11 ([#1363](https://github.com/Shopify/quilt/pull/1363))

## 2.5.0 - 2020-04-02

### Added

- Add `defaultLocale` option to Babel plugin ([#1225](https://github.com/Shopify/quilt/pull/1225))
- Added `form: 'auto'` option to `formatCurrency`, to automatically select `short` or `explicit` based on `currency` and `defaultCurrency` ([#1350](https://github.com/Shopify/quilt/pull/1350))

## 2.4.1 - 2020-04-02

### Added

- Added korean eastern name formatter

## 2.4.0 - 2020-03-24

### Added

- Added `hasEasternNameOrderFormatter` method, to determine whether an Eastern name order formatter exists for the locale/language

## 2.3.10 - 2020-02-27

### Fixed

- Fixed memory leaks when server-side rendering for `Intl.DateTimeFormat.format()` and `Intl.NumberFormat.format()` ([#1287](https://github.com/Shopify/quilt/pull/1287))

- `formatCurrency` will now put the minus sign in front of the currency symbol when the amount is negative ([#1264](https://github.com/Shopify/quilt/pull/1264))

## 2.3.6 - 2020-02-04

### Fixed

- `MissingTranslationError` now uses the `normalizedId` which includes the `scope` ([#1258](https://github.com/Shopify/quilt/pull/1258))

## 2.3.4 - 2020-01-20

### Added

- Added `Gip` currency code value ([#1235](https://github.com/Shopify/quilt/pull/1235))

### Fixed

- Fixed `unformatNumber` for numbers using a period as the thousand separator ([#1215](https://github.com/Shopify/quilt/pull/1215))

## 2.3.0 - 2019-11-29

### Added

- Minor - added a `generateTranslationDictionaries` helper, and `mode=from-dictionary-index` option for the Babel plugin. This can be used to build many versions of an application, with each version containing a specific locale's translations directly within JavaScript ([#1197](https://github.com/Shopify/quilt/pull/1197/files))

## 2.2.0 - 2019-11-22

### Added

- Added a `generateTranslationIndexes` helper, and `mode=from-generated-index` option for the Babel plugin. This can be used to resolve unwanted cache hits when adding new translation files ([#1188](https://github.com/Shopify/quilt/pull/1188))

## 2.1.8 - 2019-11-15

### Fixed

- `translationKeyExists` on i18n works as expected with onError handler ([#1162](https://github.com/Shopify/quilt/pull/1162))

## 2.1.7 - 2019-11-12

### Added

- Added locale to be part of `MissingTranslationError` ([#1178](https://github.com/Shopify/quilt/pull/1178))

## 2.1.0 - 2019-10-07

### Added

- Added `memoizedPluralRules` utility function ([#1065](https://github.com/Shopify/quilt/pull/1065)
- Added `memoizedNumberFormatter` utility function ([#1065](https://github.com/Shopify/quilt/pull/1065)

### Changed

- Removed leading zero from hours of time output by `I18n#humanizeDate` method ([#1093](https://github.com/Shopify/quilt/pull/1093))

### Fixed

- Removed creation of `Intl.PluralRules` object from `I18n` constructor which caused backwards incompatibility for any platforms needing a polyfill for `Intl.Plualrules` support ([#1065](https://github.com/Shopify/quilt/pull/1065)

## 2.0.2 - 2019-09-27

### Added

- Added displayName to `withI18n` decorator to help with debugging ([#1048](https://github.com/Shopify/quilt/pull/1048))

## 2.0.1 - 2019-09-25

### Changed

- Fixed babel plugin incompatiblity with jest code coverage

## 2.0.0 - 2019-09-19

### Changed

- Modified translation keys used by `I18n#humanizeDate` method ([#1011](https://github.com/Shopify/quilt/pull/1011)).

  Please see the [migration guide](./migration-guide.md) for more information.

## 1.10.0 - 2019-09-18

### Added

- Added `ordinal` method to I18n class to translate ordinal numbers ([#1003](https://github.com/Shopify/quilt/pull/1003))

  Consumers will need to add the following translation keys for proper ordinal translation. _Note: values are English examples._

  ```json
  {
    "ordinal": {
      "one": "{number}st",
      "two": "{number}nd",
      "few": "{number}rd",
      "other": "{number}th"
    }
  }
  ```

## 1.9.2 - 2019-09-17

### Changed

- Replaced `@shopify/javascript-utilities/dates` functions with those from `@shopify/dates`.
- Removed `@shopify/javascript-utilities/dates` dependency.

### Fixed

- Fixed translation of weekday in `humanizeDate` for dates less than one week old.

## 1.9.1 - 2019-09-13

### Changed

- Updated to `@shopify/dates@^0.2.0`

## 1.9.0 - 2019-09-12

- Added support for pluralization to `getTranslationTree` ([#988](https://github.com/Shopify/quilt/pull/988))

## 1.8.3 - 2019-09-03

- Added `form:` option (one of `short` | `explicit`) to `formatCurrency()` ([#916](https://github.com/Shopify/quilt/pull/916))

## 1.7.0 - 2019-09-03

### Added

- Added `formatName` method to I18n class to format a first name and/or last name based on the locale used. ([#834](https://github.com/Shopify/quilt/pull/834))

## 1.6.0 - 2019-08-23

### Added

- Added an optional replacements argument to `getTranslationTree` ([#874](https://github.com/Shopify/quilt/pull/874))

## 1.5.1 - 2019-08-07

### Fixed

- Fixed an issue where async translations would sometimes not be shown on the initial mount of a component ([#824](https://github.com/Shopify/quilt/pull/824))

## 1.5.0 - 2019-07-02

### Added

- Added `loading` property to I18n class. This helps to determine loading states when retrieving translations async on apps that are rendered client-side.

## 1.4.0 - 2019-06-27

### Added

- Added `translationKeyExists` method for checking dynamic keys ([#766](https://github.com/Shopify/quilt/pull/766))

## 1.2.7 - 2019-06-12

### Fixed

- Added missing dependency for memoize function ([#746](https://github.com/Shopify/quilt/pull/746))

## 1.2.6 - 2019-06-05

### Changed

- The Babel plugin now fails when multiple components in a single file attempt to import translations, as this can cause build issues in Webpack ([#734](https://github.com/Shopify/quilt/pull/734))
- The Babel plugin now does not attempt to load asynchronous translations for locales do not have dedicated translation files ([#738](https://github.com/Shopify/quilt/pull/738))

## 1.2.5 - 2019-05-31

### Fixed

- Fixes transpilation for `babel-preset-typescript` when the last import pulls in only type definitions ([#699](https://github.com/Shopify/quilt/pull/699))

## 1.2.3 - 2019-05-09

### Fixed

- Now exports formerly missing typings for `TranslationDictionary` ([#693](https://github.com/Shopify/quilt/pull/693))

## 1.2.0 - 2019-04-26

### Added

- Added `getTranslationTree` to get the translation tree from a key ([#645](https://github.com/Shopify/quilt/pull/645))

## 1.1.3 - 2019-04-17

### Fixed

- Fixed a number of performance issues with resolving asynchronous translations ([#659](https://github.com/Shopify/quilt/pull/659))

## 1.1.1 - 2019-04-12

### Changed

- `Weekdays` renamed to `Weekday` as part of `shopify/typescript/prefer-singular-enums` eslint rule ([#648](https://github.com/Shopify/quilt/pull/648))

## 1.1.0 - 2019-04-09

### Added

- Added a `useSimpleI18n` hook for performantly sharing an i18n instance within a React subtree ([#639](https://github.com/Shopify/quilt/pull/639))

### Fixed

- Improved the typing of `withI18n` to no longer mark the `i18n` prop as required ([#639](https://github.com/Shopify/quilt/pull/639))

## 1.0.0 - 2019-04-08

This library now requires React 16.8.

### Added

- Added a `useI18n` hook as the new first-class API ([#547](https://github.com/Shopify/quilt/pull/547))

### Changed

- Refactored the way parent/ child translations were stored, which should slightly improve performance ([#547](https://github.com/Shopify/quilt/pull/547))

## 0.11.9 - 2019-03-29

### Fixed

- Fixed an issue where the Babel plugin would return `Module` objects instead of the actual translation dictionaries [#618](https://github.com/Shopify/quilt/pull/618)

## 0.11.7 - 2019-03-27

### Changed

- Memoize `Intl.DateTimeFormat` and `Intl.NumberFormat` [#596](https://github.com/Shopify/quilt/pull/596)

## 0.11.5 - 2019-03-22

### Added

- Expose `currencyDecimalPlaces` and `DEFAULT_DECIMAL_PLACES` [#590](https://github.com/Shopify/quilt/pull/590)

## 0.11.3 - 2019-03-19

### Fixed

- Support unexpected usage of decimal symbols in `I18n#unformatCurrency` [#577](https://github.com/Shopify/quilt/pull/577)

## 0.11.1 - 2019-03-08

### Fixed

- Reverted a change that caused `I18n#getCurrencySymbol` to sometimes return an empty string

## 0.11.0 - 2019-03-07

### Added

- Added an optional `onError` field to the options for `I18nManager`, which controls how descendant `I18n` objects will respond to some types of recoverable errors [#550](https://github.com/Shopify/quilt/pull/550)

### Fixed

- Fixed an issue where `I18n` instances would be created with two copies of each translation dictionary when the locale was equal to the fallback locale [#553](https://github.com/Shopify/quilt/pull/553)

## 0.10.2 - 2019-02-13

### Fixed

- Babel plugin now correctly works without `filenameRelative` being passed via `opts`.

## 0.10.0 - 2019-02-11

### Added

- Babel plugin was added to auto-generate the arguments for `withI18n` when an adjacent `translations` folder exists [#505](https://github.com/Shopify/quilt/pull/505)

## 0.9.1 - 2019-02-06

### Changed

- `MissingTranslationError` now prints the missing translation as part of the message [#497](https://github.com/shopify/quilt/pull/497)

### Fixed

- Async translations that do not resolve to a translation dictionary are now serialized correctly [#494](https://github.com/shopify/quilt/pull/494)
- Multiple instances of the same component now reuse an inflight promise for translations [#498](https://github.com/Shopify/quilt/pull/498)

## 0.9.0 - 2019-02-04

### Changed

- Upgraded to the latest version of `react-effect`. This version has some breaking changes, but this does not actually change any API in `react-i18n`. [#477](https://github.com/Shopify/quilt/pull/477)

## 0.8.0 - 2019-01-30

### Added

- Add `unformatCurrency` utility to return the normalized value of formatted currency [#486](https://github.com/Shopify/quilt/pull/486)

## 0.7.4 - 2019-01-21

### Added

- `CurrencyCode` enum types [#473](https://github.com/Shopify/quilt/pull/473)

## 0.7.3 - 2019-01-21

### Added

- Format count when handling pluralized translation [#447](https://github.com/Shopify/quilt/pull/447)

## 0.7.2

- Start of Changelog
