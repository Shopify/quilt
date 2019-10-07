/* eslint react-hooks/rules-of-hooks: off */

import {useEffect, useMemo, useState, useRef} from 'react';
import {
  ApolloClient,
  OperationVariables,
  ApolloError,
  WatchQueryOptions,
  ObservableQuery,
} from 'apollo-client';
import {DocumentNode} from 'graphql-typed';
import {useServerEffect} from '@shopify/react-effect';

import {AsyncQueryComponentType} from '../types';
import {QueryHookOptions, QueryHookResult} from './types';
import useApolloClient from './apollo-client';
import useGraphQLDocument from './graphql-document';

export default function useQuery<
  Data = any,
  Variables = OperationVariables,
  DeepPartial = {}
>(
  queryOrComponent:
    | DocumentNode<Data, Variables>
    | AsyncQueryComponentType<Data, Variables, DeepPartial>,
  options: Omit<QueryHookOptions<Variables>, 'query'> = {},
): QueryHookResult<Data, Variables> {
  const {
    skip = false,
    fetchPolicy,
    errorPolicy,
    pollInterval,
    client: overrideClient,
    notifyOnNetworkStatusChange,
    context,
    ssr = true,
  } = options;

  // This type gets inferred as Record<string, any> which causes
  // lots of issues with stronger type checks elsewhere in the hook.
  const variables: Variables = options.variables as any;
  const client = useApolloClient(overrideClient);

  if (
    typeof window === 'undefined' &&
    (skip || fetchPolicy === 'no-cache' || !ssr)
  ) {
    return createDefaultResult(client, variables);
  }

  const query = useGraphQLDocument(queryOrComponent);

  const normalizedFetchPolicy =
    typeof window === 'undefined' &&
    (fetchPolicy === 'network-only' || fetchPolicy === 'cache-and-network')
      ? 'cache-first'
      : fetchPolicy;
  const serializedVariables = variables && JSON.stringify(variables);
  const watchQueryOptions = useMemo<WatchQueryOptions<Variables> | null>(
    () => {
      if (!query) {
        return null;
      }

      return {
        query,
        context,
        variables,
        fetchPolicy: normalizedFetchPolicy,
        errorPolicy,
        pollInterval,
        notifyOnNetworkStatusChange,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      query,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      context && JSON.stringify(context),
      serializedVariables,
      normalizedFetchPolicy,
      errorPolicy,
      pollInterval,
      notifyOnNetworkStatusChange,
    ],
  );

  const queryObservable = useMemo(
    () => {
      if (skip || !watchQueryOptions) {
        return;
      }

      return client.watchQuery(watchQueryOptions);
    },
    [client, skip, watchQueryOptions],
  );

  useServerEffect(() => {
    if (queryObservable == null) {
      return;
    }

    const result = queryObservable.getCurrentResult();
    return result.loading ? queryObservable.result() : undefined;
  });

  const defaultResult = useMemo<QueryHookResult<Data, Variables>>(
    () => createDefaultResult(client, variables, queryObservable),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryObservable, client, serializedVariables],
  );

  const [responseId, setResponseId] = useState(0);

  useEffect(
    () => {
      if (skip || !queryObservable) {
        return;
      }

      const invalidateCurrentResult = () => {
        setResponseId(x => x + 1);
      };
      const subscription = queryObservable.subscribe(
        invalidateCurrentResult,
        invalidateCurrentResult,
      );

      return () => {
        subscription.unsubscribe();
      };
    },
    [skip, queryObservable],
  );

  const previousData = useRef<QueryHookResult<Data, Variables>['data']>(
    undefined,
  );

  const currentResult = useMemo<QueryHookResult<Data, Variables>>(
    () => {
      // must of the logic below are lifted from
      // https://github.com/apollographql/react-apollo/blob/22f8ebf52b26b348d6be905d5b7fbbfea51c1541/src/Query.tsx#L410-L477
      if (skip) {
        return defaultResult;
      }

      if (!queryObservable) {
        return {
          ...defaultResult,
          // while documentNode is loading
          loading: true,
        };
      }

      const result = queryObservable.getCurrentResult();
      const {fetchPolicy} = queryObservable.options;

      const hasError = result.errors && result.errors.length > 0;
      let data: QueryHookResult<Data, Variables>['data'] = result.data;
      if (result.loading) {
        data =
          previousData.current || (result && result.data)
            ? {
                ...(previousData.current || {}),
                ...((result && result.data) || {}),
              }
            : undefined;
      } else if (hasError) {
        data = (queryObservable.getLastResult() || {}).data;
      } else if (
        fetchPolicy === 'no-cache' &&
        Object.keys(result.data).length === 0
      ) {
        data = previousData.current;
      } else {
        previousData.current = result.data;
      }

      return {
        ...defaultResult,
        data,
        error: hasError
          ? new ApolloError({graphQLErrors: result.errors})
          : result.error,
        networkStatus: result.networkStatus,
        loading: result.loading,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [responseId, skip, queryObservable, defaultResult, previousData],
  );

  return currentResult;
}

function createDefaultResult<Variables>(
  client: ApolloClient<unknown>,
  variables: Variables,
  queryObservable?: ObservableQuery,
): QueryHookResult<any, Variables> {
  return {
    data: undefined,
    error: undefined,
    networkStatus: undefined,
    loading: false,
    called: false,
    variables: (queryObservable ? queryObservable.variables : variables) as any,
    refetch: queryObservable
      ? queryObservable.refetch.bind(queryObservable)
      : noop,
    fetchMore: queryObservable
      ? queryObservable.fetchMore.bind(queryObservable)
      : noop,
    updateQuery: queryObservable
      ? queryObservable.updateQuery.bind(queryObservable)
      : noop,
    startPolling: queryObservable
      ? queryObservable.startPolling.bind(queryObservable)
      : noop,
    stopPolling: queryObservable
      ? queryObservable.stopPolling.bind(queryObservable)
      : noop,
    subscribeToMore: queryObservable
      ? queryObservable.subscribeToMore.bind(queryObservable)
      : noop,
    client,
  };
}

function noop() {}
