import * as React from 'react';
import {
  DocumentNode,
  GraphQLOperation,
  GraphQLData,
  GraphQLVariables,
  GraphQLDeepPartial,
} from 'graphql-typed';
import {QueryResult} from 'react-apollo';
import {
  FetchPolicy,
  ErrorPolicy,
  OperationVariables,
  ApolloError,
  ApolloClient,
} from 'apollo-client';
import {Omit, IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';
import {AsyncPropsRuntime} from '@shopify/react-async';

export {GraphQLData, GraphQLVariables, GraphQLDeepPartial, GraphQLOperation};

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
  client?: ApolloClient<object>;
  context?: Record<string, any>;
  partialRefetch?: boolean;
  onCompleted?: (data: Data | {}) => void;
  onError?: (error: ApolloError) => void;
} & VariableOptions<Variables>;

export interface ConstantProps {
  async?: AsyncPropsRuntime;
}

export interface AsyncQueryComponentType<Data, Variables, DeepPartial>
  extends GraphQLOperation<Data, Variables, DeepPartial> {
  (
    props: Omit<QueryProps<Data, Variables>, 'query'> & ConstantProps,
  ): React.ReactElement<{}>;
  Prefetch(
    props: VariableOptions<Variables> & ConstantProps,
  ): React.ReactElement<{}>;
  Preload(props: ConstantProps): React.ReactElement<{}>;
  KeepFresh(
    props: VariableOptions<Variables> & {pollInterval?: number} & ConstantProps,
  ): React.ReactElement<{}>;
  resolve(): Promise<DocumentNode<Data, Variables, DeepPartial>>;
  resolved: DocumentNode<Data, Variables, DeepPartial> | null;
}
