import {
  ApolloClient,
  MutationOptions as ClientMutationOptions,
  QueryResult,
  OperationVariables,
  QueryOptions,
  MutationOptions
} from '@apollo/client';
import {ExecutionResult} from 'graphql';
import {Omit, IfAllNullableKeys} from '@shopify/useful-types';
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
  ...optionsPart: IfAllNullableKeys<
    Variables,
    [MutationHookOptions<Data, Variables>?],
    [MutationHookOptions<Data, Variables>]
  >
) => Promise<ExecutionResult<Data>>;
