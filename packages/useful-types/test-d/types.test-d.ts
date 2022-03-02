import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectNotType,
} from 'tsd';

import {ArrayElement, DeepPartial, IfEmptyObject} from '../build/ts/types';

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

expectAssignable<DeepPartial<string>>('test');

/**
 * IfEmptyObject<T>
 */

expectType<IfEmptyObject<{}, true>>(true);
expectType<IfEmptyObject<{foo: string}, never, false>>(false);

expectNotType<IfEmptyObject<{foo: string}, true>>(true);
expectNotType<IfEmptyObject<boolean, true>>(true);
