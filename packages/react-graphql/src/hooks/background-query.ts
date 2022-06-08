import {useEffect, useRef, useCallback} from 'react';
import {DocumentNode} from 'graphql-typed';
import {WatchQueryOptions} from '@apollo/client';

import useApolloClient from './apollo-client';

type Subscription = ReturnType<
  ReturnType<
    import('@apollo/client').ApolloClient<unknown>['watchQuery']
  >['subscribe']
>;

export function useBackgroundQuery(
  load: () => Promise<DocumentNode | null | Error>,
  options?: Omit<WatchQueryOptions, 'query'>,
) {
  const client = useApolloClient();
  const lastClient = useRef(client);
  const lastOptions = useRef(options);
  const serializedOptions = JSON.stringify(options);
  const lastSerializedOptions = useRef(serializedOptions);
  const subscription = useRef<Subscription | null>(null);
  const polling = useRef(Boolean(options && options.pollInterval));

  if (
    subscription.current != null &&
    (lastClient.current !== client ||
      lastSerializedOptions.current !== serializedOptions)
  ) {
    subscription.current.unsubscribe();
    subscription.current = null;
  }

  lastClient.current = client;
  lastOptions.current = options;
  lastSerializedOptions.current = serializedOptions;

  useEffect(
    () => () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
        subscription.current = null;
      }
    },
    [],
  );

  return useCallback(async () => {
    if (subscription.current) {
      return;
    }

    const query = await load();

    if (query == null || query instanceof Error) {
      return;
    }

    const observableQuery = lastClient.current.watchQuery({
      query,
      fetchPolicy: 'network-only',
      ...lastOptions.current,
    });

    const unsubscribe = () => {
      if (polling.current || subscription.current == null) {
        return;
      }

      subscription.current.unsubscribe();
      subscription.current = null;
    };

    subscription.current = observableQuery.subscribe(unsubscribe, unsubscribe);
  }, [load]);
}
