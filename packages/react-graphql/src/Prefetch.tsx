import React from 'react';

import {Query} from './Query';
import {QueryProps} from './types';

export type Props<T> = Pick<
  QueryProps<T>,
  'query' | 'variables' | 'onError' | 'onCompleted' | 'pollInterval'
> & {ignoreCache?: boolean};

export function Prefetch<T extends {}>({ignoreCache, ...props}: Props<T>) {
  const fetchPolicy = ignoreCache ? 'network-only' : undefined;

  return (
    <Query {...props} fetchPolicy={fetchPolicy}>
      {() => null}
    </Query>
  );
}
