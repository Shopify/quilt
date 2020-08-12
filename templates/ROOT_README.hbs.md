[comment]: # (NOTE: This file is generated and should not be modify directly. Update `templates/ROOT_README.hbs.md` instead)
# Quilt

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![codecov](https://codecov.io/gh/Shopify/quilt/branch/master/graph/badge.svg)](https://codecov.io/gh/Shopify/quilt)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

A loosely related set of packages for JavaScript/TypeScript projects at Shopify.

These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, Koa for the server, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

## Usage

The Quilt repo is managed as a monorepo that is composed of {{jsPackages.length}} npm packages and one Ruby gem.
Each package/gem has its own `README.md` and documentation describing usage.

### Package Index

| Package | Version | Description |
| ------- | ------- | ----------- |
{{#each jsPackages}}
| [{{name}}](packages/{{name}}) | <a href="https://badge.fury.io/js/%40shopify%2F{{name}}"><img src="https://badge.fury.io/js/%40shopify%2F{{name}}.svg" width="200px" /></a> | {{{description}}} |
{{/each}}

### Gem Index

| Gem | Version | Description |
| --- | ------- | ----------- |
{{#each gems}}
| [{{name}}](gems/{{name}}) | <a href="https://badge.fury.io/rb/{{name}}"><img src="https://badge.fury.io/rb/{{name}}.svg" width="200px" /></a> | {{{description}}} |
{{/each}}

## Want to contribute?

Check out our [Contributing Guide](./.github/CONTRIBUTING.md)

## Questions?

For Shopifolk, you can reach out to us in Slack in the `#web-foundation-tech` channel. For external inquiries, we welcome bug reports, enhancements, and feature requests via GitHub issues.

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

<a href="http://www.shopify.com/"><img src="https://cdn.shopify.com/assets2/brand-assets/shopify-logo-main-8ee1e0052baf87fd9698ceff7cbc01cc36a89170212ad227db3ff2706e89fd04.svg" alt="Shopify" width="200" /></a>
