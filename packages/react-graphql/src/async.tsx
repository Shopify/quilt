import * as React from 'react';

import {DocumentNode} from 'graphql-typed';
import {NetworkStatus} from 'apollo-client';
import {LoadProps, DeferTiming} from '@shopify/async';
import {
  Async,
  AsyncPropsRuntime,
  resolve as resolver,
  trySynchronousResolve,
} from '@shopify/react-async';
import {Omit} from '@shopify/useful-types';

import {useApolloClient} from './hooks';
import {Prefetch as PrefetchQuery} from './Prefetch';
import {Query} from './Query';
import {
  ConstantProps,
  AsyncQueryComponentType,
  QueryProps,
  VariableOptions,
} from './types';

interface QueryComponentOptions<Data, Variables, DeepPartial>
  extends LoadProps<DocumentNode<Data, Variables, DeepPartial>> {
  defer?: DeferTiming;
}

export function createAsyncQueryComponent<Data, Variables, DeepPartial>({
  id,
  load,
  defer,
}: QueryComponentOptions<
  Data,
  Variables,
  DeepPartial
>): AsyncQueryComponentType<Data, Variables, DeepPartial> {
  let resolvedDocument = trySynchronousResolve<
    DocumentNode<Data, Variables, DeepPartial>
  >({id, defer});

  async function resolve() {
    const response = await resolver(load);
    resolvedDocument = response;
    return response;
  }

  function AsyncQuery(
    props: Omit<QueryProps<Data, Variables>, 'query'> & ConstantProps,
  ) {
    const [componentProps, asyncProps] = splitProps(props);
    const client = useApolloClient();

    return (
      <Async
        id={id}
        load={load}
        defer={defer}
        render={query =>
          query ? (
            <Query query={query} {...componentProps as any} />
          ) : (
            componentProps.children({
              data: undefined,
              loading: true,
              variables: (componentProps as any).variables,
              client,
              networkStatus: NetworkStatus.loading,
              refetch: noop as any,
              fetchMore: noop as any,
              updateQuery: noop as any,
              startPolling: noop as any,
              stopPolling: noop as any,
              subscribeToMore: noop as any,
            })
          )
        }
        {...asyncProps}
      />
    );
  }

  function Prefetch(props: VariableOptions<Variables> & ConstantProps) {
    const [componentProps, asyncProps] = splitProps(props);
    const {variables} = componentProps;

    return (
      <Async
        load={load}
        defer={DeferTiming.Mount}
        render={query =>
          query ? (
            <PrefetchQuery ignoreCache query={query} variables={variables} />
          ) : null
        }
        {...asyncProps}
      />
    );
  }

  function Preload(props: ConstantProps) {
    const asyncProps = splitProps(props)[1];
    return (
      <Async defer={DeferTiming.Idle} load={load} id={id} {...asyncProps} />
    );
  }

  type KeepFreshProps = VariableOptions<Variables> & {
    pollInterval?: number;
  };

  function KeepFresh(props: KeepFreshProps & ConstantProps) {
    const [componentProps, asyncProps] = splitProps(props);
    const {variables, pollInterval = 10_000} = componentProps;

    return (
      <Async
        load={load}
        defer={DeferTiming.Idle}
        render={query =>
          query ? (
            <PrefetchQuery
              query={query}
              pollInterval={pollInterval}
              variables={variables}
            />
          ) : null
        }
        {...asyncProps}
      />
    );
  }

  // Once we upgrade past TS 3.1, this will no longer be necessary,
  // because you can statically assign values to functions and TS
  // will know to augment its type
  const FinalComponent: AsyncQueryComponentType<
    Data,
    Variables,
    DeepPartial
  > = AsyncQuery as any;

  FinalComponent.Preload = Preload;
  FinalComponent.Prefetch = Prefetch;
  FinalComponent.KeepFresh = KeepFresh;
  FinalComponent.resolve = resolve;

  Object.defineProperty(FinalComponent, 'resolved', {
    get: () => resolvedDocument,
  });

  Object.defineProperty(FinalComponent, 'id', {
    get: () => id && id(),
  });

  return FinalComponent;
}

function noop() {}

function splitProps<Props>(
  props: Props & ConstantProps,
): [Props, AsyncPropsRuntime] {
  const {async, ...rest} = props as any;
  return [rest, async];
}
