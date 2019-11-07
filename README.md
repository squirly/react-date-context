# `react-date-context`

[![CircleCI](https://circleci.com/gh/squirly/react-date-context/tree/master.svg?style=svg)](https://circleci.com/gh/squirly/react-date-context/tree/master)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> A set of React components for managing realtime UI updates that depend on the
> current time.

## Table of Contents

*   [Background](#background)
*   [Install](#install)
*   [Usage](#usage)
*   [Maintainers](#maintainers)
*   [Contribute](#contribute)
*   [License](#license)

## Background

Rendering and updating React components that depend on the real time is hard.
Testing React component trees that use `new Date()` directly is even more
difficult.

## Install

This project can be installed using [npm](https://npmjs.com). Go check them out
if you don't have them locally installed.

```sh
$ npm install react-date-context
```

## Usage

This package contains three React components.

### `<RealDate>`

### `<StaticDate>`

### `<CurrentDate>`

## Maintainers

[@squirly](https://github.com/squirly)

## Contribute

Feel free to dive in!
[Open an issue](https://github.com/RichardLitt/standard-readme/issues/new) or
submit PRs.

### Publishing

To publish,

*   `git checkout master && git pull --ff-only`; then
*   bump the version with `npm version ...`; then
*   run `git push --tags`; then
*   publish to npm with `npm run publish`.

## License

[MIT](LICENSE) © Tyler David Jones
