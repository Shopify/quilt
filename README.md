# quilt

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![codecov](https://codecov.io/gh/Shopify/quilt/branch/master/graph/badge.svg)](https://codecov.io/gh/Shopify/quilt)
[![Greenkeeper badge](https://badges.greenkeeper.io/Shopify/quilt.svg)](https://greenkeeper.io/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

A loosely related set of packages for JavaScript / TypeScript projects at Shopify.

These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, Koa for the server, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

## Usage

The Quilt repo is managed as a monorepo that is composed of many npm packages.
Each package has its own `README` and documentation describing usage.

### Package Index

| package |     |     |
| ------- | --- | --- |
| address | [directory](packages/address) | [![npm version](https://badge.fury.io/js/%40shopify%2Faddress.svg)](https://badge.fury.io/js/%40shopify%2Faddress) |
| address-mocks | [directory](packages/address-mocks) | [![npm version](https://badge.fury.io/js/%40shopify%2Faddress-mocks.svg)](https://badge.fury.io/js/%40shopify%2Faddress-mocks) |
| admin-graphql-api-utilities | [directory](packages/admin-graphql-api-utilities) | [![npm version](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities) |
| csrf-token-fetcher | [directory](packages/csrf-token-fetcher) | [![npm version](https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher.svg)](https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher) |
| dates | [directory](packages/dates) | [![npm version](https://badge.fury.io/js/%40shopify%2Fdates.svg)](https://badge.fury.io/js/%40shopify%2Fdates) |
| enzyme-utilities | [directory](packages/enzyme-utilities) | [![npm version](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities) |
| i18n | [directory](packages/i18n) | [![npm version](https://badge.fury.io/js/%40shopify%2Fi18n.svg)](https://badge.fury.io/js/%40shopify%2Fi18n) |
| jest-dom-mocks | [directory](packages/jest-dom-mocks) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks.svg)](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks) |
| jest-koa-mocks | [directory](packages/jest-koa-mocks) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks.svg)](https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks) |
| jest-mock-apollo | [directory](packages/jest-mock-apollo) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo) |
| jest-mock-router | [directory](packages/jest-mock-router) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-router.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-router) |
| koa-liveness-ping | [directory](packages/koa-liveness-ping) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping) |
| koa-metrics | [directory](packages/koa-metrics) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-metrics.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-metrics) |
| koa-shopify-auth | [directory](packages/koa-shopify-auth) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth) |
| koa-shopify-graphql-proxy | [directory](packages/koa-shopify-graphql-proxy) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy) |
| logger | [directory](packages/logger) | [![npm version](https://badge.fury.io/js/%40shopify%2Flogger.svg)](https://badge.fury.io/js/%40shopify%2Flogger) |
| network | [directory](packages/network) | [![npm version](https://badge.fury.io/js/%40shopify%2Fnetwork.svg)](https://badge.fury.io/js/%40shopify%2Fnetwork) |
| polyfills | [directory](packages/polyfills) | [![npm version](https://badge.fury.io/js/%40shopify%2Fpolyfills.svg)](https://badge.fury.io/js/%40shopify%2Fpolyfills) |
| react-compose | [directory](packages/react-compose) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-compose.svg)](https://badge.fury.io/js/%40shopify%2Freact-compose) |
| react-effect | [directory](packages/react-effect) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-effect.svg)](https://badge.fury.io/js/%40shopify%2Freact-effect) |
| react-form-state | [directory](packages/react-form-state) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-form-state.svg)](https://badge.fury.io/js/%40shopify%2Freact-form-state) |
| react-google-analytics | [directory](packages/react-google-analytics) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-google-analytics.svg)](https://badge.fury.io/js/%40shopify%2Freact-google-analytics) |
| react-html | [directory](packages/react-html) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-html.svg)](https://badge.fury.io/js/%40shopify%2Freact-html) |
| react-i18n | [directory](packages/react-i18n) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg)](https://badge.fury.io/js/%40shopify%2Freact-i18n) |
| react-import-remote | [directory](packages/react-import-remote) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-import-remote.svg)](https://badge.fury.io/js/%40shopify%2Freact-import-remote) |
| react-network | [directory](packages/react-network) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-network.svg)](https://badge.fury.io/js/%40shopify%2Freact-network) |
| react-preconnect | [directory](packages/react-preconnect) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-preconnect.svg)](https://badge.fury.io/js/%40shopify%2Freact-preconnect) |
| react-serialize | [directory](packages/react-serialize) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-serialize.svg)](https://badge.fury.io/js/%40shopify%2Freact-serialize) |
| react-shopify-app-route-propagator | [directory](packages/react-shopify-app-route-propagator) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator) |
| react-shortcuts | [directory](packages/react-shortcuts) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shortcuts.svg)](https://badge.fury.io/js/%40shopify%2Freact-shortcuts) |
| react-tracking-pixel | [directory](packages/react-tracking-pixel) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel.svg)](https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel) |
| sewing-kit-koa | [directory](packages/sewing-kit-koa) | [![npm version](https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa.svg)](https://badge.fury.io/js/%40shopify%2Fsewing-kit-koa) |
| useful-types | [directory](packages/useful-types) | [![npm version](https://badge.fury.io/js/%40shopify%2Fuseful-types.svg)](https://badge.fury.io/js/%40shopify%2Fuseful-types) |
| with-env | [directory](packages/with-env) | [![npm version](https://badge.fury.io/js/%40shopify%2Fwith-env.svg)](https://badge.fury.io/js/%40shopify%2Fwith-env) |

## Want to contribute?

Check out our [Contributing Guide](./.github/CONTRIBUTING.md)

## Questions?

For Shopifolk, you can reach out to us in Slack on the `#quilt` and `#web-foundation-tech` channels. For external inquiries, we welcome bug reports, enhancements, and feature requests via Github issues.

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

<a href="http://www.shopify.com/"><img src="https://cdn.shopify.com/assets2/press/brand/shopify-logo-main-small-f029fcaf14649a054509f6790ce2ce94d1f1c037b4015b4f106c5a67ab033f5b.png" alt="Shopify" width="200" /></a>
