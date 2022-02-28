// eslint-disable-next-line import/no-extraneous-dependencies
import {expectAssignable, expectNotAssignable} from 'tsd';

import {ArrayElement} from '../build/ts/types';

/**
 * ArrayElement<T>
 */
expectAssignable<ArrayElement<string[]>>('string');
expectAssignable<ArrayElement<any[]>>(true);
expectAssignable<ArrayElement<(string | boolean)[]>>(false);
expectAssignable<ArrayElement<string>>('string' as never);

expectNotAssignable<ArrayElement<string>>('string' as any);
