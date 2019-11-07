import React from 'react';
import ApolloClient, {ApolloClientOptions} from 'apollo-client';
import {useSerialized} from '@shopify/react-html';
import {ApolloProvider, createSsrExtractableLink} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';

interface Props {
  children?: React.ReactNode;
  createClientOptions(): ApolloClientOptions<any>;
}

export function GraphQLUniversalProvider({
  children,
  createClientOptions,
}: Props) {
  const [initialData, Serialize] = useSerialized<object | undefined>('apollo');

  const [client, link] = useLazyRef<
    [
      import('apollo-client').ApolloClient<any>,
      ReturnType<typeof createSsrExtractableLink>
    ]
  >(() => {
    const clientOptions = createClientOptions();
    const link = createSsrExtractableLink();

    const apolloClient = new ApolloClient({
      ...clientOptions,
      link: clientOptions.link ? link.concat(clientOptions.link) : link,
      cache: initialData
        ? clientOptions.cache.restore(initialData)
        : clientOptions.cache,
    });

    return [apolloClient, link];
  }).current;

  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
      <Serialize data={() => link.resolveAll(() => client.extract())} />
    </>
  );
}
