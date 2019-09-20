import React from 'react';

import ApolloClient, {ApolloClientOptions} from 'apollo-client';
import {useSerialized} from '@shopify/react-html';
import {
  ApolloProvider,
  createSsrExtractableLink,
  createOperationDetailsLink,
  GraphQLOperationDetails,
} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';
import {createApolloBridge} from '@shopify/react-effect-apollo';
import {useNetworkManager} from '@shopify/react-network';

export type GraphQLClientOptions = ApolloClientOptions<any>;
export const GRAPHQL_OPERATIONS = Symbol('graphQLOperations');

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
                const newServerState = addOperationToServerState(
                  network.getServerState(),
                  operation,
                );
                network.setServerState(newServerState);
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

  const ApolloBridge = createApolloBridge();

  return (
    <ApolloBridge>
      <ApolloProvider client={client}>{children}</ApolloProvider>
      <Serialize data={() => link.resolveAll(() => client.extract())} />
    </ApolloBridge>
  );
}

function addOperationToServerState(
  serverState: {},
  operation: GraphQLOperationDetails,
) {
  const operations = serverState[GRAPHQL_OPERATIONS] || [];
  const newState = {...serverState};
  newState[GRAPHQL_OPERATIONS] = operations.concat(operation);
  return newState;
}
