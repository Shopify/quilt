import {
  ApolloClient,
  MutationOptions as ClientMutationOptions,
} from 'apollo-client';
import {
  QueryOptions,
  QueryResult,
  MutationOptions,
  ExecutionResult,
  OperationVariables,
} from 'react-apollo';
import {Omit} from '@shopify/useful-types';

export interface QueryHookOptions<Variables = OperationVariables>
  extends Omit<QueryOptions<Variables>, 'partialRefetch'> {
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
  options?: Omit<MutationOptions<Data, Variables>, 'mutation' | 'fetchPolicy'> &
    Pick<ClientMutationOptions, 'fetchPolicy'>,
) => Promise<ExecutionResult<Data>>;
