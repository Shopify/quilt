import {expectType, expectAssignable, expectNotAssignable} from 'tsd';

import {ArrayElement} from '../build/ts/types';

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
