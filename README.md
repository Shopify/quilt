[comment]: # (NOTE: This file is generated and should not be modify directly. Update `templates/ROOT_README.hbs.md` instead)
# Quilt

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

A loosely related set of packages for JavaScript/TypeScript projects at Shopify.

These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, Koa for the server, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

⚠️ Over the past few years, this repo has become a dumping ground for a variety of packages unrelated to the core problems Quilt aims to solve. Before submitting a pull request, please speak with the Admin Web Foundations team on guidance as to whether a package might belong in Quilt.

## Usage

The Quilt repo is managed as a monorepo that is composed of 73 npm packages and one Ruby gem.
Each package/gem has its own `README.md` and documentation describing usage.

### Package Index

| Package | Version | Description |
| ------- | ------- | ----------- |
| [@shopify/address](packages/address) | <a href="https://badge.fury.io/js/%40shopify%2Faddress"><img src="https://badge.fury.io/js/%40shopify%2Faddress.svg" width="200px" /></a> | Address utilities for formatting addresses |
| [@shopify/address-consts](packages/address-consts) | <a href="https://badge.fury.io/js/%40shopify%2Faddress-consts"><img src="https://badge.fury.io/js/%40shopify%2Faddress-consts.svg" width="200px" /></a> | Constants and types relating to `@shopify/address` |
| [@shopify/address-mocks](packages/address-mocks) | <a href="https://badge.fury.io/js/%40shopify%2Faddress-mocks"><img src="https://badge.fury.io/js/%40shopify%2Faddress-mocks.svg" width="200px" /></a> | Address mocks for `@shopify/address` |
| [@shopify/admin-graphql-api-utilities](packages/admin-graphql-api-utilities) | <a href="https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities"><img src="https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities.svg" width="200px" /></a> | A set of utilities to use when consuming Shopify’s admin GraphQL API |
| [@shopify/ast-utilities](packages/ast-utilities) | <a href="https://badge.fury.io/js/%40shopify%2Fast-utilities"><img src="https://badge.fury.io/js/%40shopify%2Fast-utilities.svg" width="200px" /></a> | Utilities for working with Abstract Syntax Trees (ASTs) |
| [@shopify/async](packages/async) | <a href="https://badge.fury.io/js/%40shopify%2Fasync"><img src="https://badge.fury.io/js/%40shopify%2Fasync.svg" width="200px" /></a> | Primitives for loading parts of an application asynchronously |
| [@shopify/browser](packages/browser) | <a href="https://badge.fury.io/js/%40shopify%2Fbrowser"><img src="https://badge.fury.io/js/%40shopify%2Fbrowser.svg" width="200px" /></a> | Utilities for extracting browser information from user-agents |
| [@shopify/csrf-token-fetcher](packages/csrf-token-fetcher) | <a href="https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher"><img src="https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher.svg" width="200px" /></a> | JavaScript utility function to fetch the CSRF token required to make requests to a Rails server |
| [@shopify/css-utilities](packages/css-utilities) | <a href="https://badge.fury.io/js/%40shopify%2Fcss-utilities"><img src="https://badge.fury.io/js/%40shopify%2Fcss-utilities.svg" width="200px" /></a> | A set of CSS styling-related utilities |
| [@shopify/dates](packages/dates) | <a href="https://badge.fury.io/js/%40shopify%2Fdates"><img src="https://badge.fury.io/js/%40shopify%2Fdates.svg" width="200px" /></a> | Lightweight date operations library |
| [@shopify/decorators](packages/decorators) | <a href="https://badge.fury.io/js/%40shopify%2Fdecorators"><img src="https://badge.fury.io/js/%40shopify%2Fdecorators.svg" width="200px" /></a> | A set of decorators to aid your JavaScript journey |
| [@shopify/function-enhancers](packages/function-enhancers) | <a href="https://badge.fury.io/js/%40shopify%2Ffunction-enhancers"><img src="https://badge.fury.io/js/%40shopify%2Ffunction-enhancers.svg" width="200px" /></a> | A set of helpers to enhance functions |
| [graphql-config-utilities](packages/graphql-config-utilities) | <a href="https://badge.fury.io/js/graphql-config-utilities"><img src="https://badge.fury.io/js/graphql-config-utilities.svg" width="200px" /></a> | Common utilities for graphql-config |
| [graphql-fixtures](packages/graphql-fixtures) | <a href="https://badge.fury.io/js/graphql-fixtures"><img src="https://badge.fury.io/js/graphql-fixtures.svg" width="200px" /></a> | Utilities for generating fixture objects from GraphQL documents. |
| [graphql-mini-transforms](packages/graphql-mini-transforms) | <a href="https://badge.fury.io/js/graphql-mini-transforms"><img src="https://badge.fury.io/js/graphql-mini-transforms.svg" width="200px" /></a> | Transformers for importing .graphql files in various build tools. |
| [@shopify/graphql-persisted](packages/graphql-persisted) | <a href="https://badge.fury.io/js/%40shopify%2Fgraphql-persisted"><img src="https://badge.fury.io/js/%40shopify%2Fgraphql-persisted.svg" width="200px" /></a> | Apollo and Koa integrations for persisted GraphQL queries. |
| [@shopify/graphql-testing](packages/graphql-testing) | <a href="https://badge.fury.io/js/%40shopify%2Fgraphql-testing"><img src="https://badge.fury.io/js/%40shopify%2Fgraphql-testing.svg" width="200px" /></a> | Utilities to create mock GraphQL factories |
| [graphql-tool-utilities](packages/graphql-tool-utilities) | <a href="https://badge.fury.io/js/graphql-tool-utilities"><img src="https://badge.fury.io/js/graphql-tool-utilities.svg" width="200px" /></a> | Common utilities for GraphQL developer tools |
| [graphql-typed](packages/graphql-typed) | <a href="https://badge.fury.io/js/graphql-typed"><img src="https://badge.fury.io/js/graphql-typed.svg" width="200px" /></a> | A more strongly typed version of GraphQL's DocumentNode. |
| [graphql-typescript-definitions](packages/graphql-typescript-definitions) | <a href="https://badge.fury.io/js/graphql-typescript-definitions"><img src="https://badge.fury.io/js/graphql-typescript-definitions.svg" width="200px" /></a> | Generate TypeScript definition files from .graphql documents |
| [graphql-validate-fixtures](packages/graphql-validate-fixtures) | <a href="https://badge.fury.io/js/graphql-validate-fixtures"><img src="https://badge.fury.io/js/graphql-validate-fixtures.svg" width="200px" /></a> | Validates JSON fixtures for GraphQL responses against the associated operations and schema |
| [@shopify/i18n](packages/i18n) | <a href="https://badge.fury.io/js/%40shopify%2Fi18n"><img src="https://badge.fury.io/js/%40shopify%2Fi18n.svg" width="200px" /></a> | Generic i18n-related utilities |
| [@shopify/jest-dom-mocks](packages/jest-dom-mocks) | <a href="https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks"><img src="https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks.svg" width="200px" /></a> | Jest mocking utilities for working with the DOM |
| [@shopify/jest-koa-mocks](packages/jest-koa-mocks) | <a href="https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks"><img src="https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks.svg" width="200px" /></a> | Utilities to easily stub Koa context and cookies |
| [@shopify/koa-liveness-ping](packages/koa-liveness-ping) | <a href="https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping"><img src="https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping.svg" width="200px" /></a> | A package for creating liveness ping middleware for use with Koa |
| [@shopify/koa-metrics](packages/koa-metrics) | <a href="https://badge.fury.io/js/%40shopify%2Fkoa-metrics"><img src="https://badge.fury.io/js/%40shopify%2Fkoa-metrics.svg" width="200px" /></a> | Aims to provide standard middleware and instrumentation tooling for metrics in Koa |
| [@shopify/koa-performance](packages/koa-performance) | <a href="https://badge.fury.io/js/%40shopify%2Fkoa-performance"><img src="https://badge.fury.io/js/%40shopify%2Fkoa-performance.svg" width="200px" /></a> | Creating middleware that sends performance-related data through StatsD |
| [@shopify/koa-shopify-graphql-proxy](packages/koa-shopify-graphql-proxy) | <a href="https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy"><img src="https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy.svg" width="200px" /></a> | A wrapper around `koa-better-http-proxy` which allows easy proxying of GraphQL requests from an embedded Shopify app |
| [@shopify/koa-shopify-webhooks](packages/koa-shopify-webhooks) | <a href="https://badge.fury.io/js/%40shopify%2Fkoa-shopify-webhooks"><img src="https://badge.fury.io/js/%40shopify%2Fkoa-shopify-webhooks.svg" width="200px" /></a> | Receive webhooks from Shopify with ease |
| [@shopify/logger](packages/logger) | <a href="https://badge.fury.io/js/%40shopify%2Flogger"><img src="https://badge.fury.io/js/%40shopify%2Flogger.svg" width="200px" /></a> | Opinionated logger for production-scale applications |
| [@shopify/mime-types](packages/mime-types) | <a href="https://badge.fury.io/js/%40shopify%2Fmime-types"><img src="https://badge.fury.io/js/%40shopify%2Fmime-types.svg" width="200px" /></a> | MIME type consistency |
| [@shopify/mock-factory](packages/mock-factory) | <a href="https://badge.fury.io/js/%40shopify%2Fmock-factory"><img src="https://badge.fury.io/js/%40shopify%2Fmock-factory.svg" width="200px" /></a> | create typesafe mock data objects |
| [@shopify/network](packages/network) | <a href="https://badge.fury.io/js/%40shopify%2Fnetwork"><img src="https://badge.fury.io/js/%40shopify%2Fnetwork.svg" width="200px" /></a> | Common values related to dealing with the network |
| [@shopify/performance](packages/performance) | <a href="https://badge.fury.io/js/%40shopify%2Fperformance"><img src="https://badge.fury.io/js/%40shopify%2Fperformance.svg" width="200px" /></a> | Primitives for collecting browser performance metrics |
| [@shopify/polyfills](packages/polyfills) | <a href="https://badge.fury.io/js/%40shopify%2Fpolyfills"><img src="https://badge.fury.io/js/%40shopify%2Fpolyfills.svg" width="200px" /></a> | Blessed polyfills for web platform features |
| [@shopify/predicates](packages/predicates) | <a href="https://badge.fury.io/js/%40shopify%2Fpredicates"><img src="https://badge.fury.io/js/%40shopify%2Fpredicates.svg" width="200px" /></a> | A set of common JavaScript predicates |
| [@shopify/react-app-bridge-universal-provider](packages/react-app-bridge-universal-provider) | <a href="https://badge.fury.io/js/%40shopify%2Freact-app-bridge-universal-provider"><img src="https://badge.fury.io/js/%40shopify%2Freact-app-bridge-universal-provider.svg" width="200px" /></a> | A self-serializing/deserializing `app-bridge-react` provider that works for isomorphic applications |
| [@shopify/react-async](packages/react-async) | <a href="https://badge.fury.io/js/%40shopify%2Freact-async"><img src="https://badge.fury.io/js/%40shopify%2Freact-async.svg" width="200px" /></a> | Tools for creating powerful, asynchronously-loaded React components |
| [@shopify/react-bugsnag](packages/react-bugsnag) | <a href="https://badge.fury.io/js/%40shopify%2Freact-bugsnag"><img src="https://badge.fury.io/js/%40shopify%2Freact-bugsnag.svg" width="200px" /></a> | An opinionated wrapper for Bugsnag's React plugin |
| [@shopify/react-compose](packages/react-compose) | <a href="https://badge.fury.io/js/%40shopify%2Freact-compose"><img src="https://badge.fury.io/js/%40shopify%2Freact-compose.svg" width="200px" /></a> | Cleanly compose multiple component enhancers together with minimal fuss |
| [@shopify/react-cookie](packages/react-cookie) | <a href="https://badge.fury.io/js/%40shopify%2Freact-cookie"><img src="https://badge.fury.io/js/%40shopify%2Freact-cookie.svg" width="200px" /></a> | Cookies in React for the server and client |
| [@shopify/react-csrf](packages/react-csrf) | <a href="https://badge.fury.io/js/%40shopify%2Freact-csrf"><img src="https://badge.fury.io/js/%40shopify%2Freact-csrf.svg" width="200px" /></a> | Share CSRF tokens throughout a React application |
| [@shopify/react-csrf-universal-provider](packages/react-csrf-universal-provider) | <a href="https://badge.fury.io/js/%40shopify%2Freact-csrf-universal-provider"><img src="https://badge.fury.io/js/%40shopify%2Freact-csrf-universal-provider.svg" width="200px" /></a> | A self-serializing/deserializing CSRF token provider that works for isomorphic applications |
| [@shopify/react-effect](packages/react-effect) | <a href="https://badge.fury.io/js/%40shopify%2Freact-effect"><img src="https://badge.fury.io/js/%40shopify%2Freact-effect.svg" width="200px" /></a> | A component and set of utilities for performing effects within a universal React app |
| [@shopify/react-form](packages/react-form) | <a href="https://badge.fury.io/js/%40shopify%2Freact-form"><img src="https://badge.fury.io/js/%40shopify%2Freact-form.svg" width="200px" /></a> | Manage React forms tersely and safely-typed with no magic using React hooks |
| [@shopify/react-form-state](packages/react-form-state) | <a href="https://badge.fury.io/js/%40shopify%2Freact-form-state"><img src="https://badge.fury.io/js/%40shopify%2Freact-form-state.svg" width="200px" /></a> | Manage React forms tersely and type-safely with no magic |
| [@shopify/react-google-analytics](packages/react-google-analytics) | <a href="https://badge.fury.io/js/%40shopify%2Freact-google-analytics"><img src="https://badge.fury.io/js/%40shopify%2Freact-google-analytics.svg" width="200px" /></a> | Allows React apps to easily embed Google Analytics scripts |
| [@shopify/react-graphql](packages/react-graphql) | <a href="https://badge.fury.io/js/%40shopify%2Freact-graphql"><img src="https://badge.fury.io/js/%40shopify%2Freact-graphql.svg" width="200px" /></a> | Tools for creating type-safe and asynchronous GraphQL components for React |
| [@shopify/react-graphql-universal-provider](packages/react-graphql-universal-provider) | <a href="https://badge.fury.io/js/%40shopify%2Freact-graphql-universal-provider"><img src="https://badge.fury.io/js/%40shopify%2Freact-graphql-universal-provider.svg" width="200px" /></a> | A self-serializing/deserializing GraphQL provider that works for isomorphic applications |
| [@shopify/react-hooks](packages/react-hooks) | <a href="https://badge.fury.io/js/%40shopify%2Freact-hooks"><img src="https://badge.fury.io/js/%40shopify%2Freact-hooks.svg" width="200px" /></a> | A collection of primitive React hooks |
| [@shopify/react-html](packages/react-html) | <a href="https://badge.fury.io/js/%40shopify%2Freact-html"><img src="https://badge.fury.io/js/%40shopify%2Freact-html.svg" width="200px" /></a> | A component to render your React app with no static HTML |
| [@shopify/react-hydrate](packages/react-hydrate) | <a href="https://badge.fury.io/js/%40shopify%2Freact-hydrate"><img src="https://badge.fury.io/js/%40shopify%2Freact-hydrate.svg" width="200px" /></a> | Utilities for hydrating server-rendered React apps |
| [@shopify/react-i18n](packages/react-i18n) | <a href="https://badge.fury.io/js/%40shopify%2Freact-i18n"><img src="https://badge.fury.io/js/%40shopify%2Freact-i18n.svg" width="200px" /></a> | i18n utilities for React handling translations, formatting, and more |
| [@shopify/react-i18n-universal-provider](packages/react-i18n-universal-provider) | <a href="https://badge.fury.io/js/%40shopify%2Freact-i18n-universal-provider"><img src="https://badge.fury.io/js/%40shopify%2Freact-i18n-universal-provider.svg" width="200px" /></a> | A self-serializing/deserializing i18n provider that works for isomorphic applications |
| [@shopify/react-idle](packages/react-idle) | <a href="https://badge.fury.io/js/%40shopify%2Freact-idle"><img src="https://badge.fury.io/js/%40shopify%2Freact-idle.svg" width="200px" /></a> | Utilities for working with idle callbacks in React |
| [@shopify/react-import-remote](packages/react-import-remote) | <a href="https://badge.fury.io/js/%40shopify%2Freact-import-remote"><img src="https://badge.fury.io/js/%40shopify%2Freact-import-remote.svg" width="200px" /></a> | Asynchronous script loading for React |
| [@shopify/react-intersection-observer](packages/react-intersection-observer) | <a href="https://badge.fury.io/js/%40shopify%2Freact-intersection-observer"><img src="https://badge.fury.io/js/%40shopify%2Freact-intersection-observer.svg" width="200px" /></a> | A React wrapper around the Intersection Observer API |
| [@shopify/react-network](packages/react-network) | <a href="https://badge.fury.io/js/%40shopify%2Freact-network"><img src="https://badge.fury.io/js/%40shopify%2Freact-network.svg" width="200px" /></a> | A collection of components that allow you to set common HTTP headers from within your React application |
| [@shopify/react-performance](packages/react-performance) | <a href="https://badge.fury.io/js/%40shopify%2Freact-performance"><img src="https://badge.fury.io/js/%40shopify%2Freact-performance.svg" width="200px" /></a> | Primitives to measure your React application's performance using `@shopify/performance` |
| [@shopify/react-router](packages/react-router) | <a href="https://badge.fury.io/js/%40shopify%2Freact-router"><img src="https://badge.fury.io/js/%40shopify%2Freact-router.svg" width="200px" /></a> | A universal router for React |
| [@shopify/react-server](packages/react-server) | <a href="https://badge.fury.io/js/%40shopify%2Freact-server"><img src="https://badge.fury.io/js/%40shopify%2Freact-server.svg" width="200px" /></a> | Utilities for React server-side rendering |
| [@shopify/react-shortcuts](packages/react-shortcuts) | <a href="https://badge.fury.io/js/%40shopify%2Freact-shortcuts"><img src="https://badge.fury.io/js/%40shopify%2Freact-shortcuts.svg" width="200px" /></a> | Declaratively and efficiently match shortcut combinations in your React application |
| [@shopify/react-testing](packages/react-testing) | <a href="https://badge.fury.io/js/%40shopify%2Freact-testing"><img src="https://badge.fury.io/js/%40shopify%2Freact-testing.svg" width="200px" /></a> | A library for testing React components according to our conventions |
| [@shopify/react-tracking-pixel](packages/react-tracking-pixel) | <a href="https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel"><img src="https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel.svg" width="200px" /></a> | Allows React apps to easily embed tracking pixel iframes |
| [@shopify/react-universal-provider](packages/react-universal-provider) | <a href="https://badge.fury.io/js/%40shopify%2Freact-universal-provider"><img src="https://badge.fury.io/js/%40shopify%2Freact-universal-provider.svg" width="200px" /></a> | Factory function and utilities to create self-serializing/deserializing providers that work for isomorphic applications |
| [@shopify/react-web-worker](packages/react-web-worker) | <a href="https://badge.fury.io/js/%40shopify%2Freact-web-worker"><img src="https://badge.fury.io/js/%40shopify%2Freact-web-worker.svg" width="200px" /></a> | A hook for using web workers in React applications |
| [@shopify/semaphore](packages/semaphore) | <a href="https://badge.fury.io/js/%40shopify%2Fsemaphore"><img src="https://badge.fury.io/js/%40shopify%2Fsemaphore.svg" width="200px" /></a> | Counting semaphore |
| [@shopify/sewing-kit-koa](packages/sewing-kit-koa) | <a href="https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa"><img src="https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa.svg" width="200px" /></a> | Easily access Sewing Kit assets from a Koa server |
| [@shopify/statsd](packages/statsd) | <a href="https://badge.fury.io/js/%40shopify%2Fstatsd"><img src="https://badge.fury.io/js/%40shopify%2Fstatsd.svg" width="200px" /></a> | An opinionated StatsD client for Shopify Node.js servers and other StatsD utilities |
| [@shopify/storybook-a11y-test](packages/storybook-a11y-test) | <a href="https://badge.fury.io/js/%40shopify%2Fstorybook-a11y-test"><img src="https://badge.fury.io/js/%40shopify%2Fstorybook-a11y-test.svg" width="200px" /></a> | Test storybook pages with axe and puppeteer |
| [@shopify/useful-types](packages/useful-types) | <a href="https://badge.fury.io/js/%40shopify%2Fuseful-types"><img src="https://badge.fury.io/js/%40shopify%2Fuseful-types.svg" width="200px" /></a> | A few handy TypeScript types |
| [@shopify/web-worker](packages/web-worker) | <a href="https://badge.fury.io/js/%40shopify%2Fweb-worker"><img src="https://badge.fury.io/js/%40shopify%2Fweb-worker.svg" width="200px" /></a> | Tools for making web workers fun to use |
| [@shopify/with-env](packages/with-env) | <a href="https://badge.fury.io/js/%40shopify%2Fwith-env"><img src="https://badge.fury.io/js/%40shopify%2Fwith-env.svg" width="200px" /></a> | A utility for executing code under a specific `NODE_ENV` |

### Gem Index

| Gem | Version | Description |
| --- | ------- | ----------- |
| [quilt_rails](gems/quilt_rails) | <a href="https://badge.fury.io/rb/quilt_rails"><img src="https://badge.fury.io/rb/quilt_rails.svg" width="200px" /></a> | A turn-key solution for integrating server-rendered React into your Rails app using Quilt libraries. |

## Want to contribute?

Check out our [Contributing Guide](./.github/CONTRIBUTING.md)

## Questions?

For Shopifolk, you can reach out to us in Slack in the `#help-admin-web-foundations` channel. For external inquiries, we welcome bug reports, enhancements, and feature requests via GitHub issues.

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

[<img src="images/shopify.svg" alt="Shopify" width="200" />](https://www.shopify.com/)
