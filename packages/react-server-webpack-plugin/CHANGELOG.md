# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## ❗️ Deprecated on version 3.1.0 ❗️

**Note**: This module is now deprecated and included as part of [`@shopify/react-server`](../react-server/README.md#webpack-plugin).

<!-- ## [Unreleased] -->

## [3.1.0] - 2020-05-29

- Bump `webpack-virtual-modules` to `v0.2.2` [[#1484]](https://github.com/Shopify/quilt/pull/1484)

## [3.0.0] - 2020-05-12

### Changed

- ⚠️ Generated entrypoints no longer render the App component with a `location` prop. Apps can instead get the same data from the new `url` prop's `pathname` attribute.
- ⚠️ Generated entrypoints no longer render the `App` component with a `server` prop. Whether an app is rendered on the server can instead be trivially inferred from `typeof window === 'undefined'`

Apps which were using the `location` prop will need to use the `url` prop instead. Where before an app component might look like this

```tsx
export function App({location}: {location: string}) {
  return (
    <div className={styles.App}>
      <Router location={location}>
        <Frame>
          <Routes />
        </Frame>
      </Router>
    </div>
  );
}
```

It would now look like this

```tsx
export function App({url}: {url: URL}) {
  return (
    <div className={styles.App}>
      <Router location={url.href}>
        <Frame>
          <Routes />
        </Frame>
      </Router>
    </div>
  );
}
```

### Added

- Generated entrypoints now pass a `data` prop to the `App`. This prop contains the deserialized data from the `x-quilt-data` header which is used by `quilt_rails` to pass data directly to React
- Generated entrypoints now pass a `url` prop to the `App`. This prop is a full WHATWG compliant `URL` object representing the url for the request that react-server responded to.

## [2.2.17] - 2019-11-29

- Updated dependency: `@shopify/react-server@0.8.5`

## [2.2.13] - 2019-10-31

- Fix case where default entrypoints were generated for `client` and `server` when there were bespoke folders with index files present

## [2.2.0] - 2019-09-26

- Log errors on `uncaughtException` `unhandledRejection` events [#1006](https://github.com/Shopify/quilt/pull/1006)

## [2.1.1] - 2019-09-17

- Fixes an error regrding missing templates [#1006](https://github.com/Shopify/quilt/pull/1006)

## [2.1.0] - 2019-08-16

- Added support for Node projects [#917](https://github.com/Shopify/quilt/pull/917)
  - _Note:_ For Node apps the plugin relies on `app` being included in your webpack config's `resolve.modules`. For Rails apps, it relies on `app/ui`.

## [2.0.0] - 2019-08-16

- The plugin now defaults the `host` of the generated code to use `process.env.REACT_SERVER_IP` and the `port` to use `process.env.REACT_SERVER_PORT` when explicit values are not supplied. [#852](https://github.com/Shopify/quilt/pull/852)
- 💚 Increase test timeout [#849](https://github.com/Shopify/quilt/pull/849)

## [1.0.2] - 2019-08-14

- Remove unused `@shopify/koa-shopify-graphql-proxy` import [#847](https://github.com/Shopify/quilt/pull/847)

## [1.0.1] - 2019-08-13

- Upgrading to `react-server@^0.1.1`

## [1.0.0] - 2019-08-13

### Added

- `@shopify/react-server-webpack-plugin` package [#841](https://github.com/Shopify/quilt/pull/841)
