import React from 'react';
import ApolloClient from 'apollo-client';
import {ApolloProvider as OriginalApolloProvider} from 'react-apollo';

import {ApolloContext} from './ApolloContext';

export interface Props<CacheShape> {
  readonly client: ApolloClient<CacheShape>;
  readonly children?: React.ReactNode;
}

export function ApolloProvider<CacheShape = any>({
  client,
  children,
}: Props<CacheShape>) {
  return (
    <OriginalApolloProvider client={client}>
      <ApolloContext.Provider
        value={{
          client,
          operations: (client as any).__operations_cache__,
        }}
      >
        {children}
      </ApolloContext.Provider>
    </OriginalApolloProvider>
  );
}
