[comment]: # (NOTE: This file is generated and should not be modify directly. Update `templates/ROOT_README.hbs.md` instead)
# Quilt

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

A loosely related set of packages for JavaScript/TypeScript projects at Shopify.

These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, Koa for the server, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

⚠️ Over the past few years, this repo has become a dumping ground for a variety of packages unrelated to the core problems Quilt aims to solve. Before submitting a pull request, please speak with the Web Foundations team on guidance as to whether a package might belong in Quilt.

## Usage

The Quilt repo is managed as a monorepo that is composed of {{jsPackages.length}} npm packages and one Ruby gem.
Each package/gem has its own `README.md` and documentation describing usage.

### Package Index

| Package | Version | Description |
| ------- | ------- | ----------- |
{{#each jsPackages}}
| [{{name}}](packages/{{unscopedName}}) | <a href="https://badge.fury.io/js/{{urlEncodedName}}"><img src="https://badge.fury.io/js/{{urlEncodedName}}.svg" width="200px" /></a> | {{{description}}} |
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

For Shopifolk, you can reach out to us in Slack in the `#web-foundations` channel. For external inquiries, we welcome bug reports, enhancements, and feature requests via GitHub issues.

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

[<img src="images/shopify.svg" alt="Shopify" width="200" />](https://www.shopify.com/)
