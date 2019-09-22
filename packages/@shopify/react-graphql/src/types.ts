import React from 'react';
import {
  DocumentNode,
  GraphQLOperation,
  GraphQLData,
  GraphQLVariables,
  GraphQLDeepPartial,
} from 'graphql-typed';
import {QueryResult} from 'react-apollo';
import {
  ErrorPolicy,
  OperationVariables,
  ApolloError,
  ApolloClient,
  WatchQueryFetchPolicy,
} from 'apollo-client';
import {Omit, IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';
import {AsyncComponentType} from '@shopify/react-async';

export {GraphQLData, GraphQLVariables, GraphQLDeepPartial, GraphQLOperation};

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
  context?: Record<string, any>;
  partialRefetch?: boolean;
  onCompleted?: (data: Data | {}) => void;
  onError?: (error: ApolloError) => void;
} & VariableOptions<Variables>;

export interface AsyncQueryComponentType<Data, Variables, DeepPartial>
  extends GraphQLOperation<Data, Variables, DeepPartial>,
    AsyncComponentType<
      DocumentNode<Data, Variables, DeepPartial>,
      Omit<QueryProps<Data, Variables>, 'query'>,
      {},
      VariableOptions<Variables>,
      VariableOptions<Variables> & Pick<QueryProps, 'pollInterval'>
    > {}
