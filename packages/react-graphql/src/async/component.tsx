import {useIdleCallback} from '@shopify/react-idle';

import {useQuery, QueryHookOptions} from '../hooks';
import {AsyncQueryComponentType, QueryProps, VariableOptions} from '../types';

import {Options, createAsyncQuery} from './query';

export function createAsyncQueryComponent<
  Data extends {},
  Variables extends {},
  DeepPartial extends {},
>(
  options: Options<Data, Variables, DeepPartial>,
): AsyncQueryComponentType<Data, Variables, DeepPartial> {
  const asyncQuery = createAsyncQuery(options);
  const {resolver, usePreload, usePrefetch, useKeepFresh} = asyncQuery;

  function AsyncQuery(
    options: QueryHookOptions<Data, Variables> &
      Pick<QueryProps<Data, Variables>, 'children'>,
  ) {
    const result = (useQuery as any)(asyncQuery, options);
    return options.children(result);
  }

  function Preload() {
    useIdleCallback(usePreload());
    return null;
  }

  function Prefetch(options: VariableOptions<Variables>) {
    useIdleCallback((usePrefetch as any)(options));
    return null;
  }

  function KeepFresh(
    options: VariableOptions<Variables> &
      Pick<QueryProps<Data, Variables>, 'pollInterval'>,
  ) {
    useIdleCallback((useKeepFresh as any)(options));
    return null;
  }

  // Once we upgrade past TS 3.1, this will no longer be necessary,
  // because you can statically assign values to functions and TS
  // will know to augment its type
  const FinalComponent: AsyncQueryComponentType<Data, Variables, DeepPartial> =
    AsyncQuery as any;

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
