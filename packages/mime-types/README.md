# `@shopify/mime-types`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fmime-types.svg)](https://badge.fury.io/js/%40shopify%2Fmime-types.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/mime-types.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/mime-types.svg)

MIME type consistency.

## Installation

```bash
yarn add @shopify/mime-types
```

## Usage

This package exposes utilities to dynamically get MIME types from file names and/or get file extensions based on common MIME types.

The types of files currently supported are:

```
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'model/gltf-binary',
  'application/x-mpegURL',
  'model/vnd.usdz+zip',
```

This helps keeping MIME types and file extensions consistent.

### `getMimeTypeFromFilename`

Takes in a file name string and returns a `MimeType`.

```ts
import {getMimeTypeFromFilename} from '@shopify/mime-types';

getMimeTypeFromFilename('image.jpg'); // image/jpeg
```

### `getExtensionFromMimeType`

Takes in a `MimeType` and returns a string filename extension that matches the inputted `MimeType`.

```ts
import {getExtensionFromMimeType, MimeType} from '@shopify/mime-types';

getExtensionFromMimeType(MimeType.Pdf); // .pdf
```
