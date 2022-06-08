import React from 'react';
import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import {useSerialized} from '@shopify/react-html';
import {ApolloProvider, createSsrExtractableLink} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';
import {useRequestHeader} from '@shopify/react-network';

import {isServer} from './utilities';
import {createCsrfLink} from './csrf-link';
import {createRequestIdLink} from './request-id-link';

interface Props<TCacheShape extends NormalizedCacheObject> {
  id?: string;
  children?: React.ReactNode;
  quiltRails?: boolean;
  addRequestId?: boolean;
  createClientOptions(): Partial<ApolloClientOptions<TCacheShape>>;
}

export function GraphQLUniversalProvider<
  TCacheShape extends NormalizedCacheObject
>({
  id = 'apollo',
  quiltRails = true,
  addRequestId = true,
  children,
  createClientOptions,
}: Props<TCacheShape>) {
  const [initialData, Serialize] = useSerialized<TCacheShape | undefined>(id);
  const requestID = useRequestHeader('X-Request-ID');

  const [client, ssrLink] = useLazyRef<
    [
      import('@apollo/client').ApolloClient<any>,
      ReturnType<typeof createSsrExtractableLink> | undefined,
    ]
  >(() => {
    const server = isServer();

    const defaultClientOptions: Partial<ApolloClientOptions<TCacheShape>> = {
      ssrMode: server,
      ssrForceFetchDelay: 100,
      connectToDevTools: !server,
    };

    const clientOptions = createClientOptions();
    const ssrLink = server ? createSsrExtractableLink() : undefined;
    const csrfLink = quiltRails ? createCsrfLink() : undefined;
    const requestIdLink =
      addRequestId && requestID ? createRequestIdLink(requestID) : undefined;
    const finalLink = clientOptions.link || undefined;

    const link = ApolloLink.from([
      ...(ssrLink ? [ssrLink] : []),
      ...(csrfLink ? [csrfLink] : []),
      ...(requestIdLink ? [requestIdLink] : []),
      ...(finalLink ? [finalLink] : []),
    ]);

    const cache = clientOptions.cache
      ? clientOptions.cache
      : new InMemoryCache();

    const apolloClient = new ApolloClient({
      ...defaultClientOptions,
      ...clientOptions,
      link,
      cache: initialData ? cache.restore(initialData) : cache,
    });

    return [apolloClient, ssrLink];
  }).current;

  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
      <Serialize
        data={() =>
          ssrLink ? ssrLink.resolveAll(() => client.extract()) : undefined
        }
      />
    </>
  );
}
