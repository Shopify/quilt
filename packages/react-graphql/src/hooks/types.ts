import {
  ApolloClient,
  MutationOptions as ClientMutationOptions,
  QueryResult,
  FetchResult,
  MutationOptions,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
  WatchQueryFetchPolicy,
} from '@apollo/client';
import {IfAllNullableKeys} from '@shopify/useful-types';

import {VariableOptions} from '../types';

export type QueryHookOptions<Data = any, Variables = OperationVariables> = Omit<
  QueryOptions<Data, Variables>,
  'query' | 'partialRefetch' | 'variables' | 'fetchPolicy'
> &
  VariableOptions<Variables> & {
    client?: ApolloClient<NormalizedCacheObject>;
    fetchPolicy?: WatchQueryFetchPolicy;
    skip?: boolean;
    ssr?: boolean;
  };

export interface QueryHookResult<Data, Variables>
  extends Omit<
    QueryResult<Data, Variables>,
    'networkStatus' | 'variables' | 'called'
  > {
  networkStatus: QueryResult<Data, Variables>['networkStatus'] | undefined;
  variables: QueryResult<Data, Variables>['variables'] | undefined;
  called: QueryResult<Data, Variables>['called'] | false;
}

export type MutationHookOptions<
  Data = any,
  Variables = OperationVariables
> = Omit<
  MutationOptions<Data, Variables>,
  'variables' | 'mutation' | 'fetchPolicy'
> &
  VariableOptions<Variables> &
  Pick<ClientMutationOptions<Data, Variables>, 'fetchPolicy'> & {
    client?: ApolloClient<object>;
  };

export type MutationHookResult<Data, Variables> = (
  ...optionsPart: IfAllNullableKeys<
    Variables,
    [MutationHookOptions<Data, Variables>?],
    [MutationHookOptions<Data, Variables>]
  >
) => Promise<FetchResult<Data>>;
