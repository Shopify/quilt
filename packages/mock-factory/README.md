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

Contents

1. [Getting started](#getting-started)
   - [createMockFactory<T>()](#createmockfactory)
   - [defaultValues argument](#defaultValues-argument)
   - [overrideValues argument](#overridevalues-argument)
   - [compare](#compare-to-alternatives)

### Getting started

---

#### Quick start

When you want to create a new mock, create a `fixtures` folder in the component directory and place an `index.ts` in it. Mocks can be shared between unit tests and stories.

Folder structure

```
 📂Component
 ┣ 📂tests
 ┣ 📂fixtures
 ┃ ┗ index.ts
 ┣ Component.tsx
 ┣ index.ts
```

Then create the mock by passing required properties:

```tsx
// component/fixtures/index.ts
import {ComponentProps} from 'react';
import {createMockFactory} from 'tests/utilities';

import Component from '../component';

type Props = ComponentProps<typeof Component>;

export const mockComponentProps = createMockFactory<Props>(() => {
  return {
    property: 'some default string',
    otherProperty: faker.random.number(),
  };
});
```

Finally, use the mock into your test file or stories:

```tsx
// component/tests/component.test.tsx or
// component/tests/component.stories.tsx
import {mockComponentProps} from '../fixtures';

// Get values from mock
const defaultProps = mockComponentProps();

// Or use customize values
const customProps = mockComponentProps({
  property: 'some custom string',
});
```

**Important**: do not export the mock factories through the component. Doing so might cause the staging and production builds to fail, as the `/tests` folder is not resolved in those builds.

Conventions:

- name mock factories with `mock${InterfaceName}` so an interface with name `FooBar` would have a mock factory named `mockFooBar`
- name component mock factories with suffix `Props` so component with name `Foo` would have a mock factory named `mockFooProps`
- name the folder where mocks are exported `fixtures` and export named mock factories from an index.ts file in this folder.
- mock factories that should be considered public should be imported from the component fixtures `components/MyComponent/fixtures` index.ts file.

#### createMockFactory()

```tsx
createMockFactory<T>(defaultValues: DeepRequired<T>): <ReturnType extends T = T> (input?: DeepPartial<ReturnType>) => ReturnType;
```

#### defaultValues argument

Use createMockFactory<T> to generate reusable, composable, and strongly typed mock data objects in your stories or unit tests.
To create a mock factory, just pass a typescript interface and your `defaultValues` data to the `createMockFactory` method.
This method will type check your data, to make sure it correctly implements all and only all required properties of the interface.

The `defaultValues` argument will accept either a static object, or a function that will be called each time a mock is created, allowing for randomized or dynamic data.
The default will also restrict your default values to `DeepRequired` props only, so in the example below, `optional` must be set to undefined in the "default" data set. This ensures that the base set of data for an object covers all and only all of the required properties, making the "default" case more accurately reflect how typescript will handle your interface.

```tsx
interface Props {
  disabled: boolean;
  optional?: string;
  nested: MoneyObject;
}

const mockProps = mockMyInterface<Props>({
  disabled: false,
  nested: {
    amount: 10,
    currencyCode: 'USD',
  },
});
```

#### overrideValues argument

Continuing with the example from above, call `mockProps()` to generate mock objects from the factory.

`mockProps()` is a generic function, so it also accepts a type ReturnType, the default value for ReturnType is, well T.

What does that mean? It means that if you call mockProps() with no generic argument, it assumes you want the function to return
a value of the interface the mock is mocking. but you can pass in any interface that extends T also.

That means you could pass in `DeepRequired<T>` and this would mean mockProps() would only be allowed
to return required properties. you could also pass in `T & SuperT` where `SuperT` adds additional properties.

Here is an example:

```tsx
interface Person {
  name: string;
  age: number;
  isActive?: boolean;
}

const mockPerson = createMockFactory<Person>(() => ({
  name: faker.name.firstName(),
  age: faker.random.number({min: 0, max: 100}),
}));

interface PersonWithLastName extends Person {
  lastName: string;
}

// mockPerson() only cares that you fulfil the base interface Person.
// so PersonWithLastName can reuse the mock factory of Person, with complete type safety.
mockPerson<PersonWithLastName>({
  ...mockPerson(),
  lastName: 'wow',
});

// required person this will throw an error because isActive is not required on type Person
mockPerson <
  DeepRequired<Person>({
    isActive: true, // type-error isActive of type boolean is not assignable to type undefined
  });
```

The `overrideValues` argument that is a `DeepPartial` of your interface.

```tsx
interface Props {
  string: string;
  optional?: number;
  nested: {
    optional?: boolean;
  };
}

const part: DeepPartial<Props> = {nested: {optional: false}}; // Good
```

Using a partial of your interface allows each mock instance to override specific properties and merge them with the values from `defaultValues`.
A deep partial allows the properties to be overwritten at any level in the data structure.

```tsx
interface Props {
  string: string;
  optional?: number;
  nested: {
    optional?: boolean;
  };
}

const bad: DeepPartial<DeepRequired<Props>> = {nested: {optional: false}}; // Bad optional is ?: optional, so must be undefined
const good: DeepPartial<DeepRequired<Props>> = {
  string: 'banana',
  nested: {optional: undefined},
}; // Good optional can be initialized as an undefined value.
const alsoGood: DeepPartial<DeepRequired<Props>> = {
  string: 'banana',
  nested: {},
}; // Good optional can be omitted from nested entirely.
```

Typescript will throw an error that the property optional incorrectly implements the type expected, because types boolean and undefined are incompatible.

NOTE:

`Your IDE will make creating mock objects really easy if you have the typescript language service enabled. This will allow for visual feedback in your editor, as well as autocomplete of your data objects.`

#### Composing mocks

You can compose mock factories into larger mock factories. This can reduce code duplication and make your data much more consistent
and reliable. Let's say you define a mockFactory for `MoneyObject`:

```tsx
const mockMoneyObject = createMockFactory<MoneyObject>(() => ({
  amount: randomMoneyAmount(),
  currency: 'USD',
}));
```

You could then use mockMoneyObject(); in the mockProps factory default argument.

```tsx
const mockProps = createMockFactory<Props>({
  disabled: false,
  nested: mockMoneyObject(),
});
```

Now each time you create a mock from mockProps, the nested property will use mockMoneyObject to define its data.
Because nested expects the type `DeepRequired<MockMoneyObject>` our call to `mockMoneyObject()` must return only required data.

Instead of having to continuously redefine values for nested interfaces, you can define just a single mock factory for a typescript interface,
and share the mocking logic into any number of use cases that depend on that interface.
Notice though, that if you don't explicitly use `DeepRequired<T>()` in these composition cases, the value being passed to a parent "defaultValues" argument, will throw an error on the property, instead of the value.

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

// in this case the error will focus on address because it returns the incorrect data set, but it won't tell you
// that zipCode is the issue in a clear precise manner.
createMockFactory<Person>({
  name: faker.random.name(),
  // error is here
  address: mockAddress({
    zipCode: 12345,
  }),
});

// in this case the error will drill down to reveal the zipCode value should be undefined.
createMockFactory<Person>({
  name: faker.random.name(),
  address: mockAddress<DeepRequired<Address>>({
    zipCode: 12345, // error is here
  }),
});
```

#### Compare to alternatives

You might ask, why use a fancy factory method to create some mock objects? Why not just use static values?
Let's compare two code snippets. One using a more basic, 'on-the-fly' getter function, versus a mock factory.

1. 'on-the-fly' mock getter

```tsx
function getMockData(input?: Partial<Props>): Props {
  return merge(
    {
      disabled: false,
      nested: {
        amount: 10,
        currencyCode: 'USD',
      },
    },
    input,
  );
}
```

2. mock factory

```tsx
const mockData = createMockFactory<Props>(() => ({
  disabled: faker.random.boolean(),
  nested: mockMoneyObject(),
}));
```

The key differences are that in the second case you rely on less boilerplate code, you achieve a much higher type safety, and you have much more flexibility in how you design your mocks.
Default values exclude optional properties, giving you very reliable mock data.
Using a factory method for generating the mocks themselves makes the solution scalable and easy to adopt.
Allowing static and dynamic objects retains the option of simple static mocks, but further increases the reliability of the mock with dynamic values, since you don't have to rely on a single value, but a range of values that match the type criterion.
