# `@shopify/mock-factory`

[![Build Status](https://github.com/Shopify/quilt/workflows/Node-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ANode-CI)
[![Build Status](https://github.com/Shopify/quilt/workflows/Ruby-CI/badge.svg?branch=main)](https://github.com/Shopify/quilt/actions?query=workflow%3ARuby-CI)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Fmock-factory.svg)](https://badge.fury.io/js/%40shopify%2Fmock-factory.svg) [![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shopify/mock-factory.svg)](https://img.shields.io/bundlephobia/minzip/@shopify/mock-factory.svg)

create typesafe mock data objects.

## Installation

```bash
$ yarn add @shopify/mock-factory
```

## Usage

### `createMockFactory<T>(defaults: DeepOmitOptional<T>)`

Takes a generic argument `T` and a `defaults` argument representing the minimum set of data that `T` can contain. Returns a function `createMock()` that takes an argument `overrides` that will instantiate a unique mock object of T merging the `defaults` and `overrides`.

#### `defaults`:

the argument passed to `createMockFactory<T>()` is used to define the default set of data to use when creating mocks of type T. This argument can be a value of type `T` or a function that returns a value of type `T`, allowing mock factories to create static data or dynamic data depending on your use case.

##### Static Mock

Mock static props by passing a raw value as the `default` argument. Each time you create a mock from this factory, the static value will be used as the default value. You can still modify the returned mock by passing `overrides` to the returned function

```ts
interface Props {
  title: string;
}

const mockProps = createMockFactory<Props>({title: 'Title'});

const mock = mockProps(); // always returns {title: 'Title'}
const override = mockProps({title: 'Foo'}); // can override value still {title: 'Foo'}
```

##### Dynamic Mock

Pass a function as the `default` argument to create a new unique value each time you create a mock. This allows for more complex relationships between values and randomization.

```ts
interface Props {
  loading: boolean;
  title: string | null;
}

const mockProps = createMockFactory<Props>(() => {
  const loading = Math.random() > 0.5;

  return {
    loading,
    title: loading ? null : faker.random.word(),
  };
});

const mock = mockProps(); // {loading: true, title: 'Oasis'}
const mockTwo = mockProps(); // {loading: false, title: null} // dynamic value returned each time the mock is
```

The `default` value function receives the `overrides` value as an argument. This allows dynamic `default` values to be influenced by `override` values.

In this example, the `default` value of 'title' is based on the value of 'loading' passed to the `override`. This allows you to create mocks which not only conform to type constraints but can accurately model real relationships between two values that make sense. If the value of 'loading' is true, either by default or by override, the default value of title will be null

```ts
interface Props {
  loading: boolean;
  title: string | null;
}

const mockProps = createMockFactory<Props>((overrides) => {
  const loading = overrides.loading || Math.random() > 0.5;

  return {
    loading,
    title: loading ? null : faker.random.word(),
  };
});

const mock = mockProps(); // {loading: true, title: 'Oasis'}
const mockTwo = mockProps(); // {loading: false, title: null} // dynamic value returned each time the mock is called
const mockLoading = mockProps({loading: true}); // {loading:true, title: null} // guarantee value of title is determined by value of loading
const mockAll = mockProps({loading: true, title: 'Title'}); // you can still override any values
```

#### `override`:

The value of type `DeepPartial<ReturnValue>` passed to function `createMock()` returned by `createMockFactory()`. This value allows values to be explicitly set for a given mock. As the name suggests, `override` values will override `default` values.

```ts
interface Address {
  street: string;
  zip: string;
}

interface Being {
  name: string;
  address: Address;
}

const mockBeing = createMockFactory<Being>({name: 'Foo'});

const barMock = mockBeing({name: 'Bar'}); // values passed as overrides, override default values.
const fooMock = mockBeing({}); // {} matches DeepPartial<Being> so is valid
const zipMock = mockBeing({address: {zip: '12345'}}); // specify only required values since all values are optional
```

Since `createMock<ReturnValue>()` is also a generic function, the type of `override` is a partial of `ReturnValue` which extends `T` instead of the explicit type `T`. this allows a call to `createMock` to extend the base type either adding or constraining values.

```ts
interface Being {
  name: string;
}

interface Person extends Being {
  age?: number;
}

interface Vampire extends Being {
  canFly?: boolean;
}

const mockBeing = createMockFactory<Being>({name: 'Foo'});

const personMock = mockBeing<Person>({age: 20});
const vampireMock = mockBeing<Vampire>({canFly: true});
const restrictedPerson = mockBeing<DeepOmitOptional<Person>>({age: 10}); // will throw a typescript error since type of number cannot be assigned to type never.
```

### Types

Mock factories are typed, all the way. Both the `deafult` argument and `override` are typed arguments ensuring that data used in a mock are valid.

Mock factories go beyond this and ensure that the `default` argument is typed according to `DeepOmitOptional`. This effectively sets the value for any optional property to 'never'

```ts
interface Address {
  street: string;
  isApartment?: boolean;
}
interface Person {
  name: string;
  age: number;
  active?: boolean;
  Address: Address;
}

const mockPerson = createMockFactory<Person>({
  name: 'foo',
  age: 10,
  active: true, // invalid (this will trigger a typescript error) as type boolean is not assignable to type never
  address: {
    street: 'fake street',
    isApartment: false, // again, this will throw an error.
  },
});
```

The `override` argument type is a deep partial of the expected return type. This essentially converts all properties to optional properties.

```ts
const person = mockPerson({active: true, address: {isApartment: true}}); // any combination of properties at any depth is valid
```

### Mocking react component props

Easily mock react component props with mock factories using ComponentProps<typeof Component>

```tsx
import React, {ComponentProps} from 'react';
import {createMockFactory} from '@shopify/mock-factory';

interface Props {
  loading: boolean;
}

function MyComponent(props: Props) {
  if (loading) {
    return null;
  }
  return <>Hello</>;
}

const mockMyComponentProps = createMockfactory<
  ComponentProps<typeof MyComponent>
>({
  loading: true,
});
```

### Merging Arrays

Array values are resolved by merging `default` and `override` arrays if both are non-empty arrays. If an empty array is passed as `override` then the arrays are not merged and the empty array is used.

```ts
interface Person {
  name: string;
  age: number;
  friends: Person[];
}

const mockPerson = createMockFactory<Person>(() => {
  return {
    name: 'Foo',
    age: 30,
    friends: [{name: 'Bar', age: 20, friends: []}],
  };
});

const result = mockPerson({}); // {name: 'Foo', age: 30, friends: [{name: 'Bar', age: 20, friends: []}]}
const overrideName = mockPerson({friends: [{name: 'Baz'}]}); // name is 'Baz' instead of 'Bar'.
const noFriends = mockPerson({friends: []}); // {name: 'Foo', age: 30, friends: []}
```

### Composing mocks

You can compose mock factories into larger mock factories. This can reduce code duplication and make your data much more consistent
and reliable. Let's say you define a mockFactory for `Money`:

```tsx
enum CurrencyCode {
  USD = 'USD',
}

interface Money {
  exact?: boolean;
  amount: number;
  currency: CurrencyCode;
}

const mockMoney = createMockFactory<Money>(() => ({
  amount: randomMoneyAmount(),
  currency: CurrencyCode.USD,
}));
```

Now if you create a mock factory for another type that references the type 'Money', you can use mockMoney() for the `deafult` argument of another type, since the return type of mockMoney().

```tsx
interface PriceRange {
  min: Money;
  max: Money;
}

const mockPriceRange = createMockFactory<PriceRange>(() => {
  const min = mockMoney();

  return {
    min,
    // we can define relationships between values
    // in this case we expect that max.amount > min.amount.
    max: mockMoney({amount: min.amount * faker.random.number()})
  };
}
});
```

In this case, the value expected by 'min', and 'max' is `DeepRequired<Money>` and such, only required properties can be passed to `mockMoney`

```ts
const mockPriceRange = createMockFactory<PriceRange>(() => {
  return {
    min: mockMoney(),
    max: mockMoney({exact: true}), // this will throw a typescript error as exact is an optional property of Money and thus cannot be defined as a `default` of PriceRange.
  };
});
```

### Error Messages

Sometimes when composing mocks for large, deeply nested objects you will end up recieving bloated typescript errors. To simplify managing these errors and finding the precise error, you can narrow default types of nested mocks.

```tsx
import {createMockFactory} from './createMockFactory';

interface Address {
  street: string;
  zipCode?: number;
}

const mockAddress = createMockFactory<Address>({
  street: faker.address.street(),
});

interface Person {
  name: string;
  address: Address;
}

// in this case typescript will claim that address is an invalid type, and will not specify that specifically the zip code is invalid.
createMockFactory<Person>({
  name: faker.random.name(),
  // error is here
  address: mockAddress({
    zipCode: 12345,
  }),
});

// in this case the error will drill down to reveal the zipCode value should be undefined.
// you can set the return value of mockAddress to specify you only can return values expected by 'address'
createMockFactory<Person>({
  name: faker.random.name(),
  address: mockAddress<DeepRequired<Address>>({
    zipCode: 12345, // error is here
  }),
});
```
