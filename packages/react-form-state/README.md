# `@shopify/react-form-state`

> [!CAUTION]
>
> `@shopify/react-form-state` is deprecated.
>
> Shopifolk, see
> [Shopify/quilt-internal](https://github.com/shopify/quilt-internal) for
> information on the latest packages available for use internally.

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Freact-form-state.svg)](https://badge.fury.io/js/%40shopify%2Freact-form-state.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/react-form-state.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/react-form-state.svg)

Manage React forms tersely and type-safely with no magic.

This library is now superseded by [@shopify/react-form](https://github.com/Shopify/quilt/tree/main/packages/react-form) as it allows you to write the preferred, functional, and hooks-driven React components over class-based ones.

## Installation

```bash
yarn add @shopify/react-form-state
```

## Usage

### `<FormState />`

The default component exported by this library is `<FormState />`.

```typescript
import FormState from '@shopify/react-form-state';
```

```typescript
// Fields here refers to the inferred type of your initialValues object
interface Props<Fields> {
  initialValues: Fields;
  validators?: Partial<ValidatorDictionary<Fields>>;
  onSubmit?: SubmitHandler<Fields>;
  validateOnSubmit?: boolean;
  children(form: FormDetails<Fields>): React.ReactNode;
}
```

Its only mandatory props are `initialValues` and `children`. The `initialValues` prop is used to infer all the types for the rest of the component, and to generate handlers and field state objects. The `children` prop expects a function of the current state of the form, which is represented by a `FormDetails` object.

```typescript
<FormState initialValues={myInitialValues}>
  {({fields, dirty, valid, submitting, errors, reset, submit}) => {
    return /* some cool ui */;
  }}
</FormState>
```

For detailed explanations of how to use `<FormState />` check out [the guide](https://github.com/Shopify/quilt/tree/main/packages/react-form-state/docs/building-forms.md).

### `validators`

The library also makes a number of validation factory functions available out of the box that should help with common use cases, as well as some tools to make building reusable custom validators easy.

```typescript
import {validate, validators} from '@shopify/react-form-state';
```

For detailed explanations of the validation utilities, check out [the validation docs](https://github.com/Shopify/quilt/tree/main/packages/react-form-state/docs/validators.md).
