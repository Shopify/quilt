import type {IfAllNullableKeys, NoInfer} from '@shopify/useful-types';
import type {OperationVariables} from '@apollo/client';
import type {DocumentNode} from 'graphql-typed';

import type {QueryHookResult, QueryHookOptions} from './hooks';
import {useQuery} from './hooks';

interface QueryComponentOptions<Data, Variables extends OperationVariables>
  extends QueryHookOptions {
  children: (result: QueryHookResult<Data, Variables>) => JSX.Element | null;
  query: DocumentNode<Data, Variables>;
}

export function Query<
  Data extends {} = any,
  Variables extends OperationVariables = OperationVariables,
>({children, query, ...options}: QueryComponentOptions<Data, Variables>) {
  const opts = [options] as IfAllNullableKeys<
    Variables,
    [QueryHookOptions<Data, NoInfer<Variables>>?],
    [QueryHookOptions<Data, NoInfer<Variables>>]
  >;

  const result = useQuery(query, ...opts);

  return children(result);
}
