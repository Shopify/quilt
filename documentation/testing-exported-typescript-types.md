# Testing exported TypeScript types

## Setting up tsd tests

We use [jest-runner-tsd](https://github.com/jest-community/jest-runner-tsd) to test TypeScript types. Type test filenames end in `.test-d.ts` (similar to how `.test.ts` is used to denote runtime tests). Create a `test-d` folder in a package and populate it with your `.test-d.ts` test files.

Example:

```
📂 packages
├─ 📂 useful-types
├──── 📂 src (source code)
│     ├── create.ts
│     ├── index.ts
│     └── types.ts
├──── 📂 tests (runtime tests)
│     └── create.test.ts
└──── 📂 test-d (typescript definition tests)
      └── types.test-d.ts
```

Type tests are ran as part of the standard `yarn test` jest execution.

## Useful tests

Assuming you have some source types in `./src/types.ts`

```tsx
export interface Person {
  firstName: string;
}

export type ArrayElement<T> = T extends (infer U)[] ? U : never;
```

and an exported function in `./src/create.ts`

```tsx
import {Person} from './types';

export function createPerson(input?: Person): Person {
  return {
    firstName: input?.firstName ?? 'bob',
  };
}
```

You can test types using [`tsd-lite`](https://github.com/mrazauskas/tsd-lite)'s assertion methods.

Check positive scenarios, that a value of a given type matches or is assignable to your value. Use the most strict assertion possible.

```tsx
import {expectType, expectAssignable} from 'tsd-lite';

import type {ArrayElement, Person} from '../src/types';
import {createPerson} from '../src/create';

// strict checks value type equality
expectType<ArrayElement<Person[]>>(createPerson());

// loose checks value assignable to type
expectAssignable<ArrayElement<string[]>>('foo');
```

Also check that values which do not match your type are not assignable, especially when you include conditional logic in a generic type.

```tsx
import {expectError, expectNotAssignable} from 'tsd-lite';

import type {ArrayElement} from '../src/types';
import {createPerson} from '../src/create';

// string is not a member of an array, so we should not be able to assign anything to it.
expectNotAssignable<ArrayElement<string>>('string');

// createPerson expects an input of Person where firstName is a string. We pass a boolean, hence the expression will have a type error.
expectError(createPerson({firstName: true}));
```

## Why not use `yarn type-check`?

Typechecking quilt source code ensures that there are no type errors in the source code. TSD allows us to assert that types built by quilt packages implement the logical constraints we intend them to. You can test error cases, negative cases, and a range of positive cases. This leads to more resilient types and easier refactoring of types.
