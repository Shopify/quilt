import React from 'react';

import {useSerialized} from '@shopify/react-html';
import {
  ApolloProvider,
  createGraphQLClient,
  Options,
} from '@shopify/react-graphql';
import {useLazyRef} from '@shopify/react-hooks';

interface Props extends Partial<Options> {
  children?: React.ReactNode;
}

export function GraphQL({children, ...explicitOptions}: Props) {
  const [initialData, Serialize] = useSerialized<Options['initialData']>(
    'apollo',
  );

  const client = useLazyRef(() =>
    createGraphQLClient({initialData, ...explicitOptions}),
  ).current;

  return (
    <>
      <ApolloProvider client={client}>{children}</ApolloProvider>
      <Serialize data={() => client.resolve()} />
    </>
  );
}
