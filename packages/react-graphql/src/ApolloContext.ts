import React from 'react';
import {ApolloClient} from '@apollo/client';
import {DocumentNode} from 'graphql-typed';

export interface ApolloContextValue<CacheShape = any> {
  client?: ApolloClient<CacheShape>;
  operations?: Map<string, {query: DocumentNode; variables: any}>;
}

export const ApolloContext = React.createContext<
  ApolloContextValue | undefined
>(undefined);
