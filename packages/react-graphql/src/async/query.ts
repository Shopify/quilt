import type {DocumentNode} from 'graphql-typed';
import type {ResolverOptions} from '@shopify/async';
import {createResolver} from '@shopify/async';
import {useAsync, AssetTiming} from '@shopify/react-async';
import type {ApolloClient} from '@apollo/client';

import {useBackgroundQuery} from '../hooks';
import type {AsyncDocumentNode, QueryProps, VariableOptions} from '../types';

export interface Options<Data, Variables, DeepPartial>
  extends ResolverOptions<DocumentNode<Data, Variables, DeepPartial>> {
  client?: ApolloClient<any>;
}

export function createAsyncQuery<
  Data extends {},
  Variables extends {},
  DeepPartial extends {},
>({
  id,
  load,
  client,
}: Options<Data, Variables, DeepPartial>): AsyncDocumentNode<
  Data,
  Variables,
  DeepPartial
> {
  const resolver = createResolver({id, load});

  function usePreload() {
    return useAsync(resolver, {assets: AssetTiming.NextPage}).load;
  }

  function usePrefetch(
    options: VariableOptions<Variables> & Pick<QueryProps, 'fetchPolicy'>,
  ) {
    const load = usePreload();
    return useBackgroundQuery(load, options, client);
  }

  function useKeepFresh(
    options: VariableOptions<Variables> & Pick<QueryProps, 'pollInterval'>,
  ) {
    const load = usePreload();
    return useBackgroundQuery(load, {pollInterval: 10_000, ...options}, client);
  }

  return {
    resolver,
    usePreload,
    usePrefetch,
    useKeepFresh,
  } as any;
}
