import React, {useEffect} from 'react';
import {DocumentNode} from 'graphql-typed';
import {NetworkStatus} from 'apollo-client';

import {createResolver, ResolverOptions} from '@shopify/async';
import {AsyncComponentType, useAsync, AssetTiming} from '@shopify/react-async';
import {Omit} from '@shopify/useful-types';
import {useIdleCallback} from '@shopify/react-idle';

import {Query} from './Query';
import {useBackgroundQuery, useApolloClient} from './hooks';
import {AsyncQueryComponentType, QueryProps, VariableOptions} from './types';

interface Options<Data, Variables, DeepPartial>
  extends ResolverOptions<DocumentNode<Data, Variables, DeepPartial>> {}

export function createAsyncQueryComponent<Data, Variables, DeepPartial>({
  id,
  load,
}: Options<Data, Variables, DeepPartial>): AsyncQueryComponentType<
  Data,
  Variables,
  DeepPartial
> {
  const resolver = createResolver({id, load});

  function AsyncQuery(props: Omit<QueryProps<Data, Variables>, 'query'>) {
    const client = useApolloClient(props.client);
    const {load, resolved: query} = useAsync(resolver, {
      assets: AssetTiming.Immediate,
    });

    useEffect(
      () => {
        load();
      },
      [load],
    );

    return query ? (
      <Query query={query} {...props as any} />
    ) : (
      props.children({
        data: undefined,
        loading: true,
        called: false,
        variables: (props as any).variables,
        client,
        networkStatus: NetworkStatus.loading,
        refetch: noop as any,
        fetchMore: noop as any,
        updateQuery: noop as any,
        startPolling: noop as any,
        stopPolling: noop as any,
        subscribeToMore: noop as any,
      })
    );
  }

  function usePreload() {
    return useAsync(resolver, {assets: AssetTiming.NextPage}).load;
  }

  function usePrefetch(options: VariableOptions<Variables>) {
    const load = usePreload();
    return useBackgroundQuery(load, options);
  }

  function useKeepFresh(
    options: VariableOptions<Variables> & Pick<QueryProps, 'pollInterval'>,
  ) {
    const load = usePreload();
    return useBackgroundQuery(load, {pollInterval: 10_000, ...options});
  }

  function Preload() {
    useIdleCallback(usePreload());
    return null;
  }

  function Prefetch(options: VariableOptions<Variables>) {
    useIdleCallback(usePrefetch(options));
    return null;
  }

  function KeepFresh(
    options: VariableOptions<Variables> & Pick<QueryProps, 'pollInterval'>,
  ) {
    useIdleCallback(useKeepFresh(options));
    return null;
  }

  // Once we upgrade past TS 3.1, this will no longer be necessary,
  // because you can statically assign values to functions and TS
  // will know to augment its type
  const FinalComponent: AsyncComponentType<
    DocumentNode<Data, Variables, DeepPartial>,
    Omit<QueryProps<Data, Variables>, 'query'>,
    {},
    VariableOptions<Variables>,
    VariableOptions<Variables> & Pick<QueryProps, 'pollInterval'>
  > = AsyncQuery as any;

  Reflect.defineProperty(FinalComponent, 'resolver', {
    value: resolver,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'Preload', {
    value: Preload,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'Prefetch', {
    value: Prefetch,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'KeepFresh', {
    value: KeepFresh,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'usePreload', {
    value: usePreload,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'usePrefetch', {
    value: usePrefetch,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'useKeepFresh', {
    value: useKeepFresh,
    writable: false,
  });

  return FinalComponent;
}

function noop() {}
