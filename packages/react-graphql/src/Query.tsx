import {OperationVariables} from 'apollo-client';
import {DocumentNode} from 'graphql-typed';

import {useQuery, QueryHookResult, QueryHookOptions} from './hooks';

interface QueryComponentOptions<Data, Variables> extends QueryHookOptions {
  children: (result: QueryHookResult<Data, Variables>) => JSX.Element | null;
  query: DocumentNode<Data, Variables>;
}

export function Query<Data = any, Variables = OperationVariables>({
  children,
  query,
  ...options
}: QueryComponentOptions<Data, Variables>) {
  const result = useQuery<Data, Variables>(query, options);

  return children(result);
}
