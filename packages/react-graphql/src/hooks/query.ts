import {
  OperationVariables,
  ApolloError,
  WatchQueryOptions,
} from 'apollo-client';
import {DocumentNode} from 'graphql-typed';
import {useEffect, useMemo, useState, useRef} from 'react';

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
  options: QueryHookOptions<Variables> = {},
): QueryHookResult<Data, Variables> {
  const {
    skip = false,
    variables,
    fetchPolicy,
    errorPolicy,
    pollInterval,
    client: overrideClient,
    notifyOnNetworkStatusChange,
    context,
  } = options;

  const client = useApolloClient(overrideClient);
  const query = useGraphQLDocument(queryOrComponent);

  const watchQueryOptions = useMemo<WatchQueryOptions<Variables> | null>(
    () => {
      if (!query) {
        return null;
      }

      return {
        query,
        context,
        variables,
        fetchPolicy,
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      variables && JSON.stringify(variables),
      fetchPolicy,
      errorPolicy,
      pollInterval,
      notifyOnNetworkStatusChange,
    ],
  );

  const queryObservable = useMemo(
    () => {
      if (!watchQueryOptions) {
        return;
      }

      return client.watchQuery(watchQueryOptions);
    },
    [client, watchQueryOptions],
  );

  const defaultResult = useMemo<QueryHookResult<Data, Variables>>(
    () => ({
      data: undefined,
      error: undefined,
      networkStatus: undefined,
      loading: false,
      variables: queryObservable ? queryObservable.variables : variables,
      refetch: queryObservable
        ? queryObservable.refetch.bind(queryObservable)
        : (noop as any),
      fetchMore: queryObservable
        ? queryObservable.fetchMore.bind(queryObservable)
        : (noop as any),
      updateQuery: queryObservable
        ? queryObservable.updateQuery.bind(queryObservable)
        : (noop as any),
      startPolling: queryObservable
        ? queryObservable.startPolling.bind(queryObservable)
        : (noop as any),
      stopPolling: queryObservable
        ? queryObservable.stopPolling.bind(queryObservable)
        : (noop as any),
      subscribeToMore: queryObservable
        ? queryObservable.subscribeToMore.bind(queryObservable)
        : (noop as any),
      client,
    }),
    [queryObservable, client, variables],
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

  const previousData = useRef<
    QueryHookResult<Data, Variables>['data'] | undefined
  >(undefined);
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

      const result = queryObservable.currentResult();
      const {fetchPolicy} = queryObservable.options;

      const hasError = result.errors && result.errors.length > 0;
      let data = result.data;
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
        data = previousData;
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

function noop() {}
