import type {ReactNode} from 'react';
import type {
  DocumentNode,
  GraphQLOperation,
  GraphQLData,
  GraphQLVariables,
  GraphQLDeepPartial,
} from 'graphql-typed';
import type {
  QueryResult,
  ErrorPolicy,
  OperationVariables,
  ApolloError,
  ApolloClient,
  WatchQueryFetchPolicy,
} from '@apollo/client';
import type {IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';
import type {AsyncComponentType, AsyncHookTarget} from '@shopify/react-async';

import type {QueryHookOptions} from './hooks';

export type {
  GraphQLData,
  GraphQLVariables,
  GraphQLDeepPartial,
  GraphQLOperation,
};

export type VariableOptions<Variables> = IfEmptyObject<
  Variables,
  {variables?: never},
  IfAllNullableKeys<Variables, {variables?: Variables}, {variables: Variables}>
>;

export type QueryProps<
  Data = any,
  Variables extends OperationVariables = OperationVariables,
> = {
  children: (result: QueryResult<Data, Variables>) => ReactNode;
  fetchPolicy?: WatchQueryFetchPolicy;
  errorPolicy?: ErrorPolicy;
  notifyOnNetworkStatusChange?: boolean;
  pollInterval?: number;
  query: DocumentNode<Data, Variables>;
  ssr?: boolean;
  displayName?: string;
  skip?: boolean;
  client?: ApolloClient<object>;
  context?: {[key: string]: any};
  partialRefetch?: boolean;
  onCompleted?: (data: Data | {}) => void;
  onError?: (error: ApolloError) => void;
} & VariableOptions<Variables>;

export interface AsyncDocumentNode<
  Data,
  Variables extends OperationVariables,
  DeepPartial,
> extends GraphQLOperation<Data, Variables, DeepPartial>,
    AsyncHookTarget<
      DocumentNode<Data, Variables, DeepPartial>,
      {},
      VariableOptions<Variables>,
      VariableOptions<Variables> &
        Pick<QueryProps<Data, Variables>, 'pollInterval'>
    > {}

export interface AsyncQueryComponentType<
  Data,
  Variables extends OperationVariables,
  DeepPartial,
> extends GraphQLOperation<Data, Variables, DeepPartial>,
    AsyncComponentType<
      DocumentNode<Data, Variables, DeepPartial>,
      QueryHookOptions<Data, Variables> &
        Pick<QueryProps<Data, Variables>, 'children'>,
      {},
      VariableOptions<Variables>,
      VariableOptions<Variables> &
        Pick<QueryProps<Data, Variables>, 'pollInterval'>
    > {}
