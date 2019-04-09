import {
  OperationVariables,
  ApolloError,
  WatchQueryOptions,
} from 'apollo-client';
import {DocumentNode} from 'graphql-typed';
import {useEffect, useMemo, useState} from 'react';

import {AsyncQueryComponentType} from '..';

import {QueryHookOptions, QueryHookResult} from './types';
import {useApolloClient} from './apollo-client';
import useGraphQLDocument from './graphql-document';
import {
  getCachedObservableQuery,
  invalidateCachedObservableQuery,
} from './query-cache';
import {compact, objectToKey} from './utilities';

export default function useQuery<
  Data = any,
  Variables = OperationVariables,
  DeepPartial = {}
>(
  queryOrComponent:
    | DocumentNode<Data, Variables>
    | AsyncQueryComponentType<Data, Variables, DeepPartial>,
  options: QueryHookOptions<Data, Variables> = {},
): QueryHookResult<Data, Variables> {
  const {
    skip = false,
    pollInterval,
    notifyOnNetworkStatusChange = false,
    client: overrideClient,
    context,
    variables,
    fetchPolicy,
    errorPolicy,
  } = options;

  const [responseId, setResponseId] = useState(0);
  const client = useApolloClient(overrideClient);
  const query = useGraphQLDocument(queryOrComponent);

  const watchQueryOptions: WatchQueryOptions<Variables> = useMemo(
    () =>
      compact({
        context,
        errorPolicy,
        fetchPolicy,
        notifyOnNetworkStatusChange,
        pollInterval,
        query,
        variables,
      }),
    [
      context,
      errorPolicy,
      fetchPolicy,
      notifyOnNetworkStatusChange,
      pollInterval,
      query,
      variables,
    ],
  );

  const observableQuery = useMemo(
    () => {
      if (!query) {
        return;
      }

      return getCachedObservableQuery<Data, Variables>(
        client,
        watchQueryOptions,
      );
    },
    [query, client, watchQueryOptions],
  );

  useEffect(
    () => {
      if (skip || !observableQuery) {
        return;
      }

      const invalidateCurrentResult = () => {
        setResponseId(x => x + 1);
      };
      const subscription = observableQuery.subscribe(
        invalidateCurrentResult,
        invalidateCurrentResult,
      );

      invalidateCachedObservableQuery(client, watchQueryOptions);

      return () => {
        subscription.unsubscribe();
      };
    },
    [skip, observableQuery, client, watchQueryOptions],
  );

  const currentResult = useMemo<QueryHookResult<Data, Variables>>(
    () => {
      if (!observableQuery) {
        return {
          data: undefined,
          error: undefined,
          loading: true,
          networkStatus: undefined,
          variables,
          refetch: noop as any,
          fetchMore: noop as any,
          updateQuery: noop as any,
          startPolling: noop as any,
          stopPolling: noop as any,
          subscribeToMore: noop as any,
          client,
        };
      }

      const result = observableQuery.currentResult();

      // return the old result data when there is an error
      let data = result.data;
      if (result.error || result.errors) {
        data = {
          ...(result.data || {}),
          ...(observableQuery.getLastResult() || {}),
        };
      }

      return {
        ...result,
        data,
        error:
          result.errors && result.errors.length > 0
            ? new ApolloError({graphQLErrors: result.errors})
            : result.error,
        variables: observableQuery.variables,
        refetch: observableQuery.refetch.bind(observableQuery),
        fetchMore: observableQuery.fetchMore.bind(observableQuery),
        updateQuery: observableQuery.updateQuery.bind(observableQuery),
        startPolling: observableQuery.startPolling.bind(observableQuery),
        stopPolling: observableQuery.stopPolling.bind(observableQuery),
        subscribeToMore: observableQuery.subscribeToMore.bind(observableQuery),
        client,
      };
    },
    [observableQuery, client, variables],
  );

  return currentResult;
}

function noop() {}
