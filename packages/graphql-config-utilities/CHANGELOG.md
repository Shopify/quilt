# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Breaking Change

- Update minimum supported node version to 12.14.0. Add engines field to help enforce usage of this version. [#1906](https://github.com/Shopify/quilt/pull/1906)

## 2.0.2 - 2021-05-19

### Changed

- Refactor `getGraphQLProjects` to take default projects into consideration. [#1894](https://github.com/Shopify/quilt/pull/1894)

## 2.0.1 - 2021-05-07

### Breaking Change

- Update `graphql-config` to version 3. [#1883](https://github.com/Shopify/quilt/pull/1883)

## 1.3.2 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.3.0 - 2021-03-11

### Changed

- Move from graphql-tools-web repo to quilt
