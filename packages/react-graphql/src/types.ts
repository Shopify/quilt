import React from 'react';
import {
  DocumentNode,
  GraphQLOperation,
  GraphQLData,
  GraphQLVariables,
  GraphQLDeepPartial,
} from 'graphql-typed';
import {
  QueryResult,
  ErrorPolicy,
  OperationVariables,
  ApolloError,
  ApolloClient,
  WatchQueryFetchPolicy,
  NetworkStatus,
} from '@apollo/client';
import {IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';
import {AsyncComponentType, AsyncHookTarget} from '@shopify/react-async';

import {QueryHookOptions} from './hooks';

export type {
  GraphQLData,
  GraphQLVariables,
  GraphQLDeepPartial,
  GraphQLOperation,
  NetworkStatus,
};

export type VariableOptions<Variables> = IfEmptyObject<
  Variables,
  {variables?: never},
  IfAllNullableKeys<Variables, {variables?: Variables}, {variables: Variables}>
>;

export type QueryProps<Data = any, Variables = OperationVariables> = {
  children: (result: QueryResult<Data, Variables>) => React.ReactNode;
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

export interface AsyncDocumentNode<Data, Variables, DeepPartial>
  extends GraphQLOperation<Data, Variables, DeepPartial>,
    AsyncHookTarget<
      DocumentNode<Data, Variables, DeepPartial>,
      {},
      VariableOptions<Variables>,
      VariableOptions<Variables> &
        Pick<QueryProps<Data, Variables>, 'pollInterval'>
    > {}

export interface AsyncQueryComponentType<Data, Variables, DeepPartial>
  extends GraphQLOperation<Data, Variables, DeepPartial>,
    AsyncComponentType<
      DocumentNode<Data, Variables, DeepPartial>,
      QueryHookOptions<Data, Variables> &
        Pick<QueryProps<Data, Variables>, 'children'>,
      {},
      VariableOptions<Variables>,
      VariableOptions<Variables> &
        Pick<QueryProps<Data, Variables>, 'pollInterval'>
    > {}
