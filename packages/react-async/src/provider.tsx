import * as React from 'react';
import {LoadProps, DeferTiming} from '@shopify/async';

import {Async} from './Async';

interface Options<Value> extends LoadProps<Value> {}

interface ProviderProps {
  children?: React.ReactNode;
}

interface ConsumerProps<Value> {
  children(value: Value | null): React.ReactNode;
}

export interface AsyncContextType<Value> {
  Context: React.Context<Value | null>;
  Provider: React.ComponentType<ProviderProps>;
  Consumer: React.ComponentType<ConsumerProps<Value>>;
  Preload: React.ComponentType<{}>;
}

export function createAsyncContext<Value>({
  id,
  load,
}: Options<Value>): AsyncContextType<Value> {
  const Context = React.createContext<Value | null>(null);

  function Provider(props: ProviderProps) {
    return (
      <Async
        load={load}
        id={id}
        render={value => <Context.Provider value={value} {...props} />}
      />
    );
  }

  function Consumer(props: ConsumerProps<Value>) {
    return <Context.Consumer {...props} />;
  }

  function Preload() {
    return <Async defer={DeferTiming.Idle} load={load} />;
  }

  return {Context, Provider, Consumer, Preload};
}
