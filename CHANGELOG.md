<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.4.1](https://github.com/carlocorradini/graphql-auth-directive/releases/tag/v0.4.1) - 2022-10-18

### Fixed

- Check context presence in `defaultAuthFn` procedure

## [v0.4.0](https://github.com/carlocorradini/graphql-auth-directive/releases/tag/v0.4.0) - 2022-10-18

### Added

- Default auth procedure `defaultAuthFn`

### Changed

- Removed source map for `.d.ts` files

- Removed `Context` type

## [v0.3.1](https://github.com/carlocorradini/graphql-auth-directive/releases/tag/v0.3.1) - 2022-10-13

### Added

- Added more comments

### Fixed

- Comments are still available after compilation

## [v0.3.0](https://github.com/carlocorradini/graphql-auth-directive/releases/tag/v0.3.0) - 2022-10-13

### Added

- `roles` and `permissions` configuration `default` value `TRole` value or `TRole` array

### Changed

- Renamed `typeName` to `enumName` in `roles` and `permissions` configurations

- Rename `defaultValue` to `default` in `roles` and `permissions` configurations

## [v0.2.0](https://github.com/carlocorradini/graphql-auth-directive/releases/tag/v0.2.0) - 2022-10-12

### Added

- Accept generics `TRole` and `TPermission` along with `TContext`

- `TypeGraphQL` integration example

## [v0.1.1](https://github.com/carlocorradini/graphql-auth-directive/releases/tag/v0.1.1) - 2022-10-11

### Fixed

- Typescript paths

## [v0.1.0](https://github.com/carlocorradini/graphql-auth-directive/releases/tag/v0.1.0) - 2022-10-11

- Initial release
