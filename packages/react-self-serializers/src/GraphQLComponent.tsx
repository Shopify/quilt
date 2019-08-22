import React from 'react';

import {useSerialized} from '@shopify/react-html';
import {ApolloProvider, createSsrExtractableLink} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';

interface Props {
  children?: React.ReactNode;
  createClient(): import('apollo-client').ApolloClient<any>;
}

export function GraphQL({children, createClient}: Props) {
  const [initialData, Serialize] = useSerialized<object | undefined>('apollo');

  const [client, link] = useLazyRef<
    [
      import('apollo-client').ApolloClient<any>,
      ReturnType<typeof createSsrExtractableLink>
    ]
  >(() => {
    const link = createSsrExtractableLink();
    const client = createClient();
    client.link = link.concat(client.link);

    if (initialData) {
      client.cache = client.cache.restore(initialData);
    }

    return [client, link];
  }).current;

  const apolloProvider = (
    // @ts-ignore
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );

  return (
    <>
      {apolloProvider}
      <Serialize data={() => link.resolveAll(() => client.extract())} />
    </>
  );
}
