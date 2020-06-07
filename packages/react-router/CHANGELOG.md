# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<-- ## [Unreleased] -->

## [0.0.25] - 2020-05-29

- Change the Router location prop to accept URL as well as string. [1423](https://github.com/Shopify/quilt/pull/1423)

## [0.0.15] - 2019-10-30

- The `<Router />` component will now give a more useful error message when not given a `location` on the server

## [0.0.13] - 2019-10-29

- Adds `RouterChildContext` to exported types

## [0.0.9] - 2019-10-01

- Fix Redirect component
- Fix <Link /> component to explicitly accept a children prop to delegate to the underlying link from `react-router`. [1073](https://github.com/Shopify/quilt/pull/1073)

## [0.0.4] - 2019-09-05

- Move the types to depenedencies

## [0.0.3] - 2019-08-05

- Add more stock `react-router` components

## [0.0.2] - 2019-08-29

- Fix type error in consuming projects with the props of `<Redirect />`

### Added

- `@shopify/react-router` package
