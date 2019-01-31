import * as React from 'react';
import {Query, Props as QueryProps} from './Query';

export type Props<T> = Pick<
  QueryProps<T>,
  'query' | 'variables' | 'onError' | 'onCompleted' | 'pollInterval'
> & {ignoreCache?: boolean};

export function Prefetch<T>({ignoreCache, ...props}: Props<T>) {
  const fetchPolicy = ignoreCache ? 'network-only' : undefined;

  return (
    <Query {...props} fetchPolicy={fetchPolicy}>
      {() => null}
    </Query>
  );
}
