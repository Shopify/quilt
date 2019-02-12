import * as React from 'react';

import {LoadProps} from '@shopify/async';
import {Async} from '@shopify/react-async';
import {Omit} from '@shopify/useful-types';
import {DocumentNode} from 'graphql-typed';

import {Prefetch as PrefetchQuery} from './Prefetch';
import {Query} from './Query';
import {AsyncQueryComponentType, QueryProps, VariableOptions} from './types';

interface QueryComponentOptions<Data, Variables>
  extends LoadProps<DocumentNode<Data, Variables>> {}

export function createAsyncQueryComponent<Data, Variables>({
  id,
  load,
}: QueryComponentOptions<Data, Variables>): AsyncQueryComponentType<
  Data,
  Variables
> {
  function AsyncQuery(props: Omit<QueryProps<Data, Variables>, 'query'>) {
    return (
      <Async
        load={load}
        id={id}
        render={query =>
          query ? <Query query={query} {...props as any} /> : null
        }
      />
    );
  }

  function Prefetch({variables}: VariableOptions<Variables>) {
    return (
      <Async
        defer
        load={load}
        render={query =>
          query ? (
            <PrefetchQuery ignoreCache query={query} variables={variables} />
          ) : null
        }
      />
    );
  }

  function Preload() {
    return <Async defer load={load} id={id} />;
  }

  type KeepFreshProps = VariableOptions<Variables> & {
    pollInterval?: number;
  };

  function KeepFresh({variables, pollInterval = 10_000}: KeepFreshProps) {
    return (
      <Async
        defer
        load={load}
        render={query =>
          query ? (
            <PrefetchQuery
              query={query}
              pollInterval={pollInterval}
              variables={variables}
            />
          ) : null
        }
      />
    );
  }

  // Once we upgrade past TS 3.1, this will no longer be necessary,
  // because you can statically assign values to functions and TS
  // will know to augment its type
  const FinalComponent: AsyncQueryComponentType<
    Data,
    Variables
  > = AsyncQuery as any;

  FinalComponent.Preload = Preload;
  FinalComponent.Prefetch = Prefetch;
  FinalComponent.KeepFresh = KeepFresh;

  return FinalComponent;
}
