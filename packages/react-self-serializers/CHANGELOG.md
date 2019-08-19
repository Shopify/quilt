# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- the `GraphQL` self-serializer no longer takes options that are used to construct an Apollo client. Instead, you must now provide a `createClient` prop to `GraphQL`, which should return the Apollo client to provide to children of the `GraphQL` component. ([#878](https://github.com/Shopify/quilt/pull/878))

### Added

- added `createSelfSerializer` factory function that can be use to create a self-serialized Provider given a React Context ([#875](https://github.com/Shopify/quilt/pull/875))

## [1.0.2] - 2019-08-08

### Chore

- Moved all dependencies to peerDependencies [831](https://github.com/Shopify/quilt/pull/831)

## [1.0.0] - 2019-07-25

### Added

- `@shopify/react-self-serializers` package
- `<GraphQL />` self-serializer ([810](https://github.com/Shopify/quilt/pull/810))
