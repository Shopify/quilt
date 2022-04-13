import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectNotType,
} from 'tsd';

import {
  ArrayElement,
  DeepPartial,
  IfEmptyObject,
  DeepOmit,
} from '../build/ts/types';

interface Person {
  firstName: string;
}

/**
 * ArrayElement<T>
 */

expectType<ArrayElement<Person[]>>({firstName: 'foo'});

expectAssignable<ArrayElement<string[]>>('string');
expectAssignable<ArrayElement<any[]>>(true);
expectAssignable<ArrayElement<(string | boolean)[]>>(false);
expectAssignable<ArrayElement<string>>('string' as never);

expectNotAssignable<ArrayElement<string>>('string');

/**
 * DeepPartial<T>
 */

interface Base {
  required: string;
  optional?: string;
  nested?: Base;
}

expectAssignable<DeepPartial<Base>>({});
expectAssignable<DeepPartial<Base>>({optional: 'test'});
expectAssignable<DeepPartial<Base>>({required: undefined});
expectAssignable<DeepPartial<Base>>({
  nested: {nested: {nested: {required: 'test'}}},
});

interface ListObj {
  list: Base[];
}

expectAssignable<DeepPartial<ListObj>>({list: []});
expectAssignable<DeepPartial<ListObj>>({list: undefined});
expectAssignable<DeepPartial<ListObj>>({
  list: [{nested: {required: undefined}}],
});

interface ReadOnlyListObj {
  list: ReadonlyArray<Base>;
}

expectAssignable<DeepPartial<ReadOnlyListObj>>({list: []});
expectAssignable<DeepPartial<ReadOnlyListObj>>({list: undefined});

expectAssignable<DeepPartial<ReadOnlyListObj>>({
  list: [{}],
});

expectNotAssignable<DeepPartial<ReadOnlyListObj>>({
  list: [undefined],
});

expectAssignable<DeepPartial<string>>('test');

interface RespectArrayElements {
  list: (string | number)[] | null;
}

/**
 * valid types ar null or any array with string, number, or both
 */
expectAssignable<DeepPartial<RespectArrayElements>>({list: null});
expectAssignable<DeepPartial<RespectArrayElements>>({list: []});
expectAssignable<DeepPartial<RespectArrayElements>>({list: ['string']});
expectAssignable<DeepPartial<RespectArrayElements>>({list: [2]});
expectAssignable<DeepPartial<RespectArrayElements>>({list: ['string', 2]});

/**
 * handles ReadOnly objects
 */

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

expectAssignable<DeepPartial<State>>({});
expectAssignable<DeepPartial<State>>({
  preset: {
    list: [{options: [{name: 'string'}]}],
  },
});
expectAssignable<DeepPartial<State>>({
  preset: undefined,
});

expectNotAssignable<DeepPartial<State>>({
  preset: {
    list: [undefined],
  },
});

expectNotAssignable<DeepPartial<State>>({
  preset: {
    list: [{options: [undefined]}],
  },
});
expectNotAssignable<DeepPartial<State>>({
  preset: {
    list: [{editableOptions: [undefined]}],
  },
});

/**
 * should not be able to add undefined, need to fix this
 */
expectNotAssignable<DeepPartial<RespectArrayElements>>({
  // this should error, undefined is not a valid type for list
  list: [undefined, 'stable', 2],
});

/**
 * IfEmptyObject<T>
 */

expectType<IfEmptyObject<{}, true>>(true);
expectType<IfEmptyObject<{foo: string}, never, false>>(false);

expectNotType<IfEmptyObject<{foo: string}, true>>(true);
expectNotType<IfEmptyObject<boolean, true>>(true);

/**
 * IfAllOptionalKeys
 */

/**
 * IfAllNullableKeys
 */

/**
 * NonOptionalKeys
 */

/**
 * NonNullableKeys
 */

/**
 * NoInfer
 */

/**
 * NonReactStatics
 */

/**
 * ExtendedWindow
 */

/**
 * DeepOmit
 */

/**
 * should return primitives unaltered
 */
expectAssignable<DeepOmit<string, '__typename'>>('string');
expectAssignable<DeepOmit<string, string>>('string');
expectAssignable<DeepOmit<() => void, 'toString'>>(() => {});
expectAssignable<DeepOmit<number, 'toString'>>(2);
expectAssignable<DeepOmit<boolean, 'valueOf'>>(Boolean(0));
expectAssignable<DeepOmit<undefined, 'toString'>>(undefined);
expectAssignable<DeepOmit<null, 'toString'>>(null);
expectAssignable<DeepOmit<Symbol, 'toString'>>(Symbol('string'));

/**
 * does not omit on primitive types
 */
const test: DeepOmit<number, 'toString'> = Number(2);
expectType<typeof test.toString>((_radix?: number) => '');

expectNotAssignable<DeepOmit<string, 'string'>>(undefined);

interface Obj {
  __typename: string;
  foo: string;
  bar: {
    __typename: string;
    baz: string;
  };
}

/**
 * should omit key at any level of nesting
 * will recurse on {__typename: string; baz: string;}
 * should omit __typename
 */
expectAssignable<DeepOmit<Obj, '__typename'>>({
  foo: 'string',
  bar: {
    baz: 'string',
  },
});

expectAssignable<DeepOmit<Obj, 'baz'>>({
  __typename: 'string',
  foo: 'string',
  bar: {
    __typename: 'string',
  },
});

expectNotAssignable<DeepOmit<Obj, '__typename'>>({
  __typename: 'string',
});

/**
 * DeepOmit<Obj>
 * will recurse on {__typename: string; baz: string;}
 * should omit __typename
 */

expectNotAssignable<DeepOmit<Obj, '__typename'>>({
  __typename: 'string',
  foo: 'string',
  bar: {
    baz: 'string',
  },
});

expectNotAssignable<DeepOmit<Obj, '__typename'>>({
  foo: 'string',
  bar: {
    __typename: 'string',
    baz: 'string',
  },
});

type NullableUnionArray = DeepOmit<
  {bar: (string | number)[] | null; __typename: string},
  '__typename'
>;

/**
 * will recurse on (string | number)[] | null
 * we want to allow null
 */
expectAssignable<NullableUnionArray>({bar: null});

/**
 * will recurse on (string | number)[] | null
 * we want to allow empty or valid arrays
 */
expectAssignable<NullableUnionArray>({bar: []});
expectAssignable<NullableUnionArray>({bar: ['string']});
expectAssignable<NullableUnionArray>({bar: [2]});
expectAssignable<NullableUnionArray>({bar: ['string', 2]});

/**
 * should not allow invalid array elements
 */
expectNotAssignable<NullableUnionArray>({bar: [undefined]});
expectNotAssignable<NullableUnionArray>({bar: [null]});

expectNotAssignable<NullableUnionArray>({bar: undefined});

/**
 * handles readonly arrays
 */

interface Node {
  __typename: 'string';
  title: string;
}

type ReadOnlyNullableUnionArray = DeepOmit<
  {bar: ReadonlyArray<Node>; __typename: string},
  '__typename'
>;

expectNotAssignable<ReadOnlyNullableUnionArray>({
  bar: [undefined],
});
expectNotAssignable<ReadOnlyNullableUnionArray>({
  bar: [{__typename: 'string'}],
});

/**
 * DeepOmit of type {bar: (string| number)[]}
 * will recurse on (string | number)[]
 * will recurse on (string| number)
 * we want to allow string or number
 */
expectAssignable<DeepOmit<string | number, 'toString'>>('string');
expectAssignable<DeepOmit<string | number, 'toString'>>(2);
expectNotAssignable<DeepOmit<string | number, 'toString'>>(null);
expectNotAssignable<DeepOmit<string | number, 'toString'>>(undefined);

interface RespectOptionalProps {
  __typename: string;
  foo: string;
  bar?: {
    __typename: string;
    baz: number;
  };
}

/**
 * respects optional bar
 */
expectAssignable<DeepOmit<RespectOptionalProps, '__typename'>>({
  foo: 'string',
});

expectAssignable<DeepOmit<RespectOptionalProps, '__typename'>>({
  foo: 'string',
  bar: undefined,
});

expectNotAssignable<DeepOmit<RespectOptionalProps, '__typename'>>({
  __typename: 'string',
  foo: 'string',
});

/**
 * DeepOmitArray
 */

/**
 * PartialSome
 */

/**
 * RequireSome
 */
