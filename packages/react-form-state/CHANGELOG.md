# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed

- Fixed using multiple layers deep of Nested and List breaking the state

## [0.2.9]

### Fixed

- No longer accidentally import all of lodash.

## [0.2.8]

### Changed

- Validators based on `validate` now always succeed for an empty input. The `required` and `requiredString` validators continue to behave the same way they used to.

### Fixed

- Fixed Nested and List component race condition. Nested and List now pass a function to their `onChange` prop instead of an object so that the data object will be created within `setState`.
