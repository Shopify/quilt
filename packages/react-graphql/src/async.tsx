import * as React from 'react';

import {LoadProps} from '@shopify/async';
import {Async} from '@shopify/react-async';
import {Omit, IfEmptyObject, IfAllNullableKeys} from '@shopify/useful-types';
import {DocumentNode} from 'graphql-typed';

import {Prefetch as PrefetchQuery} from './Prefetch';
import {Query, Props as QueryProps} from './Query';

interface QueryComponentOptions<Data, Variables>
  extends LoadProps<DocumentNode<Data, Variables>> {}

export function createAsyncQueryComponent<Data, Variables>({
  id,
  load,
}: QueryComponentOptions<Data, Variables>) {
  type VariableOption = IfEmptyObject<
    Variables,
    {variables?: never},
    IfAllNullableKeys<
      Variables,
      {variables?: Variables},
      {variables: Variables}
    >
  >;

  function AsyncQuery(
    props: Omit<QueryProps<Data, Variables>, 'query' | 'variables'> &
      VariableOption,
  ) {
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

  function Prefetch({variables}: VariableOption) {
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

  type KeepFreshProps = VariableOption & {
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

  AsyncQuery.Preload = Preload;
  AsyncQuery.Prefetch = Prefetch;
  AsyncQuery.KeepFresh = KeepFresh;

  return AsyncQuery;
}
