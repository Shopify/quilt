[comment]: # (NOTE: This file is generated and should not be modify directly. Update `templates/ROOT_README.hbs.md` instead)
# Quilt

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

A loosely related set of packages for JavaScript/TypeScript projects at Shopify.

These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, Koa for the server, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

⚠️ Over the past few years, this repo has become a dumping ground for a variety of packages unrelated to the core problems Quilt aims to solve. For this reason, we are no longer accepting new packages.

## Usage

The Quilt repo is managed as a monorepo that is composed of 78 npm packages and one Ruby gem.
Each package/gem has its own `README.md` and documentation describing usage.

### Package Index

| Package | Version | Downloads | Description |
| ------- | ------- | --------- | ----------- |
| [address](packages/address) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/address) | ![npm](https://img.shields.io/npm/dw/@shopify/address?label=%E2%87%A9) | Address utilities for formatting addresses |
| [address-consts](packages/address-consts) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/address-consts) | ![npm](https://img.shields.io/npm/dw/@shopify/address-consts?label=%E2%87%A9) | Constants and types relating to `@shopify/address` |
| [address-mocks](packages/address-mocks) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/address-mocks) | ![npm](https://img.shields.io/npm/dw/@shopify/address-mocks?label=%E2%87%A9) | Address mocks for `@shopify/address` |
| [admin-graphql-api-utilities](packages/admin-graphql-api-utilities) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/admin-graphql-api-utilities) | ![npm](https://img.shields.io/npm/dw/@shopify/admin-graphql-api-utilities?label=%E2%87%A9) | A set of utilities to use when consuming Shopify’s admin GraphQL API |
| [ast-utilities](packages/ast-utilities) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/ast-utilities) | ![npm](https://img.shields.io/npm/dw/@shopify/ast-utilities?label=%E2%87%A9) | Utilities for working with Abstract Syntax Trees (ASTs) |
| [async](packages/async) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/async) | ![npm](https://img.shields.io/npm/dw/@shopify/async?label=%E2%87%A9) | Primitives for loading parts of an application asynchronously |
| [browser](packages/browser) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/browser) | ![npm](https://img.shields.io/npm/dw/@shopify/browser?label=%E2%87%A9) | Utilities for extracting browser information from user-agents |
| [csrf-token-fetcher](packages/csrf-token-fetcher) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/csrf-token-fetcher) | ![npm](https://img.shields.io/npm/dw/@shopify/csrf-token-fetcher?label=%E2%87%A9) | JavaScript utility function to fetch the CSRF token required to make requests to a Rails server |
| [css-utilities](packages/css-utilities) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/css-utilities) | ![npm](https://img.shields.io/npm/dw/@shopify/css-utilities?label=%E2%87%A9) | A set of CSS styling-related utilities |
| [dates](packages/dates) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/dates) | ![npm](https://img.shields.io/npm/dw/@shopify/dates?label=%E2%87%A9) | Lightweight date operations library |
| [decorators](packages/decorators) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/decorators) | ![npm](https://img.shields.io/npm/dw/@shopify/decorators?label=%E2%87%A9) | A set of decorators to aid your JavaScript journey |
| [enzyme-utilities](packages/enzyme-utilities) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/enzyme-utilities) | ![npm](https://img.shields.io/npm/dw/@shopify/enzyme-utilities?label=%E2%87%A9) | Enzyme utilities for testing React components |
| [function-enhancers](packages/function-enhancers) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/function-enhancers) | ![npm](https://img.shields.io/npm/dw/@shopify/function-enhancers?label=%E2%87%A9) | A set of helpers to enhance functions |
| [graphql-config-utilities](packages/graphql-config-utilities) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-config-utilities) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-config-utilities?label=%E2%87%A9) | Common utilities for graphql-config |
| [graphql-fixtures](packages/graphql-fixtures) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-fixtures) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-fixtures?label=%E2%87%A9) | Utilities for generating fixture objects from GraphQL documents. |
| [graphql-mini-transforms](packages/graphql-mini-transforms) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-mini-transforms) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-mini-transforms?label=%E2%87%A9) | Transformers for importing .graphql files in various build tools. |
| [graphql-persisted](packages/graphql-persisted) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-persisted) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-persisted?label=%E2%87%A9) | Apollo and Koa integrations for persisted GraphQL queries. |
| [graphql-testing](packages/graphql-testing) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-testing) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-testing?label=%E2%87%A9) | Utilities to create mock GraphQL factories |
| [graphql-tool-utilities](packages/graphql-tool-utilities) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-tool-utilities) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-tool-utilities?label=%E2%87%A9) | Common utilities for GraphQL developer tools |
| [graphql-typed](packages/graphql-typed) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-typed) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-typed?label=%E2%87%A9) | A more strongly typed version of GraphQL's DocumentNode. |
| [graphql-typescript-definitions](packages/graphql-typescript-definitions) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-typescript-definitions) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-typescript-definitions?label=%E2%87%A9) | Generate TypeScript definition files from .graphql documents |
| [graphql-validate-fixtures](packages/graphql-validate-fixtures) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/graphql-validate-fixtures) | ![npm](https://img.shields.io/npm/dw/@shopify/graphql-validate-fixtures?label=%E2%87%A9) | Validates JSON fixtures for GraphQL responses against the associated operations and schema |
| [i18n](packages/i18n) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/i18n) | ![npm](https://img.shields.io/npm/dw/@shopify/i18n?label=%E2%87%A9) | Generic i18n-related utilities |
| [jest-dom-mocks](packages/jest-dom-mocks) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/jest-dom-mocks) | ![npm](https://img.shields.io/npm/dw/@shopify/jest-dom-mocks?label=%E2%87%A9) | Jest mocking utilities for working with the DOM |
| [jest-koa-mocks](packages/jest-koa-mocks) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/jest-koa-mocks) | ![npm](https://img.shields.io/npm/dw/@shopify/jest-koa-mocks?label=%E2%87%A9) | Utilities to easily stub Koa context and cookies |
| [jest-mock-apollo](packages/jest-mock-apollo) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/jest-mock-apollo) | ![npm](https://img.shields.io/npm/dw/@shopify/jest-mock-apollo?label=%E2%87%A9) | Jest + Enzyme mocks for Apollo 2.x |
| [jest-mock-router](packages/jest-mock-router) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/jest-mock-router) | ![npm](https://img.shields.io/npm/dw/@shopify/jest-mock-router?label=%E2%87%A9) | Jest + Enzyme mocks for React Router 3.x |
| [koa-liveness-ping](packages/koa-liveness-ping) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/koa-liveness-ping) | ![npm](https://img.shields.io/npm/dw/@shopify/koa-liveness-ping?label=%E2%87%A9) | A package for creating liveness ping middleware for use with Koa |
| [koa-metrics](packages/koa-metrics) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/koa-metrics) | ![npm](https://img.shields.io/npm/dw/@shopify/koa-metrics?label=%E2%87%A9) | Aims to provide standard middleware and instrumentation tooling for metrics in Koa |
| [koa-performance](packages/koa-performance) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/koa-performance) | ![npm](https://img.shields.io/npm/dw/@shopify/koa-performance?label=%E2%87%A9) | Creating middleware that sends performance-related data through StatsD |
| [koa-shopify-graphql-proxy](packages/koa-shopify-graphql-proxy) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/koa-shopify-graphql-proxy) | ![npm](https://img.shields.io/npm/dw/@shopify/koa-shopify-graphql-proxy?label=%E2%87%A9) | A wrapper around `koa-better-http-proxy` which allows easy proxying of GraphQL requests from an embedded Shopify app |
| [koa-shopify-webhooks](packages/koa-shopify-webhooks) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/koa-shopify-webhooks) | ![npm](https://img.shields.io/npm/dw/@shopify/koa-shopify-webhooks?label=%E2%87%A9) | Receive webhooks from Shopify with ease |
| [logger](packages/logger) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/logger) | ![npm](https://img.shields.io/npm/dw/@shopify/logger?label=%E2%87%A9) | Opinionated logger for production-scale applications |
| [magic-entries-webpack-plugin](packages/magic-entries-webpack-plugin) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/magic-entries-webpack-plugin) | ![npm](https://img.shields.io/npm/dw/@shopify/magic-entries-webpack-plugin?label=%E2%87%A9) | A webpack plugin that automatically sets up entrypoints from filename conventions |
| [mime-types](packages/mime-types) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/mime-types) | ![npm](https://img.shields.io/npm/dw/@shopify/mime-types?label=%E2%87%A9) | MIME type consistency |
| [network](packages/network) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/network) | ![npm](https://img.shields.io/npm/dw/@shopify/network?label=%E2%87%A9) | Common values related to dealing with the network |
| [performance](packages/performance) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/performance) | ![npm](https://img.shields.io/npm/dw/@shopify/performance?label=%E2%87%A9) | Primitives for collecting browser performance metrics |
| [polyfills](packages/polyfills) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/polyfills) | ![npm](https://img.shields.io/npm/dw/@shopify/polyfills?label=%E2%87%A9) | Blessed polyfills for web platform features |
| [predicates](packages/predicates) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/predicates) | ![npm](https://img.shields.io/npm/dw/@shopify/predicates?label=%E2%87%A9) | A set of common JavaScript predicates |
| [react-app-bridge-universal-provider](packages/react-app-bridge-universal-provider) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-app-bridge-universal-provider) | ![npm](https://img.shields.io/npm/dw/@shopify/react-app-bridge-universal-provider?label=%E2%87%A9) | A self-serializing/deserializing `app-bridge-react` provider that works for isomorphic applications |
| [react-async](packages/react-async) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-async) | ![npm](https://img.shields.io/npm/dw/@shopify/react-async?label=%E2%87%A9) | Tools for creating powerful, asynchronously-loaded React components |
| [react-bugsnag](packages/react-bugsnag) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-bugsnag) | ![npm](https://img.shields.io/npm/dw/@shopify/react-bugsnag?label=%E2%87%A9) | An opinionated wrapper for Bugsnag's React plugin |
| [react-compose](packages/react-compose) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-compose) | ![npm](https://img.shields.io/npm/dw/@shopify/react-compose?label=%E2%87%A9) | Cleanly compose multiple component enhancers together with minimal fuss |
| [react-cookie](packages/react-cookie) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-cookie) | ![npm](https://img.shields.io/npm/dw/@shopify/react-cookie?label=%E2%87%A9) | Cookies in React for the server and client |
| [react-csrf](packages/react-csrf) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-csrf) | ![npm](https://img.shields.io/npm/dw/@shopify/react-csrf?label=%E2%87%A9) | Share CSRF tokens throughout a React application |
| [react-csrf-universal-provider](packages/react-csrf-universal-provider) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-csrf-universal-provider) | ![npm](https://img.shields.io/npm/dw/@shopify/react-csrf-universal-provider?label=%E2%87%A9) | A self-serializing/deserializing CSRF token provider that works for isomorphic applications |
| [react-effect](packages/react-effect) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-effect) | ![npm](https://img.shields.io/npm/dw/@shopify/react-effect?label=%E2%87%A9) | A component and set of utilities for performing effects within a universal React app |
| [react-form](packages/react-form) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-form) | ![npm](https://img.shields.io/npm/dw/@shopify/react-form?label=%E2%87%A9) | Manage React forms tersely and safely-typed with no magic using React hooks |
| [react-form-state](packages/react-form-state) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-form-state) | ![npm](https://img.shields.io/npm/dw/@shopify/react-form-state?label=%E2%87%A9) | Manage React forms tersely and type-safely with no magic |
| [react-google-analytics](packages/react-google-analytics) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-google-analytics) | ![npm](https://img.shields.io/npm/dw/@shopify/react-google-analytics?label=%E2%87%A9) | Allows React apps to easily embed Google Analytics scripts |
| [react-graphql](packages/react-graphql) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-graphql) | ![npm](https://img.shields.io/npm/dw/@shopify/react-graphql?label=%E2%87%A9) | Tools for creating type-safe and asynchronous GraphQL components for React |
| [react-graphql-universal-provider](packages/react-graphql-universal-provider) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-graphql-universal-provider) | ![npm](https://img.shields.io/npm/dw/@shopify/react-graphql-universal-provider?label=%E2%87%A9) | A self-serializing/deserializing GraphQL provider that works for isomorphic applications |
| [react-hooks](packages/react-hooks) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-hooks) | ![npm](https://img.shields.io/npm/dw/@shopify/react-hooks?label=%E2%87%A9) | A collection of primitive React hooks |
| [react-html](packages/react-html) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-html) | ![npm](https://img.shields.io/npm/dw/@shopify/react-html?label=%E2%87%A9) | A component to render your React app with no static HTML |
| [react-hydrate](packages/react-hydrate) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-hydrate) | ![npm](https://img.shields.io/npm/dw/@shopify/react-hydrate?label=%E2%87%A9) | Utilities for hydrating server-rendered React apps |
| [react-i18n](packages/react-i18n) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-i18n) | ![npm](https://img.shields.io/npm/dw/@shopify/react-i18n?label=%E2%87%A9) | i18n utilities for React handling translations, formatting, and more |
| [react-i18n-universal-provider](packages/react-i18n-universal-provider) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-i18n-universal-provider) | ![npm](https://img.shields.io/npm/dw/@shopify/react-i18n-universal-provider?label=%E2%87%A9) | A self-serializing/deserializing i18n provider that works for isomorphic applications |
| [react-idle](packages/react-idle) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-idle) | ![npm](https://img.shields.io/npm/dw/@shopify/react-idle?label=%E2%87%A9) | Utilities for working with idle callbacks in React |
| [react-import-remote](packages/react-import-remote) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-import-remote) | ![npm](https://img.shields.io/npm/dw/@shopify/react-import-remote?label=%E2%87%A9) | Asynchronous script loading for React |
| [react-intersection-observer](packages/react-intersection-observer) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-intersection-observer) | ![npm](https://img.shields.io/npm/dw/@shopify/react-intersection-observer?label=%E2%87%A9) | A React wrapper around the Intersection Observer API |
| [react-network](packages/react-network) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-network) | ![npm](https://img.shields.io/npm/dw/@shopify/react-network?label=%E2%87%A9) | A collection of components that allow you to set common HTTP headers from within your React application |
| [react-performance](packages/react-performance) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-performance) | ![npm](https://img.shields.io/npm/dw/@shopify/react-performance?label=%E2%87%A9) | Primitives to measure your React application's performance using `@shopify/performance` |
| [react-router](packages/react-router) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-router) | ![npm](https://img.shields.io/npm/dw/@shopify/react-router?label=%E2%87%A9) | A universal router for React |
| [react-server](packages/react-server) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-server) | ![npm](https://img.shields.io/npm/dw/@shopify/react-server?label=%E2%87%A9) | Utilities for React server-side rendering |
| [react-shortcuts](packages/react-shortcuts) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-shortcuts) | ![npm](https://img.shields.io/npm/dw/@shopify/react-shortcuts?label=%E2%87%A9) | Declaratively and efficiently match shortcut combinations in your React application |
| [react-testing](packages/react-testing) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-testing) | ![npm](https://img.shields.io/npm/dw/@shopify/react-testing?label=%E2%87%A9) | A library for testing React components according to our conventions |
| [react-tracking-pixel](packages/react-tracking-pixel) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-tracking-pixel) | ![npm](https://img.shields.io/npm/dw/@shopify/react-tracking-pixel?label=%E2%87%A9) | Allows React apps to easily embed tracking pixel iframes |
| [react-universal-provider](packages/react-universal-provider) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-universal-provider) | ![npm](https://img.shields.io/npm/dw/@shopify/react-universal-provider?label=%E2%87%A9) | Factory function and utilities to create self-serializing/deserializing providers that work for isomorphic applications |
| [react-web-worker](packages/react-web-worker) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/react-web-worker) | ![npm](https://img.shields.io/npm/dw/@shopify/react-web-worker?label=%E2%87%A9) | A hook for using web workers in React applications |
| [rpc](packages/rpc) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/rpc) | ![npm](https://img.shields.io/npm/dw/@shopify/rpc?label=%E2%87%A9) | Utilities for `postMessage`-based remote procedure calls |
| [semaphore](packages/semaphore) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/semaphore) | ![npm](https://img.shields.io/npm/dw/@shopify/semaphore?label=%E2%87%A9) | Counting semaphore |
| [sewing-kit-koa](packages/sewing-kit-koa) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/sewing-kit-koa) | ![npm](https://img.shields.io/npm/dw/@shopify/sewing-kit-koa?label=%E2%87%A9) | Easily access Sewing Kit assets from a Koa server |
| [sewing-kit-plugin-quilt](packages/sewing-kit-plugin-quilt) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/sewing-kit-plugin-quilt) | ![npm](https://img.shields.io/npm/dw/@shopify/sewing-kit-plugin-quilt?label=%E2%87%A9) | Quilt plugins for sewing-kit |
| [statsd](packages/statsd) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/statsd) | ![npm](https://img.shields.io/npm/dw/@shopify/statsd?label=%E2%87%A9) | An opinionated StatsD client for Shopify Node.js servers and other StatsD utilities |
| [storybook-a11y-test](packages/storybook-a11y-test) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/storybook-a11y-test) | ![npm](https://img.shields.io/npm/dw/@shopify/storybook-a11y-test?label=%E2%87%A9) | Test storybook pages with axe and puppeteer |
| [useful-types](packages/useful-types) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/useful-types) | ![npm](https://img.shields.io/npm/dw/@shopify/useful-types?label=%E2%87%A9) | A few handy TypeScript types |
| [web-worker](packages/web-worker) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/web-worker) | ![npm](https://img.shields.io/npm/dw/@shopify/web-worker?label=%E2%87%A9) | Tools for making web workers fun to use |
| [with-env](packages/with-env) | ![npm (scoped)](https://img.shields.io/npm/v/@shopify/with-env) | ![npm](https://img.shields.io/npm/dw/@shopify/with-env?label=%E2%87%A9) | A utility for executing code under a specific `NODE_ENV` |

### Gem Index

| Gem | Version | Description |
| --- | ------- | ----------- |
| [quilt_rails](gems/quilt_rails) | <a href="https://badge.fury.io/rb/quilt_rails"><img src="https://badge.fury.io/rb/quilt_rails.svg" width="200px" /></a> | A turn-key solution for integrating server-rendered React into your Rails app using Quilt libraries |

## Want to contribute?

Check out our [Contributing Guide](./.github/CONTRIBUTING.md)

## Questions?

For Shopifolk, you can reach out to us in Slack in the `#web-foundations` channel. For external inquiries, we welcome bug reports, enhancements, and feature requests via GitHub issues.

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

[<img src="images/shopify.svg" alt="Shopify" width="200" />](https://www.shopify.com/)
