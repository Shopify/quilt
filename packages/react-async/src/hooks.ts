import {useState, useCallback, useContext} from 'react';
import {Resolver} from '@shopify/async';
import {useServerEffect} from '@shopify/react-effect';
import {useMountedRef} from '@shopify/react-hooks';
import {IfAllOptionalKeys, NoInfer} from '@shopify/useful-types';

import {AsyncAssetContext} from './context/assets';
import {AssetTiming, AsyncComponentType} from './types';

export type Preloadable<PreloadOptions extends object> = Pick<
  AsyncComponentType<any, any, PreloadOptions, any, any>,
  'usePreload'
>;

export type Prefetchable<PrefetchOptions extends object> = Pick<
  AsyncComponentType<any, any, any, PrefetchOptions, any>,
  'usePrefetch'
>;

export type KeepFreshable<KeepFreshOptions extends object> = Pick<
  AsyncComponentType<any, any, any, any, KeepFreshOptions>,
  'useKeepFresh'
>;

export function usePreload<PreloadOptions extends object>(
  ...args: IfAllOptionalKeys<
    PreloadOptions,
    [Preloadable<PreloadOptions>, PreloadOptions?],
    [Preloadable<PreloadOptions>, NoInfer<PreloadOptions>]
  >
): ReturnType<typeof args[0]['usePreload']> {
  const [preloadable, options = {}] = args;
  return (preloadable.usePreload as any)(options);
}

export function usePrefetch<PrefetchOptions extends object>(
  ...args: IfAllOptionalKeys<
    PrefetchOptions,
    [Prefetchable<PrefetchOptions>, PrefetchOptions?],
    [Prefetchable<PrefetchOptions>, NoInfer<PrefetchOptions>]
  >
): ReturnType<typeof args[0]['usePrefetch']> {
  const [prefetchable, options = {}] = args;
  return (prefetchable.usePrefetch as any)(options);
}

export function useKeepFresh<KeepFreshOptions extends object>(
  ...args: IfAllOptionalKeys<
    KeepFreshOptions,
    [KeepFreshable<KeepFreshOptions>, KeepFreshOptions?],
    [KeepFreshable<KeepFreshOptions>, NoInfer<KeepFreshOptions>]
  >
): ReturnType<typeof args[0]['useKeepFresh']> {
  const [keepFreshable, options = {}] = args;
  return (keepFreshable.useKeepFresh as any)(options);
}

interface Options {
  immediate?: boolean;
  assets?: AssetTiming;
  styles?: AssetTiming;
  scripts?: AssetTiming;
}

export function useAsync<T>(
  resolver: Resolver<T>,
  {assets, scripts = assets, styles = assets, immediate = true}: Options = {},
) {
  const [value, setValue] = useState<T | Error | null>(() =>
    immediate || typeof window !== 'undefined' ? resolver.resolved : null,
  );

  const mounted = useMountedRef();

  const load = useCallback(async (): Promise<T | Error> => {
    if (value != null) {
      return value;
    }

    try {
      const resolved = await resolver.resolve();

      if (mounted.current) {
        // It's important to use the function form of setValue here.
        // Resolved is going to be a function in most cases, since it's
        // a React component. If you do not set it using the function form,
        // React treats the component as the function that returns state,
        // so it sets state with the result of manually calling the component
        // (so, usually JSX).
        setValue(() => resolved);
      }

      return resolved;
    } catch (error) {
      if (mounted.current) {
        setValue(error);
      }

      return error;
    }
  }, [mounted, resolver, value]);

  const {id} = resolver;

  useAsyncAsset(id, {scripts, styles});

  return value instanceof Error
    ? {id, resolved: null, error: value, loading: false, load}
    : {
        id,
        resolved: value,
        error: null,
        loading: value == null,
        load,
      };
}

export function useAsyncAsset(
  id?: string,
  {scripts, styles}: {styles?: AssetTiming; scripts?: AssetTiming} = {},
) {
  const async = useContext(AsyncAssetContext);

  useServerEffect(
    () => {
      if (async && id) {
        async.markAsUsed(id, {scripts, styles});
      }
    },
    async ? async.effect : undefined,
  );
}
