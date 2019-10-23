import React, {Context, ComponentType, useEffect} from 'react';
import {createResolver, ResolverOptions} from '@shopify/async';
import {useIdleCallback} from '@shopify/react-idle';

import {useAsync} from './hooks';
import {AsyncComponentType, AssetTiming} from './types';

interface Options<Value> extends ResolverOptions<Value> {}

interface ProviderProps {
  children?: React.ReactNode;
}

interface ConsumerProps<Value> {
  children(value: Value | null): React.ReactNode;
}

export interface AsyncContextType<Value> {
  Context: React.Context<Value | null>;
}

export interface AsyncContextType<Value>
  extends AsyncComponentType<Value, never, {}, {}, {}> {
  Context: Context<Value | null>;
  Provider: ComponentType<ProviderProps>;
  Consumer: ComponentType<ConsumerProps<Value>>;
}

export function createAsyncContext<Value>({
  id,
  load,
}: Options<Value>): AsyncContextType<Value> {
  const resolver = createResolver({id, load});
  const Context = React.createContext<Value | null>(null);

  // Just like a "normal" value returned from `createContext`, rendering
  // the value itself is not supported. This component is just a placeholder
  // to provide a more useful error.
  function Root() {
    throw new Error(
      'Do not attempt to render the result of calling `createAsyncContext()` directly. Render its `.Provider` component instead.',
    );
  }

  function Provider(props: ProviderProps) {
    const {load, resolved} = useAsync(resolver, {
      assets: AssetTiming.Immediate,
    });

    useEffect(() => {
      load();
    }, [load]);

    return <Context.Provider value={resolved} {...props} />;
  }

  function Consumer(props: ConsumerProps<Value>) {
    return <Context.Consumer {...props} />;
  }

  function usePreload() {
    return useAsync(resolver, {
      assets: AssetTiming.NextPage,
    }).load;
  }

  function Preload() {
    const preload = usePreload();
    useIdleCallback(preload);
    return null;
  }

  function Prefetch() {
    const preload = usePreload();

    useEffect(() => {
      preload();
    }, [preload]);

    return null;
  }

  const FinalComponent: AsyncContextType<Value> = Root as any;

  Reflect.defineProperty(FinalComponent, 'resolver', {
    value: resolver,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'Provider', {
    value: Provider,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'Consumer', {
    value: Consumer,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'Context', {
    value: Context,
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
    value: Preload,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'usePreload', {
    value: usePreload,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'usePrefetch', {
    value: usePreload,
    writable: false,
  });

  Reflect.defineProperty(FinalComponent, 'useKeepFresh', {
    value: usePreload,
    writable: false,
  });

  return FinalComponent;
}
