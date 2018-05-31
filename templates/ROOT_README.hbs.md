# quilt

A loosely related set of packages for JavaScript/Typescript projects at Shopify. These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, Koa for the server, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![codecov](https://codecov.io/gh/Shopify/quilt/branch/master/graph/badge.svg)](https://codecov.io/gh/Shopify/quilt)

This repository uses [lerna](https://github.com/lerna/lerna) to manage it's packages as a 'monorepo' (a repository containing many packages). Links to individual packages can be found below.

## Packages

| package |     |     |
| ------- | --- | --- |
{{#each packageNames}}
| {{this}} | [README](packages/{{this}}/README.md) | [![npm version](https://badge.fury.io/js/%40shopify%2F{{this}}.svg)](https://badge.fury.io/js/%40shopify%2F{{this}}) |
{{/each}}

## Contribute

Check out our [Contributing Guidelines](CONTRIBUTING.md)

## License


MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

<a href="http://www.shopify.com/"><img src="https://cdn.shopify.com/assets2/press/brand/shopify-logo-main-small-f029fcaf14649a054509f6790ce2ce94d1f1c037b4015b4f106c5a67ab033f5b.png" alt="Shopify" width="200" /></a>
