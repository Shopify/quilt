import React from 'react';
import ApolloClient, {ApolloClientOptions} from 'apollo-client';
import {useSerialized} from '@shopify/react-html';
import {ApolloProvider, createSsrExtractableLink} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';

import {csrfLink} from './csrf-link';

interface Props {
  children?: React.ReactNode;
  createClientOptions(): ApolloClientOptions<any>;
}

export function GraphQLUniversalProvider({
  children,
  createClientOptions,
}: Props) {
  const [initialData, Serialize] = useSerialized<object | undefined>('apollo');

  const [client, ssrLink] = useLazyRef<
    [
      import('apollo-client').ApolloClient<any>,
      ReturnType<typeof createSsrExtractableLink>,
    ]
  >(() => {
    const clientOptions = createClientOptions();
    const ssrLink = createSsrExtractableLink();
    const link = ssrLink.concat(csrfLink);

    const apolloClient = new ApolloClient({
      ...clientOptions,
      link: clientOptions.link ? link.concat(clientOptions.link) : link,
      cache: initialData
        ? clientOptions.cache.restore(initialData)
        : clientOptions.cache,
    });

    return [apolloClient, ssrLink];
  }).current;

  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
      <Serialize data={() => ssrLink.resolveAll(() => client.extract())} />
    </>
  );
}
