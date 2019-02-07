import * as React from 'react';
import {LoadProps} from '@shopify/async';

import {Async} from './Async';

interface Options<
  Props,
  PreloadProps = {},
  PrefetchProps = {},
  KeepFreshProps = {}
> extends LoadProps<React.ComponentType<Props>> {
  renderLoading?(): React.ReactNode;
  renderPreload?(props?: PreloadProps): React.ReactNode;
  renderPrefetch?(props?: PrefetchProps): React.ReactNode;
  renderKeepFresh?(props?: KeepFreshProps): React.ReactNode;
}

export function createAsyncComponent<
  Props,
  PreloadProps = {},
  PrefetchProps = {},
  KeepFreshProps = {}
>({
  load,
  id,
  renderLoading,
  renderPreload = noopRender,
  renderPrefetch = noopRender,
  renderKeepFresh = noopRender,
}: Options<Props, PreloadProps, PrefetchProps, KeepFreshProps>) {
  function AsyncComponent(props: Props) {
    return (
      <Async
        load={load}
        id={id}
        renderLoading={renderLoading}
        render={Component => (Component ? <Component {...props} /> : null)}
      />
    );
  }

  function Preload(props: PreloadProps) {
    return (
      <>
        {renderPreload(props)}
        <Async defer load={load} />
      </>
    );
  }

  function Prefetch(props: PrefetchProps) {
    return (
      <>
        {renderPrefetch(props)}
        <Async defer load={load} />
      </>
    );
  }

  function KeepFresh(props: KeepFreshProps) {
    return (
      <>
        {renderKeepFresh(props)}
        <Async defer load={load} />
      </>
    );
  }

  AsyncComponent.Preload = Preload;
  AsyncComponent.Prefetch = Prefetch;
  AsyncComponent.KeepFresh = KeepFresh;

  return AsyncComponent;
}

function noopRender() {
  return null;
}
