// Test comment to republish beta
import React, {
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  ComponentType,
} from 'react';
import {createResolver, ResolverOptions, DeferTiming} from '@shopify/async';
import {IntersectionObserver} from '@shopify/react-intersection-observer';
import {OnIdle, useIdleCallback} from '@shopify/react-idle';
import {Hydrator, useHydrationManager} from '@shopify/react-hydrate';

import {useAsync} from './hooks';
import {AssetTiming, AsyncComponentType} from './types';

interface Options<
  Props extends object,
  PreloadOptions extends object = {},
  PrefetchOptions extends object = {},
  KeepFreshOptions extends object = {}
> extends ResolverOptions<ComponentType<Props>> {
  defer?: DeferTiming | ((props: Props) => boolean);
  deferHydration?: DeferTiming | ((props: Props) => boolean);
  displayName?: string;
  renderLoading?(props: Props): ReactNode;
  renderError?(error: Error): ReactNode;

  /**
   * Custom logic to use for the usePreload hook of the new, async
   * component. Because this logic will be used as part of a generated
   * custom hook, it must follow the rules of hooks.
   */
  usePreload?(props: PreloadOptions): () => void;

  /**
   * Custom logic to use for the usePrefetch hook of the new, async
   * component. Because this logic will be used as part of a generated
   * custom hook, it must follow the rules of hooks.
   */
  usePrefetch?(props: PrefetchOptions): () => void;

  /**
   * Custom logic to use for the useKeepFresh hook of the new, async
   * component. Because this logic will be used as part of a generated
   * custom hook, it must follow the rules of hooks.
   */
  useKeepFresh?(props: KeepFreshOptions): () => void;
}

export function createAsyncComponent<
  Props extends object,
  PreloadOptions extends object = {},
  PrefetchOptions extends object = {},
  KeepFreshOptions extends object = {}
>({
  id,
  load,
  defer,
  deferHydration,
  displayName,
  renderLoading = noopRender,
  renderError = defaultRenderError,
  usePreload: useCustomPreload = noopUse,
  usePrefetch: useCustomPrefetch = noopUse,
  useKeepFresh: useCustomKeepFresh = noopUse,
}: Options<
  Props,
  PreloadOptions,
  PrefetchOptions,
  KeepFreshOptions
>): AsyncComponentType<
  ComponentType<Props>,
  Props,
  PreloadOptions,
  PrefetchOptions,
  KeepFreshOptions
> {
  const resolver = createResolver({id, load});
  const componentName = displayName || displayNameFromId(resolver.id);
  const deferred = defer != null;
  const progressivelyHydrated = deferHydration != null;
  const scriptTiming =
    deferred || progressivelyHydrated
      ? AssetTiming.CurrentPage
      : AssetTiming.Immediate;
  const stylesTiming = deferred
    ? AssetTiming.CurrentPage
    : AssetTiming.Immediate;

  function Async(props: Props) {
    const {resolved: Component, load, loading, error} = useAsync(resolver, {
      scripts: scriptTiming,
      styles: stylesTiming,
      immediate: !deferred,
    });

    const {current: startedHydrated} = useRef(useHydrationManager().hydrated);

    if (error) {
      return renderError(error);
    }

    let loadingMarkup: ReactNode | null = null;

    if (progressivelyHydrated && !startedHydrated) {
      loadingMarkup = (
        <Loader defer={deferHydration} load={load} props={props} />
      );
    } else if (loading) {
      loadingMarkup = <Loader defer={defer} load={load} props={props} />;
    }

    let contentMarkup: ReactNode | null = null;
    const rendered = Component ? <Component {...props} /> : null;

    if (progressivelyHydrated && !startedHydrated) {
      contentMarkup = rendered ? (
        <Hydrator id={resolver.id}>{rendered}</Hydrator>
      ) : (
        <Hydrator id={resolver.id} />
      );
    } else if (loading) {
      contentMarkup = renderLoading(props);
    } else {
      contentMarkup = rendered;
    }

    return (
      <>
        {contentMarkup}
        {loadingMarkup}
      </>
    );
  }

  Async.displayName = `Async(${componentName})`;

  function usePreload(props: PreloadOptions) {
    const {load} = useAsync(resolver, {
      assets: AssetTiming.NextPage,
    });

    const customPreload = useCustomPreload(props);

    return useCallback(() => {
      load();

      if (customPreload) {
        customPreload();
      }
    }, [load, customPreload]);
  }

  function usePrefetch(props: PrefetchOptions) {
    const {load} = useAsync(resolver, {
      assets: AssetTiming.NextPage,
    });

    const customPrefetch = useCustomPrefetch(props);

    return useCallback(() => {
      load();

      if (customPrefetch) {
        customPrefetch();
      }
    }, [load, customPrefetch]);
  }

  function useKeepFresh(props: KeepFreshOptions) {
    const {load} = useAsync(resolver, {
      assets: AssetTiming.NextPage,
    });

    const customKeepFresh = useCustomKeepFresh(props);

    return useCallback(() => {
      load();

      if (customKeepFresh) {
        customKeepFresh();
      }
    }, [load, customKeepFresh]);
  }

  function Preload(options: PreloadOptions) {
    useIdleCallback(usePreload(options));
    return null;
  }

  Preload.displayName = `Async.Preload(${displayName})`;

  function Prefetch(options: PrefetchOptions) {
    const prefetch = usePrefetch(options);

    useEffect(() => {
      prefetch();
    }, [prefetch]);

    return null;
  }

  Prefetch.displayName = `Async.Prefetch(${displayName})`;

  function KeepFresh(options: KeepFreshOptions) {
    useIdleCallback(useKeepFresh(options));
    return null;
  }

  KeepFresh.displayName = `Async.KeepFresh(${displayName})`;

  const FinalComponent: AsyncComponentType<
    ComponentType<Props>,
    Props,
    PreloadOptions,
    PrefetchOptions,
    KeepFreshOptions
  > = Async as any;

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

function noopUse() {
  return () => {};
}

function noopRender() {
  return null;
}

const DEFAULT_DISPLAY_NAME = 'Component';
const FILENAME_REGEX = /([^/]*)\.\w+$/;

function displayNameFromId(id?: string) {
  if (!id) {
    return DEFAULT_DISPLAY_NAME;
  }

  const match = FILENAME_REGEX.exec(id);
  return match ? match[1] : DEFAULT_DISPLAY_NAME;
}

function defaultRenderError(error: Error) {
  if (error) {
    throw error;
  }

  return null;
}

function Loader<T>({
  defer,
  load,
  props,
}: {
  defer?: DeferTiming | ((props: T) => boolean);
  load(): void;
  props: T;
}) {
  const handleIntersection = useCallback(
    ({isIntersecting = true}) => {
      if (isIntersecting) {
        load();
      }
    },
    [load],
  );

  useEffect(() => {
    if (defer == null || defer === DeferTiming.Mount) {
      load();
    } else if (typeof defer === 'function' && defer(props)) {
      load();
    }
  }, [defer, load, props]);

  if (typeof defer === 'function') {
    return null;
  }

  switch (defer) {
    case DeferTiming.Idle:
      return <OnIdle perform={load} />;
    case DeferTiming.InViewport:
      return (
        <IntersectionObserver
          threshold={0}
          onIntersectionChange={handleIntersection}
        />
      );
    default:
      return null;
  }
}
