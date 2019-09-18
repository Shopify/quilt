import React from 'react';

import ApolloClient, {ApolloClientOptions} from 'apollo-client';
import {useSerialized} from '@shopify/react-html';
import {
  ApolloProvider,
  createSsrExtractableLink,
  createOperationDetailsLink,
} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';
import {useNetworkManager} from '@shopify/react-network';

export type GraphQLClientOptions = ApolloClientOptions<any>;
const GRAPHQL_OPERATIONS = Symbol('graphQLOperations');

interface Props {
  children?: React.ReactNode;
  createClientOptions(): ApolloClientOptions<any>;
}

export function GraphQLUniversalProvider({
  children,
  createClientOptions,
}: Props) {
  const [initialData, Serialize] = useSerialized<object | undefined>('apollo');
  const network = useNetworkManager();

  const [client, link] = useLazyRef<
    [
      import('apollo-client').ApolloClient<any>,
      ReturnType<typeof createSsrExtractableLink>
    ]
  >(() => {
    const clientOptions = createClientOptions();
    const link = createSsrExtractableLink();

    if (clientOptions.link) {
      clientOptions.link = link
        .concat(
          createOperationDetailsLink({
            onOperation(operation) {
              if (network) {
                const serverState = network.getState();
                const operations = serverState[GRAPHQL_OPERATIONS] || [];
                const newState = {...serverState};
                newState[GRAPHQL_OPERATIONS] = operations.concat(operation);
                network.setState(newState);
              }
            },
          }),
        )
        .concat(clientOptions.link);
    }

    if (initialData) {
      clientOptions.cache = clientOptions.cache.restore(initialData);
    }

    return [new ApolloClient(clientOptions), link];
  }).current;

  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
      <Serialize data={() => link.resolveAll(() => client.extract())} />
    </>
  );
}
