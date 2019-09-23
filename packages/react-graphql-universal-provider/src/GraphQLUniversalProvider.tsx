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
                network.setServerState(currentState =>
                  addOperationToServerState(currentState, operation),
                );
              }
            },
          }),
        )
        .concat(clientOptions.link);
    }

    const apolloClient = new ApolloClient(clientOptions);

    if (initialData) {
      apolloClient.cache = apolloClient.cache.restore(initialData);
    }

    return [apolloClient, link];
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
  state: {},
  operation: GraphQLOperationDetails,
) {
  const operations = state[GRAPHQL_OPERATIONS] || [];
  state[GRAPHQL_OPERATIONS] = operations.concat(operation);
  return state;
}
