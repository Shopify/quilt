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
import {VariableOptions} from '../types';

export type QueryHookOptions<Data = any, Variables = OperationVariables> = Omit<
  QueryOptions<Data, Variables>,
  'query' | 'partialRefetch' | 'children' | 'variables'
> &
  VariableOptions<Variables> & {
    skip?: boolean;
  };

export interface QueryHookResult<Data, Variables>
  extends Omit<QueryResult<Data, Variables>, 'networkStatus' | 'variables'> {
  networkStatus: QueryResult<Data, Variables>['networkStatus'] | undefined;
  variables: QueryResult<Data, Variables>['variables'] | undefined;
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
  options?: Omit<MutationOptions<Data, Variables>, 'mutation' | 'fetchPolicy'> &
    Pick<ClientMutationOptions, 'fetchPolicy'>,
) => Promise<ExecutionResult<Data>>;
