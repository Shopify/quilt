import React from 'react';
import {ApolloClient} from '@apollo/client';

import {ApolloContext} from '../ApolloContext';

export default function useApolloClient<CacheShape>(
  overrideClient?: ApolloClient<CacheShape>,
): ApolloClient<CacheShape> {
  const context = React.useContext(ApolloContext);

  // Ensures that the number of hooks called from one render to another remains
  // constant, despite the Apollo client read from context being swapped for
  // one passed directly as prop.
  if (overrideClient) {
    return overrideClient;
  }

  if (!context || !context.client) {
    // https://github.com/apollographql/react-apollo/blob/5cb63b3625ce5e4a3d3e4ba132eaec2a38ef5d90/src/component-utils.tsx#L19-L22
    throw new Error(
      [
        'Could not find "client" in the context or passed in as a prop. ',
        'Wrap the root component in an <ApolloProvider>, or pass an ',
        'ApolloClient instance in via props.',
      ].join(),
    );
  }

  return context.client;
}
