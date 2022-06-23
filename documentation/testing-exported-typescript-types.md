# Testing exported typescript types

## Setting up tsd tests

We use [tsd](https://github.com/SamVerschueren/tsd). to test typescript types. In order to enable testing for your project, just add a directory `test-d` to the package root (packages/<your-package>/test-d). In this directory you can add files to assert on types.

Example:

```
📂 packages
├─ 📂 useful-types
├── 📂 build
│   └── 📂 ts
│       └── types.d.ts (built typings file)
├──── 📂 src
│     ├── Something.ts (source code)
│     └── Something.ts
└──── 📂 test-d
      ├── Something.test-d.ts (typescript tests)
      └── Something.test-d.ts
```

The `test-d.ts` extension disables eslint errors without making them match jest test files.

## Useful tests

Assuming you have some source types in `./src/types.ts`

```tsx
export interface Person {
  firstName: string;
}

export type ArrayElement<T> = T extends (infer U)[] ? U : never;
```

and an exported function in `./src/index.ts`

```tsx
import {Person} from './types';

export * from './types';

export function createPerson(input?: Person): Person {
  return {
    firstName: input?.firstName ?? 'bob',
  };
}
```

You can test types or code from your build folder by importing it and the tsd assertion methods.

Check positive scenarios, that a value of a given type matches or is assignable to your value. Use the most strict assertion possible.

```tsx
import {expectType, expectAssignable} from 'tsd';

import {ArrayElement, Person} from '../build/ts/types';

// strict checks value type equality
expectType<ArrayElement<Person[]>>(createPerson());

// loose checks value assignable to type
expectAssignable<ArrayElement<string[]>>('foo');
```

Also check that values which do not match your type are not assignable, especially when you include conditional logic in a generic type.

```tsx
import {expectError, expectNotAssignable} from 'tsd';

import {ArrayElement} from '../build/ts/types';
import {createPerson} from '../build/ts/index';

// string is not a member of an array, so we should not be able to assign anything to it.
expectNotAssignable<ArrayElement<string>>('string');

// createPerson expects an input of Person where firstName is a string. We pass a boolean and so will throw an argument error.
expectError<typeof createPerson>(() => createPerson({firstName: true}));
```

Notice we import the types from our build folder. TSD is expecting to assert against our build folder and will ensure that file is available to typescript during execution. You will not be able to import source types.

## How does it work?

TSD is run as a part of the build and any errors will be logged and cause your build to fail. Since TSD is testing `built` typescript typings files, loom will first build the package, and then tsd will test against the exported types.

All quilt packages reference a `types` property in their package.json. This is the typings file TSD will test against. As mentioned above, this is where you should import your types from.

```json
{
  "name": "@shopify/foo",
  "types": "./build/ts/index.d.ts"
}
```

## Why not just use `yarn type-check`?

Typechecking quilt source code ensures that there are no type errors in the source code. TSD allows us to assert that types built by quilt packages implement the logical constraints we intend them to. You can test error cases, negative cases, and a range of positive cases. This leads to more resilient types and easier refactoring of types.

## Why not just use `jest`?

You could assert some type checks in jest unit tests but there are a couple of reasons why this is a bad idea. Jest executes on source code, whereas we want to test built exported typings files. Jest also asserts runtime checks whereas we want to test with typescript on types directly. This is what TSD is built for.

## Resolving Errors

If any of your assertions fail, they will be printed in the error message like this:

```
[09:30:07.070] failed during step build package useful-types variant


TSD found errors.


  packages/useful-types/test-d/types.test-d.ts:20:0
  ✖  20:0  Argument of type "string" is assignable to parameter of type string.

  1 error

error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
Error: Process completed with exit code 1.
```
