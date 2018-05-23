# quilt

A loosely related set of packages for JavaScript/Typescript projects at Shopify. These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, Koa for the server, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

[![CircleCI](https://circleci.com/gh/Shopify/quilt.svg?style=svg&circle-token=8dafbec2d33dcb489dfce1e82ed37c271b26aeba)](https://circleci.com/gh/Shopify/quilt)

[![codecov](https://codecov.io/gh/Shopify/quilt/branch/master/graph/badge.svg)](https://codecov.io/gh/Shopify/quilt)

This repository uses [lerna](https://github.com/lerna/lerna) to manage it's packages as a 'monorepo' (a repository containing many packages). Links to individual packages can be found below.

## Packages

| package                              |                                                                                          |                                                                                                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enzyme-utilities`                   | [README](packages/enzyme-utilities/README.md)                                            | [![npm version](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities.svg)](https://badge.fury.io/js/%40shopify%2Fenzyme-utilities)                                   |
| `jest-dom-mocks`                     | [README](packages/jest-dom-mocks/README.md)                                              | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks.svg)](https://badge.fury.io/js/%40shopify%2Fjest-dom-mocks)                                       |
| `jest-mock-apollo`                   | [README](packages/jest-mock-apollo/README.md)                                            | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-apollo)                                   |
| `jest-mock-router`                   | [README](packages/jest-mock-router/README.md)                                            | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-mock-router.svg)](https://badge.fury.io/js/%40shopify%2Fjest-mock-router)                                   |
| `jest-koa-mocks`                     | [README](https://github.com/Shopify/quilt/blob/master/packages/jest-koa-mocks/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks.svg)](https://badge.fury.io/js/%40shopify%2Fjest-koa-mocks)                                       |
| `koa-shopify-auth`                   | [README](packages/koa-shopify-auth/README.md)                                            | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-auth)                                   |
| `koa-shopify-graphql-proxy`          | [README](packages/koa-shopify-graphql-proxy/README.md)                                   | [![npm version](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy.svg)](https://badge.fury.io/js/%40shopify%2Fkoa-shopify-graphql-proxy)                 |
| `with-env`                           | [README](packages/with-env/README.md)                                                    | [![npm version](https://badge.fury.io/js/%40shopify%2Fwith-env.svg)](https://badge.fury.io/js/%40shopify%2Fwith-env)                                                   |
| `react-serialize`                    | [README](packages/react-serialize/README.md)                                             | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-serialize.svg)](https://badge.fury.io/js/%40shopify%2Freact-serialize)                                     |
| `react-html`                         | [README](packages/react-html/README.md)                                                  | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-html.svg)](https://badge.fury.io/js/%40shopify%2Freact-html)                                               |
| `react-compose`                      | [README](packages/react-compose/README.md)                                               | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-compose.svg)](https://badge.fury.io/js/%40shopify%2Freact-compose)                                         |
| `react-shopify-app-route-propagator` | [README](packages/react-shopify-app-route-propagator/README.md)                          | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shopify-app-route-propagator.svg)](https://badge.fury.io/js/%40shopify%react-shopify-app-route-propagator) |
| `react-shortcuts`                    | [README](packages/react-shortcuts/README.md)                                             | [![npm version](https://badge.fury.io/js/%40shopify%2Freact-shortcuts.svg)](https://badge.fury.io/js/%40shopify%2Freact-html)                                          |

## Contribute

Check out our [Contributing Guidelines](CONTRIBUTING.md)

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

<a href="http://www.shopify.com/"><img src="https://cdn.shopify.com/assets2/press/brand/shopify-logo-main-small-f029fcaf14649a054509f6790ce2ce94d1f1c037b4015b4f106c5a67ab033f5b.png" alt="Shopify" width="200" /></a>
