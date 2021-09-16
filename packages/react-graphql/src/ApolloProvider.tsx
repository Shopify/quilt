import React from 'react';
import {
  ApolloClient,
  ApolloProvider as OriginalApolloProvider,
} from '@apollo/client';

import {ApolloContext} from './ApolloContext';

export interface Props<CacheShape> {
  readonly client: ApolloClient<CacheShape>;
  readonly children?: React.ReactNode;
}

export function ApolloProvider<CacheShape = any>({
  client,
  children,
}: Props<CacheShape>) {
  const providerValue = React.useMemo(
    () => ({
      client,
      operations: (client as any).__operations_cache__,
    }),
    [client],
  );
  return (
    <OriginalApolloProvider client={client}>
      <ApolloContext.Provider value={providerValue}>
        {children}
      </ApolloContext.Provider>
    </OriginalApolloProvider>
  );
}
