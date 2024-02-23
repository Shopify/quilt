import {describe, it, expect} from 'tstyche';

import type {
  ArrayElement,
  DeepPartial,
  IfEmptyObject,
  DeepOmit,
  DeepReadonly,
} from '../src/types';

describe('ArrayElement', () => {
  it('infers the array element type', () => {
    interface Person {
      firstName: string;
    }

    expect<ArrayElement<Person[]>>().type.toEqual<{firstName: string}>();
    expect<ArrayElement<string[]>>().type.toBeString();
    expect<ArrayElement<any[]>>().type.toBeAny();
    expect<ArrayElement<(string | boolean)[]>>().type.toEqual<
      string | boolean
    >();
  });

  it('when `T` is not an array, resolves to the `never` type', () => {
    expect<ArrayElement<string>>().type.toBeNever();
  });
});

describe('DeepPartial', () => {
  interface Base {
    required: string;
    optional?: string;
    nested?: Base;
  }

  it('marks properties as optional recursively', () => {
    expect<DeepPartial<Base>>().type.toMatch<{}>();
    expect<DeepPartial<Base>>().type.toMatch<{optional?: string}>();
    expect<DeepPartial<Base>>().type.toMatch<{required?: string}>();
    expect<DeepPartial<Base>>().type.toMatch<{
      nested?: {nested?: {nested?: {required?: string | undefined}}};
    }>();
  });

  it('handles arrays', () => {
    interface ListObj {
      list: Base[];
    }

    expect<DeepPartial<ListObj>>().type.toMatch<{list?: {}[] | undefined}>();
    expect<DeepPartial<ListObj>>().type.toMatch<{
      list?: {nested?: {required?: string | undefined}}[];
    }>();
  });

  it('handles readonly arrays', () => {
    interface ReadOnlyListObj {
      list: ReadonlyArray<Base>;
    }
    expect<DeepPartial<ReadOnlyListObj>>().type.toMatch<{
      list?: ReadonlyArray<{}> | undefined;
    }>();
  });

  it('returns primitives unaltered', () => {
    expect<DeepPartial<string>>().type.toBeString();
  });

  it('respects array elements', () => {
    interface RespectArrayElements {
      list: (string | number)[] | null;
    }

    expect<DeepPartial<RespectArrayElements>>().type.toEqual<{
      list?: (string | number)[] | null;
    }>();
  });

  it('handles readonly objects', () => {
    type PresetOption = Readonly<{
      name?: string;
      id: string;
    }>;

    type Preset = Readonly<{
      options: ReadonlyArray<PresetOption>;
      editableOptions: PresetOption[];
    }>;

    type PresetState = Readonly<{
      list?: ReadonlyArray<Preset>;
    }>;
    type State = Readonly<{
      preset: PresetState;
    }>;

    expect<DeepPartial<State>>().type.toMatch<{}>();

    expect<DeepPartial<State>>().type.toMatch<{
      readonly preset?: {
        readonly list?: ReadonlyArray<{
          readonly options?: ReadonlyArray<{readonly name?: string}>;
        }>;
      };
    }>();

    expect<DeepPartial<State>>().type.toMatch<{
      readonly preset?: {} | undefined;
    }>();

    expect<DeepPartial<State>>().type.toMatch<{
      readonly preset?: {
        readonly list?: ReadonlyArray<{}> | undefined;
      };
    }>();

    expect<DeepPartial<State>>().type.toMatch<{
      readonly preset?: {
        readonly list?: ReadonlyArray<{
          readonly options?: ReadonlyArray<{}> | undefined;
        }>;
      };
    }>();

    expect<DeepPartial<State>>().type.toMatch<{
      readonly preset?: {
        readonly list?: ReadonlyArray<{
          readonly editableOptions?: {}[] | undefined;
        }>;
      };
    }>();
  });
});

describe('IfEmptyObject', () => {
  it('checks if an object is empty', () => {
    expect<IfEmptyObject<{}, true>>().type.toEqual<true>();
    expect<IfEmptyObject<{foo: string}, never, false>>().type.toEqual<false>();

    expect<IfEmptyObject<{foo: string}, true>>().type.not.toEqual<true>();
    expect<IfEmptyObject<boolean, true>>().type.not.toEqual<true>();
  });
});

describe.todo('IfAllOptionalKeys');

describe.todo('IfAllNullableKeys');

describe.todo('NonOptionalKeys');

describe.todo('NonNullableKeys');

describe.todo('NoInfer');

describe.todo('NonReactStatics');

describe.todo('ExtendedWindow');

describe('DeepOmit', () => {
  it('returns primitives unaltered', () => {
    expect<DeepOmit<string, '__typename'>>().type.toBeString();
    expect<DeepOmit<string, string>>().type.toBeString();
    expect<DeepOmit<() => void, 'toString'>>().type.toEqual<() => void>();
    expect<DeepOmit<number, 'toString'>>().type.toBeNumber();
    expect<DeepOmit<boolean, 'valueOf'>>().type.toBeBoolean();
    expect<DeepOmit<undefined, 'toString'>>().type.toBeUndefined();
    expect<DeepOmit<null, 'toString'>>().type.toBeNull();
    expect<DeepOmit<symbol, 'toString'>>().type.toBeSymbol();
  });

  it('does not omit on primitive types', () => {
    const sample: DeepOmit<number, 'toString'> = Number(2);

    expect<typeof sample.toString>().type.toEqual<(radix?: number) => string>();
    expect<DeepOmit<string, 'string'>>().type.not.toBeNever();
  });

  it('does not omit on primitive union types', () => {
    expect<DeepOmit<string | number, 'toString'>>().type.toEqual<
      string | number
    >();
  });

  it('omits key at any level of nesting', () => {
    interface Obj {
      __typename: string;
      foo: string;
      bar: {
        __typename: string;
        baz: string;
      };
    }

    expect<DeepOmit<Obj, '__typename'>>().type.toEqual<{
      foo: string;
      bar: {
        baz: string;
      };
    }>();

    expect<DeepOmit<Obj, 'baz'>>().type.toEqual<{
      __typename: string;
      foo: string;
      bar: {
        __typename: string;
      };
    }>();
  });

  it('handles arrays', () => {
    type NullableUnionArray = DeepOmit<
      {bar: (string | number)[] | null; __typename: string},
      '__typename'
    >;

    expect<NullableUnionArray>().type.toEqual<{
      bar: (string | number)[] | null;
    }>();
  });

  it('handles readonly arrays', () => {
    interface Node {
      __typename: 'string';
      title: string;
    }

    type ReadOnlyNullableUnionArray = DeepOmit<
      {bar: ReadonlyArray<Node>; __typename: string},
      '__typename'
    >;

    expect<ReadOnlyNullableUnionArray>().type.toEqual<{
      bar: ReadonlyArray<{title: string}>;
    }>();
  });

  it('respects optional properties', () => {
    interface RespectOptionalProps {
      __typename: string;
      foo: string;
      bar?: {
        __typename: string;
        baz: number;
      };
    }

    expect<DeepOmit<RespectOptionalProps, '__typename'>>().type.toEqual<{
      foo: string;
      bar?: {
        baz: number;
      };
    }>();
  });
});

describe.todo('DeepOmitArray');

describe.todo('PartialSome');

describe.todo('RequireSome');

describe('DeepReadonly', () => {
  it('marks properties as readonly recursively', () => {
    interface ObjectInterface {
      prop?: string;
      innerObj?: {
        prop: string;
      };
      array?: string[];
      map?: Map<string, string>;
      set?: Set<string>;
    }

    expect<DeepReadonly<ObjectInterface>>().type.toMatch<{
      readonly prop?: string | undefined;
    }>();

    expect<DeepReadonly<ObjectInterface>>().type.toMatch<{
      readonly innerObj?: {readonly prop: string} | undefined;
    }>();

    expect<DeepReadonly<ObjectInterface>>().type.toMatch<{
      readonly array?: ReadonlyArray<string> | undefined;
    }>();

    expect<DeepReadonly<ObjectInterface>>().type.toMatch<{
      readonly map?: ReadonlyMap<string, string> | undefined;
    }>();

    expect<DeepReadonly<ObjectInterface>>().type.toMatch<{
      readonly set?: ReadonlySet<string> | undefined;
    }>();
  });
});
