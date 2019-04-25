import ApolloClient from 'apollo-client';
import {
  QueryOpts,
  QueryResult,
  MutationOptions,
  FetchResult,
  OperationVariables,
} from 'react-apollo';
import {Omit} from '@shopify/useful-types';

export interface QueryHookOptions<Variables = OperationVariables>
  extends Omit<QueryOpts<Variables>, 'partialRefetch'> {
  skip?: boolean;
}

export interface QueryHookResult<Data, Variables>
  extends Omit<QueryResult<Data, Variables>, 'networkStatus' | 'variables'> {
  networkStatus: QueryResult<Data, Variables>['networkStatus'] | undefined;
  variables: QueryResult<Data, Variables>['variables'] | undefined;
}

export interface MutationHookOptions<
  Data = any,
  Variables = OperationVariables
> extends MutationOptions<Data, Variables> {
  client?: ApolloClient<object>;
}

export type MutationHookResult<Data, Variables> = (
  options?: MutationOptions<Data, Variables>,
) => Promise<FetchResult<Data>>;
