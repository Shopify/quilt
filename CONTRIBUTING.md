# How to contribute

We ❤️ pull requests. If you'd like to fix a bug, contribute a feature or
just correct a typo, please feel free to do so, as long as you follow
our [Code of conduct](https://github.com/Shopify/graphql-tools-web/blob/main/CODE_OF_CONDUCT.md).

If you're thinking of adding a big new feature, consider opening an
issue first to discuss it to ensure it aligns to the direction of the
project (and potentially save yourself some time!).

## Getting Started

To start working on the codebase, first fork the repo, then clone it:

```
git clone git@github.com:your-username/graphql-tools-web.git
```

_Note: replace "your-username" with your Github handle_

Install the project's dependencies (make sure you first have [yarn](https://yarnpkg.com/) installed):

```
yarn
```

Write some features.

Add some tests and make your change. Re-run the tests with:

```
yarn test
```

## Documentation

If your change affects the public API of any packages within `graphql-tools-web` (i.e. adding or changing arguments to a function, adding a new function, changing the return value, etc), please ensure the documentation is also updated to reflect this. Documentation is in the `README.md` files of each package. If further documentation is needed please communicate via Github Issues.

## Changelog

Please make sure you update `CHANGELOG.md` with a high-level description of any changes you make. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## Releasing a new version

The `yarn release` command can be used to create a new version. This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
