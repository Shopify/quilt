import React from 'react';

import {useSerialized} from '@shopify/react-html';
import {
  ApolloProvider,
  createSsrExtractableLink,
  createOperationDetailsLink,
} from '@shopify/react-graphql';
import ApolloClient, {ApolloClientOptions} from 'apollo-client';
import {useLazyRef} from '@shopify/react-hooks';

export type GraphQLClientOptions = ApolloClientOptions<any>;

interface Props {
  children?: React.ReactNode;
  clientOptions: ApolloClientOptions<any>;
}

export function GraphQLUniversalProvider({children, clientOptions}: Props) {
  const [initialData, Serialize] = useSerialized<object | undefined>('apollo');
  const [client, link] = useLazyRef<
    [
      import('apollo-client').ApolloClient<any>,
      ReturnType<typeof createSsrExtractableLink>
    ]
  >(() => {
    const link = createSsrExtractableLink();

    if (clientOptions.link) {
      clientOptions.link = link
        .concat(
          createOperationDetailsLink({
            onOperation(operation) {
              // Log the operation for now. Later we'll update state
              console.log('~~~~~~ Calling onOperation: ', operation);
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
