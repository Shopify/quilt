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
| address | [README](packages/address/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Faddress.svg)](https://badge.fury.io/js/%40shopify%2Faddress) |
| address-mocks | [README](packages/address-mocks/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Faddress-mocks.svg)](https://badge.fury.io/js/%40shopify%2Faddress-mocks) |
| admin-graphql-api-utilities | [README](packages/admin-graphql-api-utilities/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fadmin-graphql-api-utilities) |
| csrf-token-fetcher | [README](packages/csrf-token-fetcher/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher.svg)](https://badge.fury.io/js/%40shopify%2Fcsrf-token-fetcher) |
| dates | [README](packages/dates/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fdates.svg)](https://badge.fury.io/js/%40shopify%2Fdates) |
| enzyme-utilities | [README](packages/enzyme-utilities/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities) |
| i18n | [README](packages/i18n/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fi18n.svg)](https://badge.fury.io/js/%40shopify%2Fi18n) |
| jest-dom-mocks | [README](packages/jest-dom-mocks/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks.svg)](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks) |
| jest-koa-mocks | [README](packages/jest-koa-mocks/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks.svg)](https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks) |
| jest-mock-apollo | [README](packages/jest-mock-apollo/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo) |
| jest-mock-router | [README](packages/jest-mock-router/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-router.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-router) |
| koa-liveness-ping | [README](packages/koa-liveness-ping/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-liveness-ping) |
| koa-metrics | [README](packages/koa-metrics/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-metrics.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-metrics) |
| koa-shopify-auth | [README](packages/koa-shopify-auth/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth) |
| koa-shopify-graphql-proxy | [README](packages/koa-shopify-graphql-proxy/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy) |
| logger | [README](packages/logger/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Flogger.svg)](https://badge.fury.io/js/%40shopify%2Flogger) |
| react-compose | [README](packages/react-compose/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-compose.svg)](https://badge.fury.io/js/%40shopify%2Freact-compose) |
| react-form-state | [README](packages/react-form-state/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-form-state.svg)](https://badge.fury.io/js/%40shopify%2Freact-form-state) |
| react-google-analytics | [README](packages/react-google-analytics/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-google-analytics.svg)](https://badge.fury.io/js/%40shopify%2Freact-google-analytics) |
| react-html | [README](packages/react-html/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-html.svg)](https://badge.fury.io/js/%40shopify%2Freact-html) |
| react-i18n | [README](packages/react-i18n/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-i18n.svg)](https://badge.fury.io/js/%40shopify%2Freact-i18n) |
| react-import-remote | [README](packages/react-import-remote/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-import-remote.svg)](https://badge.fury.io/js/%40shopify%2Freact-import-remote) |
| react-preconnect | [README](packages/react-preconnect/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-preconnect.svg)](https://badge.fury.io/js/%40shopify%2Freact-preconnect) |
| react-serialize | [README](packages/react-serialize/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-serialize.svg)](https://badge.fury.io/js/%40shopify%2Freact-serialize) |
| react-shopify-app-route-propagator | [README](packages/react-shopify-app-route-propagator/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator) |
| react-shortcuts | [README](packages/react-shortcuts/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shortcuts.svg)](https://badge.fury.io/js/%40shopify%2Freact-shortcuts) |
| react-tracking-pixel | [README](packages/react-tracking-pixel/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel.svg)](https://badge.fury.io/js/%40shopify%2Freact-tracking-pixel) |
| with-env | [README](packages/with-env/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fwith-env.svg)](https://badge.fury.io/js/%40shopify%2Fwith-env) |

## Want to contribute?

Check out our [Contributing Guide](./.github/CONTRIBUTING.md)

## Questions?

For Shopifolk, you can reach out to us in Slack on the `#quilt` and `#web-foundation-tech` channels. For external inquiries, we welcome bug reports, enhancements, and feature requests via Github issues.

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

<a href="http://www.shopify.com/"><img src="https://cdn.shopify.com/assets2/press/brand/shopify-logo-main-small-f029fcaf14649a054509f6790ce2ce94d1f1c037b4015b4f106c5a67ab033f5b.png" alt="Shopify" width="200" /></a>
