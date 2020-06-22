# `@shopify/mime-types`

[![Build Status](https://travis-ci.org/Shopify/quilt.svg?branch=master)](https://travis-ci.org/Shopify/quilt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fmime-types.svg)](https://badge.fury.io/js/%40shopify%2Fmime-types.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/mime-types.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/mime-types.svg)

MIME type consistency.

## Installation

```bash
$ yarn add @shopify/mime-types
```

## Usage

This package exposes utilities to dynamically get MIME types from file names and/or get file extensions based on common MIME types.

The types of files currently supported are:

```
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'model/gltf-binary',
  'application/x-mpegURL',
```

This helps keeping MIME types and file extensions consistent.

### `getMimeTypeFromFilename`

Takes in a file name string and returns a `MimeType`.

```ts
import {getMimeTypeFromFilename} from '@shopify/files';

getMimeTypeFromFilename('image.jpg'); // image/jpeg
```

### `getExtensionFromMimeType`

Takes in a `MimeType` and returns a string filename extension that matches the inputted `MimeType`.

```ts
import {getExtensionFromMimeType, MimeType} from '@shopify/files';

getExtensionFromMimeType(MimeType.Pdf); // .pdf
```
