import {DocumentNode} from 'graphql-typed';

import * as React from 'react';
import {Query as ApolloQuery, QueryResult} from 'react-apollo';
import {
  FetchPolicy,
  ErrorPolicy,
  OperationVariables,
  ApolloError,
  ApolloClient,
} from 'apollo-client';
import {IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';

export type Props<Data = any, Variables = OperationVariables> = {
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
} & IfEmptyObject<
  Variables,
  {variables?: never},
  IfAllNullableKeys<Variables, {variables?: Variables}, {variables: Variables}>
>;

// eslint-disable-next-line react/prefer-stateless-function
class QueryTypeClass<
  Data = any,
  Variables = OperationVariables
> extends React.Component<Props<Data, Variables>> {}

export const Query: typeof QueryTypeClass = ApolloQuery as any;
