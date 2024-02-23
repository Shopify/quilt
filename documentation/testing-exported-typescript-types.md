# Testing exported TypeScript types

We use [`tstyche`](https://github.com/tstyche/tstyche) to test TypeScript types. Visit [https://tstyche.org](https://tstyche.org) to view the full documentation of the tool.

## Setting up type tests

Type test filenames have the `.tst.*` suffix, similar to how `.test.*` is used to denote runtime tests. Differently from the functional tests, the type test files are only statically analyzed by the TypeScript compiler, but not executed (hence the missing `e` in the suffix).

To create a type test project in a package, add a `typetests` folder with `tsconfig.json` file and populate it with your `.tst.ts` test files:

```
📂 packages
├─ 📂 useful-types
├──── 📂 src (source code)
│     ├── create.ts
│     ├── index.ts
│     └── types.ts
├──── 📂 tests (runtime tests)
│     └── create.test.ts
└──── 📂 typetests (type tests)
│     ├── create.tst.ts
│     └── tsconfig.json
```

The TSConfig file will be used by a code editor and TSTyche. It can extend the `tsconfig.base.json` file:

```json
{
  "extends": "../../../config/typescript/tsconfig.base.json",
  "compilerOptions": {
    "emitDeclarationOnly": false,
    "strict": true,
    "types": []
  },
  "references": [{"path": ".."}]
}
```

To run the type tests, use the `yarn test:types` command.

## Useful tests

TSTyche compares types using the familiar `expect` style assertions (to learn more, see: [https://tstyche.org/reference/expect-api](https://tstyche.org/reference/expect-api)).

For example, here is how the `ArrayElement` utility type is tested:

```ts
import {describe, it, expect} from 'tstyche';

import type {ArrayElement} from '../src/types';

describe('ArrayElement', () => {
  it('infers the array element type', () => {
    expect<ArrayElement<(string | boolean)[]>>().type.toEqual<
      string | boolean
    >();

    expect<ArrayElement<string[]>>().type.toBeString();
    expect<ArrayElement<any[]>>().type.toBeAny();
  });

  it('when `T` is not an array, resolves to the `never` type', () => {
    expect<ArrayElement<string>>().type.toBeNever();
  });
});
```

If the resulting type is more complex, the `.toMatch()` matcher can be helpful to test partial match:

```ts
import {describe, it, expect} from 'tstyche';

import type {DeepReadonly} from '../src/types';

describe('DeepReadonly', () => {
  interface Person {
    firstName: string;
    lastName?: string | undefined;
  }

  it('marks the properties as readonly recursively', () => {
    expect<DeepReadonly<Person>>().type.toMatch<{
      readonly firstName: string;
    }>();

    expect<DeepReadonly<Person>>().type.toMatch<{
      readonly lastName?: string | undefined;
    }>();
  });
});
```

If a generic type has conditional logic, remember to cover all the branches. You can negate the condition by prepend `.not` before a matcher:

```ts
import {describe, it, expect} from 'tstyche';

import type {IfEmptyObject} from '../src/types';

describe('IfEmptyObject', () => {
  it('checks if an object is empty', () => {
    expect<IfEmptyObject<{}, true>>().type.toEqual<true>();
    expect<IfEmptyObject<{foo: string}, never, false>>().type.toEqual<false>();

    expect<IfEmptyObject<{foo: string}, true>>().type.not.toEqual<true>();
    expect<IfEmptyObject<boolean, true>>().type.not.toEqual<true>();
  });
});
```

## Why not use `yarn type-check`?

Typechecking quilt source code ensures that there are no type errors in the source code. TSTyche allows us to assert that types built by quilt packages implement the logical constraints we intend them to. You can test error cases, negative cases, and a range of positive cases. This leads to more resilient types and easier refactoring.
