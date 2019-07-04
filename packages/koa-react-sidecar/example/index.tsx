import React from 'react';
import {ApolloProvider} from '@shopify/react-graphql';
import {createServer} from '../src/server';

function MockApp() {
  return <div>I am react</div>;
}

createServer({
  port: 4444,
  graphQLClientOptions: {},
  render: ({graphQLClient}) => {
    if (graphQLClient) {
      return (
        <ApolloProvider client={graphQLClient}>
          <MockApp />
        </ApolloProvider>
      );
    }

    return <MockApp />;
  },
});
