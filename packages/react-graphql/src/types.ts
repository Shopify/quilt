import * as React from 'react';
import {DocumentNode} from 'graphql-typed';
import {QueryResult} from 'react-apollo';
import {
  FetchPolicy,
  ErrorPolicy,
  OperationVariables,
  ApolloError,
  ApolloClient,
} from 'apollo-client';
import {Omit, IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';

export type VariableOptions<Variables> = IfEmptyObject<
  Variables,
  {variables?: never},
  IfAllNullableKeys<Variables, {variables?: Variables}, {variables: Variables}>
>;

export type QueryProps<Data = any, Variables = OperationVariables> = {
  children: (result: QueryResult<Data, Variables>) => React.ReactNode;
  fetchPolicy?: FetchPolicy;
  errorPolicy?: ErrorPolicy;
  notifyOnNetworkStatusChange?: boolean;
  pollInterval?: number;
  query: DocumentNode<Data, Variables>;
  ssr?: boolean;
  displayName?: string;
  skip?: boolean;
  client?: ApolloClient<Object>;
  context?: Record<string, any>;
  partialRefetch?: boolean;
  onCompleted?: (data: Data | {}) => void;
  onError?: (error: ApolloError) => void;
} & VariableOptions<Variables>;

export interface AsyncQueryComponentType<Data, Variables> {
  (props: Omit<QueryProps<Data, Variables>, 'query'>): React.ReactElement<{}>;
  Prefetch(props: VariableOptions<Variables>): React.ReactElement<{}>;
  Preload(): React.ReactElement<{}>;
  KeepFresh(
    props: VariableOptions<Variables> & {pollInterval?: number},
  ): React.ReactElement<{}>;
}

export type GraphQLData<T> = T extends DocumentNode<infer Data, any>
  ? Data
  : T extends AsyncQueryComponentType<infer Data, any> ? Data : never;

export type GraphQLVariables<T> = T extends DocumentNode<any, infer Variables>
  ? Variables
  : T extends AsyncQueryComponentType<any, infer Variables> ? Variables : never;
